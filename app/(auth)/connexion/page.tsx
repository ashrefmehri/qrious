import type { Metadata } from "next";
import Link from "next/link";
import { AuthSplit } from "@/components/screens/auth/AuthSplit";
import { ConnexionForm } from "@/components/screens/auth/ConnexionForm";
import { GoogleSignIn } from "@/components/screens/auth/GoogleSignIn";
import { Card } from "@/components/ui/Card";
import { Mosaic } from "@/components/ui/Mosaic";
import { EXAMPLE_ROWS } from "@/lib/mock";

export const metadata: Metadata = { title: "Connexion · Qrious" };

export default function ConnexionPage() {
  return (
    <AuthSplit
      panel={
        <>
          <h2 className="max-w-115 font-display text-[40px] leading-11.5 font-semibold tracking-[-0.02em]">
            Révise le Bac pièce par pièce
          </h2>
          <div aria-hidden className="mosaic-fill max-w-120">
            <Card>
              <Mosaic
                rows={[EXAMPLE_ROWS.maths, EXAMPLE_ROWS.physique, EXAMPLE_ROWS.info]}
                tileSize={22}
                showLegend={false}
                stagger
              />
            </Card>
          </div>
        </>
      }
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="py-3 font-bold text-magenta-texte underline hover:text-encre">
            Créer mon compte
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-1.5 pt-6 lg:pt-0">
        <h1 className="font-display text-[28px] leading-8.5 font-semibold tracking-[-0.02em] lg:text-[34px] lg:leading-10">
          Content de te revoir
        </h1>
        <p className="text-[15px] text-encre-douce lg:text-base">Ta mosaïque t&apos;attend là où tu l&apos;as laissée.</p>
      </div>

      <GoogleSignIn />
      <ConnexionForm />
    </AuthSplit>
  );
}
