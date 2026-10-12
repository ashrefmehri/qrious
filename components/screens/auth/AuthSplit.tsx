import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import "@/components/screens/landing/landing.css";

type AuthSplitProps = {
  /** Content of the navy panel (desktop only), under the logo. */
  panel: ReactNode;
  /** Line under the form (« Pas encore de compte ? … »). */
  footer: ReactNode;
  children: ReactNode;
};

/**
 * Connexion, Inscription and Mot de passe oublié: a navy panel next to the
 * form on desktop (≥ 1024 px); one column with the logo on top below that.
 */
export function AuthSplit({ panel, footer, children }: AuthSplitProps) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="hidden bg-nuit text-sur-nuit lg:flex lg:flex-[1_1_520px] lg:flex-col lg:gap-7 lg:px-14 lg:py-10">
        <Link href="/" aria-label="Qrious, accueil" className="self-start rounded-m">
          <Logo size={26} onDark />
        </Link>
        <div className="landing-in my-auto flex flex-col gap-6 [--i:1]">{panel}</div>
      </aside>

      <main className="flex flex-1 flex-col p-4 sm:px-6 lg:flex-[1_1_520px] lg:justify-center lg:px-14 lg:py-10">
        <div className="landing-in mx-auto flex w-full max-w-105 flex-1 flex-col gap-4 lg:flex-none lg:gap-4.5">
          <Link href="/" aria-label="Qrious, accueil" className="self-start rounded-m lg:hidden">
            <Logo size={22} />
          </Link>
          {children}
          <p className="mt-auto pt-4 text-center text-[15px] lg:mt-2 lg:pt-0 lg:text-left">{footer}</p>
        </div>
      </main>
    </div>
  );
}
