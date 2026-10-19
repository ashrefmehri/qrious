import type { ReactNode } from "react";
import type { TileState } from "@/lib/game-rules";
import { Button } from "./Button";
import { MosaicTile } from "./MosaicTile";

export type CoachCardProps = {
  title: string;
  /** One sentence: a concrete next step and a reason with a number. */
  children?: ReactNode;
  /** The chapter's tile, shown at 40 px. */
  tile?: TileState;
  actionLabel?: string;
  href?: string;
  onAction?: () => void;
};

/** The coach's one suggestion, on a nuit panel. At most one per screen; it never animates. */
export function CoachCard({ title, children, tile, actionLabel, href, onAction }: CoachCardProps) {
  return (
    <div className="flex flex-wrap items-center gap-3.5 rounded-l bg-nuit p-4 font-text text-sur-nuit sm:p-6">
      {tile && (
        <span aria-hidden className="flex">
          <MosaicTile state={tile} size={40} />
        </span>
      )}
      <div className="flex min-w-0 flex-[1_1_200px] flex-col gap-0.5">
        <p className="text-base leading-5.5 font-bold">{title}</p>
        {children && <p className="text-sm leading-5 text-sur-nuit-douce">{children}</p>}
      </div>
      {actionLabel && (
        <Button variant="reward" size="sm" href={href} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
