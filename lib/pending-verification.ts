import "server-only";
import { cookies } from "next/headers";

// Remembers which e-mail is waiting for its verification code between sign-up
// (or a refused sign-in) and the /verification page. httpOnly: scripts can't read it.
export const PENDING_EMAIL_COOKIE = "qrious-verification";
const MAX_AGE_SECONDS = 60 * 60;

export async function setPendingEmail(email: string): Promise<void> {
  (await cookies()).set(PENDING_EMAIL_COOKIE, email.toLowerCase(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getPendingEmail(): Promise<string | null> {
  return (await cookies()).get(PENDING_EMAIL_COOKIE)?.value ?? null;
}

export async function clearPendingEmail(): Promise<void> {
  (await cookies()).delete(PENDING_EMAIL_COOKIE);
}
