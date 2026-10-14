import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthSplit } from "@/components/screens/auth/AuthSplit";
import { BienvenuePanel } from "@/components/screens/bienvenue/BienvenuePanel";
import { BienvenueSkeleton } from "@/components/screens/bienvenue/BienvenueSkeleton";
import { BienvenueWizard } from "@/components/screens/bienvenue/BienvenueWizard";
import { getSections } from "@/server/queries/sections";
import { getCurrentStudent } from "@/server/queries/student";

export const metadata: Metadata = { title: "Bienvenue · Qrious" };

// Bienvenue (docs/05-screens.md): section, then pseudo + lycée. Every /app page
// sends students here until it's done, and it can't be opened again after.
export default function BienvenuePage() {
  return (
    <AuthSplit panel={<BienvenuePanel />} wide>
      {/* Reads the session at request time, so it sits behind a Suspense boundary (Cache Components). */}
      <Suspense fallback={<BienvenueSkeleton />}>
        <Bienvenue />
      </Suspense>
    </AuthSplit>
  );
}

async function Bienvenue() {
  const student = await getCurrentStudent();
  if (!student) redirect("/connexion?next=/app/bienvenue");
  if (student.profile) redirect("/app");

  const sections = await getSections();
  const needsConsent = !student.user.termsAcceptedAt || !student.user.ageConfirmedAt;
  return <BienvenueWizard sections={sections} needsConsent={needsConsent} />;
}
