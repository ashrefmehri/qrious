import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { ThemeSwitch } from "./ThemeSwitch";

export const metadata: Metadata = { title: "Tokens · Qrious" };

const TYPE_STYLES = [
  { name: "score", sample: "87" },
  { name: "display-xl", sample: "Révise le Bac pièce par pièce." },
  { name: "display-l", sample: "Ta mosaïque" },
  { name: "title", sample: "Prochaine tuile : Intégrales" },
  { name: "stat", sample: "1 180 XP" },
  { name: "question", sample: "Soit f la fonction définie sur ]0 ; +∞[ par f(x) = x ln(x). Quelle est sa dérivée ?" },
  { name: "body", sample: "Encore 6 bonnes réponses pour la rendre solide." },
  { name: "body-strong", sample: "Pas encore. La bonne réponse est C." },
  { name: "label", sample: "Question suivante" },
  { name: "caption", sample: "10 questions · 12 min · Moyen" },
  { name: "micro", sample: "Maîtrisé" },
];

const COLORS = [
  { name: "fond", swatch: "bg-fond" },
  { name: "surface", swatch: "bg-surface" },
  { name: "nuit", swatch: "bg-nuit" },
  { name: "sur-nuit", swatch: "bg-sur-nuit" },
  { name: "sur-nuit-douce", swatch: "bg-sur-nuit-douce" },
  { name: "ligne", swatch: "bg-ligne" },
  { name: "trait", swatch: "bg-trait" },
  { name: "encre", swatch: "bg-encre" },
  { name: "encre-douce", swatch: "bg-encre-douce" },
  { name: "magenta", swatch: "bg-magenta" },
  { name: "magenta-texte", swatch: "bg-magenta-texte" },
  { name: "magenta-clair", swatch: "bg-magenta-clair" },
  { name: "jaune", swatch: "bg-jaune" },
  { name: "sur-jaune", swatch: "bg-sur-jaune" },
  { name: "action", swatch: "bg-action" },
  { name: "sur-action", swatch: "bg-sur-action" },
  { name: "focus", swatch: "bg-focus" },
  { name: "juste", swatch: "bg-juste" },
  { name: "juste-clair", swatch: "bg-juste-clair" },
  { name: "faux", swatch: "bg-faux" },
  { name: "faux-clair", swatch: "bg-faux-clair" },
];

const TILES = [
  { label: "À découvrir", tile: "bg-surface border-2 border-tuile-vide", dot: false },
  { label: "Commencé", tile: "bg-tuile-commence", dot: false },
  { label: "Solide", tile: "bg-tuile-solide", dot: false },
  { label: "Maîtrisé", tile: "bg-tuile-maitrise", dot: true },
];

function ThemePanel({ theme, title }: { theme: "light" | "dark"; title: string }) {
  return (
    <section data-theme={theme} aria-label={title} className="flex flex-col gap-6 rounded-l bg-fond p-4 text-encre sm:p-6">
      <h3 className="title">{title}</h3>

      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {COLORS.map((color) => (
          <li key={color.name} className="flex flex-col gap-1">
            <span className={`h-12 rounded-m border border-ligne ${color.swatch}`} />
            <span className="caption text-encre-douce">{color.name}</span>
          </li>
        ))}
      </ul>

      <ul className="flex flex-wrap gap-4 rounded-l bg-surface p-4 shadow-carte">
        {TILES.map((tile) => (
          <li key={tile.label} className="flex items-center gap-2">
            <span className={`flex size-7 items-center justify-center rounded-tuile ${tile.tile}`}>
              {tile.dot && <span className="size-2 rounded-pill bg-tuile-maitrise-point" />}
            </span>
            <span className="caption">{tile.label}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3">
        <p className="label flex items-center gap-2 rounded-m bg-juste-clair px-4 py-3 text-juste">
          <Check aria-hidden size={18} strokeWidth={2.5} /> Juste
        </p>
        <p className="label flex items-center gap-2 rounded-m bg-faux-clair px-4 py-3 text-faux">
          <X aria-hidden size={18} strokeWidth={2.5} /> Pas encore
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-l bg-nuit p-6 text-sur-nuit">
        <p className="title">Prochaine tuile : Intégrales</p>
        <p className="body text-sur-nuit-douce">Encore 6 bonnes réponses pour la rendre solide.</p>
        <span className="label self-start rounded-m bg-jaune px-6 py-3 text-sur-jaune">Continuer</span>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span className="label rounded-m bg-action px-6 py-3 text-sur-action">Commencer</span>
        <span className="label text-magenta-texte">Tout voir</span>
      </div>
    </section>
  );
}

export default function TokensPage() {
  return (
    <main className="mx-auto flex max-w-page flex-col gap-10 px-4 py-10 sm:px-6 lg:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="display-l">Tokens et typographie</h1>
        <ThemeSwitch />
      </header>

      <section aria-labelledby="polices" className="flex flex-col gap-4">
        <h2 id="polices" className="title">Polices</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-l bg-surface p-6 shadow-carte">
            <p className="caption text-encre-douce">Bricolage Grotesque 600 · titres, scores</p>
            <p className="font-display text-4xl font-semibold">Aa Bb Éé 0123456789</p>
          </div>
          <div className="rounded-l bg-surface p-6 shadow-carte">
            <p className="caption text-encre-douce">Atkinson Hyperlegible 400 / 700 · texte</p>
            <p className="font-text text-4xl">Aa Bb Éé 0123456789</p>
            <p className="font-text text-4xl font-bold">Aa Bb Éé 0123456789</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="echelle" className="flex flex-col gap-4">
        <h2 id="echelle" className="title">Échelle typographique</h2>
        <ul className="flex flex-col gap-6 rounded-l bg-surface p-6 shadow-carte">
          {TYPE_STYLES.map((style) => (
            <li key={style.name} className="flex flex-col gap-1">
              <span className="caption text-encre-douce">.{style.name}</span>
              <span className={`${style.name} break-words`}>{style.sample}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="palette" className="flex flex-col gap-4">
        <h2 id="palette" className="title">Palette</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ThemePanel theme="light" title="Clair" />
          <ThemePanel theme="dark" title="Sombre" />
        </div>
      </section>
    </main>
  );
}
