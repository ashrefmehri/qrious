import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthSplit } from "@/components/screens/auth/AuthSplit";
import { NewStudentPanel } from "@/components/screens/auth/NewStudentPanel";
import { VerificationForm } from "@/components/screens/auth/VerificationForm";
import { VerificationSkeleton } from "@/components/screens/auth/VerificationSkeleton";
import { getPendingEmail } from "@/lib/pending-verification";
import { VERIFICATION_CODE_LENGTH, VERIFICATION_CODE_MINUTES } from "@/lib/validation/auth";
import { secondsBeforeNewCode } from "@/server/queries/auth";

export const metadata: Metadata = { title: "Vérifie ton e-mail · Qrious" };

// After sign-up (or a sign-in refused because the e-mail isn't verified yet):
// the student types the 6-digit code sent by e-mail. No mockup: same layout as Inscription.
export default function VerificationPage() {
  return (
    <AuthSplit
      panel={<NewStudentPanel />}
      footer={
        <>
          Pas le bon e-mail ?{" "}
          <Link href="/inscription" className="py-3 font-bold text-magenta-texte underline hover:text-encre">
            Recommencer
          </Link>
        </>
      }
    >
      {/* Reads the cookie at request time, so it sits behind a Suspense boundary (Cache Components). */}
      <Suspense fallback={<VerificationSkeleton />}>
        <Verification />
      </Suspense>
    </AuthSplit>
  );
}

async function Verification() {
  const email = await getPendingEmail();
  if (!email) redirect("/connexion");
  const wait = await secondsBeforeNewCode(email);

  return (
    <>
      <div className="flex flex-col gap-1.5 pt-6 lg:pt-0">
        <h1 className="font-display text-[28px] leading-8.5 font-semibold tracking-[-0.02em] lg:text-[34px] lg:leading-10">
          Vérifie ton e-mail
        </h1>
        <p className="text-[15px] text-encre-douce lg:text-base">
          On t&apos;a envoyé un code à {VERIFICATION_CODE_LENGTH} chiffres à <b className="text-encre">{email}</b>. Il
          est valable {VERIFICATION_CODE_MINUTES} minutes.
        </p>
      </div>
      <VerificationForm initialWait={wait} />
    </>
  );
}
