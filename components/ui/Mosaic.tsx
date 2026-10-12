import type { CSSProperties } from "react";
import type { TileState } from "@/lib/game-rules";
import { TILE_STATES } from "@/lib/game-rules";
import { MosaicTile, TILE_STATE_LABELS } from "./MosaicTile";

export type MosaicRow = {
  subject: string;
  /** Chapters in official programme order, so a tile never moves. */
  tiles: { chapter: string; state: TileState; highlight?: boolean; drop?: boolean }[];
};

export type MosaicProps = {
  rows: MosaicRow[];
  /** px: 20 phone, 24 tablet, 28 desktop. */
  tileSize?: number;
  showLegend?: boolean;
  /** Hides the subject name and count, for a single-subject mosaic. */
  hideHeads?: boolean;
  /** Tiles fade in one after another, row by row (q-stagger in motion.css). */
  stagger?: boolean;
};

/** One row per subject, one tile per chapter, with a legend. Place it inside a Card. */
export function Mosaic({ rows, tileSize = 20, showLegend = true, hideHeads = false, stagger = false }: MosaicProps) {
  // Each tile's place across all rows, so rows fill one after another.
  const firstTile = rows.map((_, r) => rows.slice(0, r).reduce((count, row) => count + row.tiles.length, 0));

  return (
    <div className="flex flex-col gap-3.5 font-text text-encre">
      {rows.map((row, r) => {
        const mastered = row.tiles.filter((tile) => tile.state === "maitrise").length;
        return (
          <div key={row.subject} className="flex flex-col gap-1.5">
            {!hideHeads && (
              <div className="flex justify-between gap-3 text-[13px] leading-4.5">
                <span className="font-bold">{row.subject}</span>
                <span className="text-encre-douce">
                  {mastered} / {row.tiles.length} maîtrisés
                </span>
              </div>
            )}
            <div role="list" aria-label={row.subject} className={`flex flex-wrap gap-1 ${stagger ? "q-stagger" : ""}`}>
              {row.tiles.map((tile, index) => (
                <span
                  key={index}
                  role="listitem"
                  className="inline-flex"
                  style={stagger ? ({ "--i": firstTile[r] + index } as CSSProperties) : undefined}
                >
                  <MosaicTile
                    state={tile.state}
                    label={tile.chapter}
                    size={tileSize}
                    highlight={tile.highlight}
                    drop={tile.drop}
                  />
                </span>
              ))}
            </div>
          </div>
        );
      })}
      {showLegend && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-ligne pt-2.5 text-xs text-encre-douce">
          {TILE_STATES.map((state) => (
            <span key={state} className="inline-flex items-center gap-1.5">
              <span aria-hidden className="inline-flex">
                <MosaicTile state={state} size={12} />
              </span>
              {TILE_STATE_LABELS[state]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
