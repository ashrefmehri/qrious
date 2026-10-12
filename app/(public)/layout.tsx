import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const FOOTER_LINKS = [
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/conditions", label: "Conditions" },
  { href: "#", label: "Contact" },
];

// Public pages: top bar (logo, Connexion, « Essayer gratuitement ») and footer.
export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="px-4 py-3 sm:px-6 lg:px-10 lg:py-4">
        <div className="mx-auto flex max-w-page items-center gap-7">
          <Link href="/" aria-label="Qrious, accueil" className="mr-auto rounded-m lg:mr-0">
            <span className="lg:hidden">
              <Logo size={22} />
            </span>
            <span className="hidden lg:inline">
              <Logo size={26} />
            </span>
          </Link>
          <nav aria-label="Navigation du site" className="hidden flex-1 gap-6 text-[15px] font-bold lg:flex">
            <a href="#comment-ca-marche" className="inline-flex min-h-11 items-center text-encre">
              Comment ça marche
            </a>
            <a href="#sections" className="inline-flex min-h-11 items-center text-encre">
              Sections
            </a>
          </nav>
          <Link
            href="/connexion"
            className="inline-flex min-h-11 items-center text-[15px] font-bold text-magenta-texte hover:text-encre"
          >
            Connexion
          </Link>
          {/* Hidden on phone: the hero has the same button right below. */}
          <div className="hidden sm:block">
            <Button href="/essai">Essayer gratuitement</Button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-ligne px-4 pt-6 pb-8 sm:px-6 lg:px-10 lg:pt-8 lg:pb-10">
        <div className="mx-auto flex max-w-page flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
          <Link href="/" aria-label="Qrious, accueil" className="self-start rounded-m sm:self-auto">
            <span className="sm:hidden">
              <Logo size={18} />
            </span>
            <span className="hidden sm:inline">
              <Logo size={20} />
            </span>
          </Link>
          <nav aria-label="Liens légaux" className="flex flex-1 flex-wrap gap-x-4 text-sm sm:gap-x-5">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex min-h-11 items-center text-encre-douce hover:text-encre"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <span className="text-[13px] text-encre-douce sm:text-sm">© 2026 Qrious</span>
        </div>
      </footer>
    </>
  );
}
