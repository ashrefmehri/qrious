// Mock data for screens built before the database (M3). Not real students or content.

import type { MosaicRow } from "@/components/ui/Mosaic";
import type { TileState } from "@/lib/game-rules";

function row(subject: string, states: TileState[]): MosaicRow {
  return { subject, tiles: states.map((state, i) => ({ chapter: `Chapitre ${i + 1}`, state })) };
}

/** A copy of `source` where tile `index` drops in with the yellow ring. */
function withDrop(source: MosaicRow, index: number): MosaicRow {
  return {
    ...source,
    tiles: source.tiles.map((tile, i) => (i === index ? { ...tile, highlight: true, drop: true } : tile)),
  };
}

/** Example mosaic rows for illustrations (landing, auth pages). */
export const EXAMPLE_ROWS = {
  maths: row("Mathématiques", [
    "maitrise", "maitrise", "maitrise", "solide", "solide", "commence",
    "solide", "commence", "vide", "commence", "commence", "vide",
  ]),
  physique: row("Physique-Chimie", ["maitrise", "solide", "solide", "commence", "commence", "vide", "vide", "vide", "vide", "vide"]),
  svt: row("Sciences naturelles", ["solide", "solide", "commence", "commence", "vide", "vide", "vide", "vide"]),
  info: row("Informatique", ["maitrise", "solide", "solide", "commence", "vide", "vide"]),
};

/** The Maths row of the landing demos: « Fonction logarithme » (tile 7) just became solide and drops in. */
export const EXAMPLE_MATHS_DROP = withDrop(EXAMPLE_ROWS.maths, 6);
