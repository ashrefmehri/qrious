import type { TileState } from "@/lib/game-rules";

export const TILE_STATE_LABELS: Record<TileState, string> = {
  vide: "À découvrir",
  commence: "Commencé",
  solide: "Solide",
  maitrise: "Maîtrisé",
};

export type MosaicTileProps = {
  state?: TileState;
  /** px: 20 phone, 24 tablet, 28 desktop, 40 featured. */
  size?: number;
  /** Chapter name, read by screen readers. */
  label?: string;
  /** Yellow ring on the tile that just changed. */
  highlight?: boolean;
  /** Plays the tile-drop animation once. */
  drop?: boolean;
};

const STATE_CLASSES: Record<TileState, string> = {
  vide: "border-2 border-tuile-vide bg-surface",
  commence: "bg-tuile-commence",
  solide: "bg-tuile-solide",
  maitrise: "bg-tuile-maitrise",
};

/** One chapter as a tile. States get darker as mastery grows, so they read without colour. */
export function MosaicTile({ state = "vide", size = 20, label, highlight = false, drop = false }: MosaicTileProps) {
  const word = TILE_STATE_LABELS[state].toLowerCase();
  const radius = size >= 32 ? "rounded-[9px]" : size < 16 ? "rounded-[3px]" : "rounded-tuile";
  const dot = Math.round(size * 0.3);

  return (
    <span
      role="img"
      aria-label={label ? `${label}, ${word}` : word}
      title={label ? `${label} · ${word}` : undefined}
      className={[
        "inline-flex shrink-0 items-center justify-center",
        radius,
        STATE_CLASSES[state],
        highlight ? "shadow-[0_0_0_3px_var(--surface),0_0_0_6px_var(--jaune)]" : "",
        drop ? "q-tile--drop" : "",
      ].join(" ")}
      style={{ width: size, height: size }}
    >
      {state === "maitrise" && (
        <span className="rounded-full bg-tuile-maitrise-point" style={{ width: dot, height: dot }} />
      )}
    </span>
  );
}
