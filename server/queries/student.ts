import "server-only";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import { profile } from "@/db/schema";
import { auth } from "@/lib/auth";

/**
 * The signed-in student and their profile (null until Bienvenue is finished),
 * or null if nobody is signed in. Read once per request.
 * Reads the request: call it inside a <Suspense> boundary (Cache Components).
 */
export const getCurrentStudent = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const [studentProfile] = await db.select().from(profile).where(eq(profile.id, session.user.id)).limit(1);
  return { user: session.user, profile: studentProfile ?? null };
});

/** Whether the student finished Bienvenue (one indexed lookup; used by proxy.ts). */
export async function hasProfile(userId: string): Promise<boolean> {
  const [row] = await db.select({ id: profile.id }).from(profile).where(eq(profile.id, userId)).limit(1);
  return Boolean(row);
}

/**
 * The gate of every /app page except Bienvenue: no session → Connexion,
 * no profile yet (section and pseudo) → Bienvenue. Nothing else opens before.
 */
export async function requireCompleteProfile() {
  const student = await getCurrentStudent();
  if (!student) redirect("/connexion?next=/app");
  if (!student.profile) redirect("/app/bienvenue");
  return { user: student.user, profile: student.profile };
}
