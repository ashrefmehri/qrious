import type { Metadata } from "next";
import Link from "next/link";
import { AuthSplit } from "@/components/screens/auth/AuthSplit";
import { ConnexionForm } from "@/components/screens/auth/ConnexionForm";
import { GoogleLogo } from "@/components/screens/auth/GoogleLogo";
import { Button } from "@/components/ui/Button";
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
          <Link href="/essai" className="py-3 font-bold text-magenta-texte underline hover:text-encre">
            Essayer gratuitement
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

      {/* M3: sign in with Google through Better Auth. */}
      <Button variant="secondary" size="lg" fullWidth>
        <GoogleLogo />
        Continuer avec Google
      </Button>

      <div className="flex items-center gap-3 text-[13px] text-encre-douce">
        <span aria-hidden className="h-px flex-1 bg-ligne" />
        ou avec ton e-mail
        <span aria-hidden className="h-px flex-1 bg-ligne" />
      </div>

      <ConnexionForm />
    </AuthSplit>
  );
}
