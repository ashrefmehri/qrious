"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { clearPendingEmail, getPendingEmail, setPendingEmail } from "@/lib/pending-verification";
import {
  fieldErrors,
  signInSchema,
  signUpSchema,
  verificationCodeSchema,
  type FieldErrors,
  type SignInField,
  type SignUpField,
} from "@/lib/validation/auth";
import { getSignInMethods, secondsBeforeNewCode } from "@/server/queries/auth";

// Every auth flow goes through these actions: inputs are checked again with Zod
// (never trust the browser) and Better Auth's errors become French messages.

const FORM_ERROR = "Ça n'a pas marché. Réessaie dans un instant.";
const GOOGLE_ONLY = "Ce compte utilise Google. Clique sur “Continuer avec Google”.";
const EMAIL_TAKEN_CODES = new Set(["USER_ALREADY_EXISTS", "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"]);

const errorCode = (error: unknown) => (error instanceof APIError ? String(error.body?.code) : null);

async function isGoogleOnly(email: string) {
  const methods = await getSignInMethods(email);
  return methods.includes("google") && !methods.includes("credential");
}

// ---------------------------------------------------------------------------
// Sign-up → e-mail code → signed in

export type SignUpResult = { errors?: FieldErrors<SignUpField>; formError?: string };

/** Creates the account and records consent. No session yet: the e-mail code comes first. */
export async function signUp(formData: FormData): Promise<SignUpResult> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors<SignUpField>(parsed.error) };
  const { email, password } = parsed.data;

  const consentedAt = new Date();
  try {
    // Better Auth sends the verification code (overrideDefaultEmailVerification).
    await auth.api.signUpEmail({
      body: { name: "", email, password, termsAcceptedAt: consentedAt, ageConfirmedAt: consentedAt },
      headers: await headers(),
    });
  } catch (error) {
    if (EMAIL_TAKEN_CODES.has(String(errorCode(error)))) {
      return { errors: { email: (await isGoogleOnly(email)) ? GOOGLE_ONLY : "Un compte existe déjà avec cet e-mail." } };
    }
    console.error("signUp failed", error);
    return { formError: FORM_ERROR };
  }

  await setPendingEmail(email);
  redirect("/verification");
}

export type VerifyResult = { error?: string };

/** Checks the 6-digit code; the right one verifies the e-mail and signs the student in. */
export async function verifyEmail(formData: FormData): Promise<VerifyResult> {
  const email = await getPendingEmail();
  if (!email) redirect("/connexion");

  const parsed = verificationCodeSchema.safeParse({ code: formData.get("code") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await auth.api.verifyEmailOTP({ body: { email, otp: parsed.data.code }, headers: await headers() });
  } catch (error) {
    switch (errorCode(error)) {
      case "INVALID_OTP":
        return { error: "Ce code n'est pas le bon. Vérifie-le et réessaie." };
      case "OTP_EXPIRED":
        return { error: "Ce code a expiré. Demande un nouveau code." };
      case "TOO_MANY_ATTEMPTS":
        return { error: "Trop d'essais avec ce code. Demande un nouveau code." };
      default:
        console.error("verifyEmail failed", error);
        return { error: FORM_ERROR };
    }
  }

  await clearPendingEmail();
  // A just-verified e-mail account has no profile yet: straight to Bienvenue.
  redirect("/app/bienvenue");
}

export type ResendResult = { waitSeconds: number; sent?: boolean; error?: string };

/** Sends a new code, at most once every RESEND_DELAY_SECONDS per e-mail. */
export async function resendVerificationCode(): Promise<ResendResult> {
  const email = await getPendingEmail();
  if (!email) redirect("/connexion");

  const wait = await secondsBeforeNewCode(email);
  if (wait > 0) return { waitSeconds: wait };

  try {
    await auth.api.sendVerificationOTP({ body: { email, type: "email-verification" }, headers: await headers() });
  } catch (error) {
    console.error("resendVerificationCode failed", error);
    return { waitSeconds: 0, error: FORM_ERROR };
  }
  return { waitSeconds: await secondsBeforeNewCode(email), sent: true };
}

// ---------------------------------------------------------------------------
// Sign-in

export type SignInResult = { errors?: FieldErrors<SignInField>; formError?: string };

/** Only paths inside the app, so ?next= can't send a student to another site. */
function safeNext(value: FormDataEntryValue | null): string {
  return typeof value === "string" && value.startsWith("/app") && !value.startsWith("//") ? value : "/app";
}

export async function signIn(formData: FormData): Promise<SignInResult> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors<SignInField>(parsed.error) };
  const { email, password } = parsed.data;

  try {
    await auth.api.signInEmail({ body: { email, password, rememberMe: true }, headers: await headers() });
  } catch (error) {
    const code = errorCode(error);
    if (code === "EMAIL_NOT_VERIFIED") {
      // Right password, e-mail not verified yet: Better Auth just sent a new code.
      await setPendingEmail(email);
      redirect("/verification");
    }
    if (code === "INVALID_EMAIL_OR_PASSWORD") {
      if (await isGoogleOnly(email)) return { errors: { email: GOOGLE_ONLY } };
      return { formError: "E-mail ou mot de passe incorrect." };
    }
    console.error("signIn failed", error);
    return { formError: FORM_ERROR };
  }

  redirect(safeNext(formData.get("next")));
}

// ---------------------------------------------------------------------------
// Google and sign-out

const authPage = z.enum(["/connexion", "/inscription"]);

/**
 * Sends the student to Google. They come back to /app, or to the page they
 * started from with ?erreur=google if they cancel or Google fails.
 */
export async function signInWithGoogle(from: string) {
  const page = authPage.parse(from);
  const result = await auth.api.signInSocial({
    body: {
      provider: "google",
      // The /app gate sends students without a profile to Bienvenue.
      callbackURL: "/app",
      errorCallbackURL: `${page}?erreur=google`,
    },
    headers: await headers(),
  });
  if (!result.url) redirect(`${page}?erreur=google`);
  redirect(result.url);
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}
