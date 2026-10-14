import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { MosaicTile } from "@/components/ui/MosaicTile";

export const metadata: Metadata = { title: "Page introuvable · Qrious" };

// Any URL that doesn't exist (and the pages not built yet: Conditions, Confidentialité…).
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lecture flex-col justify-center gap-6 px-4 py-10 sm:px-6">
      <Logo size={24} />
      <span aria-hidden className="flex">
        <MosaicTile state="vide" size={40} />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[28px] leading-8.5 font-semibold tracking-[-0.02em] lg:text-[34px] lg:leading-10">
          Cette page n&apos;existe pas.
        </h1>
        <p className="text-base leading-6 text-encre-douce">
          Le lien est peut-être ancien, ou cette page arrive bientôt.
        </p>
      </div>
      <Button href="/" size="lg" className="w-full sm:w-auto sm:self-start">
        Retour à l&apos;accueil
      </Button>
    </main>
  );
}
