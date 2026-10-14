import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { account, user, verification } from "@/db/schema";
import { RESEND_DELAY_SECONDS } from "@/lib/validation/auth";

/**
 * How an existing account signs in: "credential" (e-mail + password), "google"…
 * Empty if no account uses this e-mail. Better Auth stores e-mails in lowercase.
 */
export async function getSignInMethods(email: string): Promise<string[]> {
  const rows = await db
    .select({ providerId: account.providerId })
    .from(account)
    .innerJoin(user, eq(account.userId, user.id))
    .where(eq(user.email, email.toLowerCase()));
  return rows.map((row) => row.providerId);
}

/**
 * Seconds to wait before another verification code may be sent to this e-mail
 * (0 = now). Better Auth stores the current code under this identifier.
 */
export async function secondsBeforeNewCode(email: string): Promise<number> {
  const [latest] = await db
    .select({ createdAt: verification.createdAt })
    .from(verification)
    .where(eq(verification.identifier, `email-verification-otp-${email.toLowerCase()}`))
    .orderBy(desc(verification.createdAt))
    .limit(1);
  if (!latest) return 0;
  const elapsed = Math.floor((Date.now() - latest.createdAt.getTime()) / 1000);
  return Math.max(0, RESEND_DELAY_SECONDS - elapsed);
}
