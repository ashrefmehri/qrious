"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./Button";
import { Icon, type IconName } from "./Icon";
import { Logo } from "./Logo";

export type AppNavKey = "accueil" | "explorer" | "progres" | "classement" | "profil";

export type AppNavProps = {
  /** sidebar ≥ 1024 px, rail 640–1023 px, bar under 640 px. */
  variant: "sidebar" | "rail" | "bar";
  /** Defaults to the section of the current URL. */
  active?: AppNavKey;
};

const ITEMS: { key: AppNavKey; label: string; icon: IconName; href: string }[] = [
  { key: "accueil", label: "Accueil", icon: "home", href: "/app" },
  { key: "explorer", label: "Explorer", icon: "search", href: "/app/explorer" },
  { key: "progres", label: "Progrès", icon: "mosaic", href: "/app/progres" },
  { key: "classement", label: "Classement", icon: "trophy", href: "/app/classement" },
  { key: "profil", label: "Profil", icon: "user", href: "/app/profil" },
];

function keyFromPath(pathname: string): AppNavKey {
  const item = ITEMS.find((candidate) => candidate.key !== "accueil" && pathname.startsWith(candidate.href));
  return item?.key ?? "accueil";
}

const NAV = {
  sidebar: "flex h-full w-60 flex-col gap-6 border-r border-ligne bg-surface px-4 py-6",
  rail: "flex h-full w-20 flex-col items-center gap-4 border-r border-ligne bg-surface py-4",
  bar: "fixed inset-x-0 bottom-0 z-10 border-t border-ligne bg-surface pb-[env(safe-area-inset-bottom)]",
};

const LIST = {
  sidebar: "flex flex-col gap-1",
  rail: "flex flex-col gap-1",
  bar: "grid h-17 grid-cols-5",
};

const ITEM = {
  sidebar: "h-12 gap-3 rounded-xl px-3 text-[15px]",
  rail: "h-15 w-17 flex-col justify-center gap-0.75 rounded-xl text-[11px]",
  bar: "h-full flex-col justify-center gap-0.75 text-[11px]",
};

/**
 * The main navigation: same five destinations, same order, at every width.
 * The active item never animates between pages (docs/12-motion.md).
 */
export function AppNav({ variant, active }: AppNavProps) {
  const pathname = usePathname();
  const current = active ?? keyFromPath(pathname);

  return (
    <nav aria-label="Navigation principale" className={`font-text text-encre-douce ${NAV[variant]}`}>
      {variant !== "bar" && (
        <Link
          href="/app"
          aria-label="Qrious, accueil"
          className={`flex rounded-m ${variant === "sidebar" ? "px-2" : ""}`}
        >
          {variant === "sidebar" ? <Logo size={26} /> : <Logo size={28} symbolOnly />}
        </Link>
      )}

      <ul className={LIST[variant]}>
        {ITEMS.map((item) => {
          const on = item.key === current;
          // The bar marks the active item with colour and weight; sidebar and rail add a background.
          const state = on
            ? `font-bold text-magenta-texte ${variant === "bar" ? "" : "bg-magenta-clair"}`
            : "hover:bg-fond hover:text-encre";
          return (
            <li key={item.key} className="contents">
              <Link
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={`flex items-center transition-colors duration-150 ${ITEM[variant]} ${state}`}
              >
                <Icon name={item.icon} size={22} stroke={on ? 2.2 : 1.8} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {variant === "sidebar" && (
        <div className="mt-auto">
          <Button href="/app/defi" icon="zap" fullWidth>
            Défi rapide
          </Button>
        </div>
      )}
    </nav>
  );
}
