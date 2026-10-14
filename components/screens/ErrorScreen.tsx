import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { MosaicTile } from "@/components/ui/MosaicTile";

type ErrorScreenProps = {
  /** Reloads the part that failed (Next.js error boundaries). */
  onRetry: () => void;
};

/** « Ça n'a pas chargé. » + « Réessayer » (docs/05-screens.md), for error.tsx and global-error.tsx. */
export function ErrorScreen({ onRetry }: ErrorScreenProps) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lecture flex-col justify-center gap-6 px-4 py-10 sm:px-6">
      <Logo size={24} />
      <span aria-hidden className="flex">
        <MosaicTile state="vide" size={40} />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[28px] leading-8.5 font-semibold tracking-[-0.02em] lg:text-[34px] lg:leading-10">
          Ça n&apos;a pas chargé.
        </h1>
        <p className="text-base leading-6 text-encre-douce">
          Vérifie ta connexion internet, puis réessaie. Si ça continue, reviens dans quelques minutes.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={onRetry} className="w-full sm:w-auto">
          Réessayer
        </Button>
        <Button href="/" variant="secondary" size="lg" className="w-full sm:w-auto">
          Retour à l&apos;accueil
        </Button>
      </div>
    </main>
  );
}
