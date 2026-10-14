"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { profile, user } from "@/db/schema";
import { fieldErrors, type FieldErrors } from "@/lib/validation/auth";
import { profileSchema, profileWithConsentSchema, type ProfileField } from "@/lib/validation/profile";
import { getSections } from "@/server/queries/sections";
import { getCurrentStudent } from "@/server/queries/student";

export type CompleteProfileResult = { errors?: FieldErrors<ProfileField>; formError?: string };

const FORM_ERROR = "Ça n'a pas marché. Réessaie dans un instant.";
const PSEUDO_TAKEN = "Ce pseudo est déjà pris. Essaie une variante.";

/** True if Postgres refused the write because of this unique constraint. */
function violates(error: unknown, constraint: string): boolean {
  const pgError = (error as { cause?: unknown })?.cause ?? error;
  const { code, constraint: name } = (pgError ?? {}) as { code?: string; constraint?: string };
  return code === "23505" && name === constraint;
}

/**
 * Bienvenue: saves section + pseudo + lycée in one go (and the consent dates
 * for Google students who haven't ticked the boxes yet), then opens the app.
 */
export async function completeProfile(formData: FormData): Promise<CompleteProfileResult> {
  const student = await getCurrentStudent();
  if (!student) redirect("/connexion?next=/app/bienvenue");
  if (student.profile) redirect("/app");

  const needsConsent = !student.user.termsAcceptedAt || !student.user.ageConfirmedAt;
  const parsed = (needsConsent ? profileWithConsentSchema : profileSchema).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors<ProfileField>(parsed.error) };
  const { section: sectionId, pseudo, lycee } = parsed.data;

  const sections = await getSections();
  if (!sections.some((option) => option.id === sectionId)) return { errors: { section: "Choisis ta section." } };

  try {
    await db.transaction(async (tx) => {
      await tx.insert(profile).values({ id: student.user.id, pseudo, sectionId, lycee });
      if (needsConsent) {
        const consentedAt = new Date();
        await tx
          .update(user)
          .set({ termsAcceptedAt: consentedAt, ageConfirmedAt: consentedAt })
          .where(eq(user.id, student.user.id));
      }
    });
  } catch (error) {
    if (violates(error, "profile_pseudo_unique")) return { errors: { pseudo: PSEUDO_TAKEN } };
    // Already created (e.g. pressed twice): the profile exists, so just open the app.
    if (!violates(error, "profile_pkey")) {
      console.error("completeProfile failed", error);
      return { formError: FORM_ERROR };
    }
  }

  redirect("/app");
}
