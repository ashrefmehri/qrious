import type { Metadata } from "next";
import Link from "next/link";
import { AuthSplit } from "@/components/screens/auth/AuthSplit";
import { GoogleSignIn } from "@/components/screens/auth/GoogleSignIn";
import { InscriptionForm } from "@/components/screens/auth/InscriptionForm";
import { NewStudentPanel } from "@/components/screens/auth/NewStudentPanel";
import { MosaicTile } from "@/components/ui/MosaicTile";

export const metadata: Metadata = { title: "Inscription · Qrious" };

// The free trial is postponed (docs/08-onboarding.md): « Essayer gratuitement »
// leads here, so the panel shows a new student's empty mosaic, not a trial result.
export default function InscriptionPage() {
  return (
    <AuthSplit
      panel={<NewStudentPanel />}
      footer={
        <>
          Déjà un compte ?{" "}
          <Link href="/connexion" className="py-3 font-bold text-magenta-texte underline hover:text-encre">
            Se connecter
          </Link>
        </>
      }
    >
      {/* Phone and tablet: the navy panel becomes a small banner. */}
      <div className="flex items-center gap-3 rounded-m bg-nuit px-3.5 py-3 text-sur-nuit lg:hidden">
        <span aria-hidden className="flex">
          <MosaicTile state="vide" size={32} />
        </span>
        <p className="text-sm leading-5">
          <b>Une tuile par chapitre.</b> Ta mosaïque commence ici.
        </p>
      </div>

      <h1 className="mt-1 font-display text-[28px] leading-8.5 font-semibold tracking-[-0.02em] lg:mt-0 lg:text-[34px] lg:leading-10">
        Crée ton compte
      </h1>

      <GoogleSignIn />
      <InscriptionForm />
    </AuthSplit>
  );
}
