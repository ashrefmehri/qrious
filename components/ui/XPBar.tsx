import { formatNumber } from "@/lib/format";

export type XPBarProps = {
  level: number;
  /** XP inside the current level (« 240 » in « 240 / 400 XP »). */
  xp: number;
  /** XP the current level needs (« 400 »). */
  xpToNext: number;
};

/** The student's level and progress to the next one (top of Accueil and Profil). */
export function XPBar({ level, xp, xpToNext }: XPBarProps) {
  const share = Math.max(0, Math.min(1, xp / xpToNext));

  return (
    <div className="flex items-center gap-3 font-text text-encre">
      <span
        aria-hidden
        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-nuit font-display text-xl font-semibold text-jaune"
      >
        {level}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex justify-between gap-3 text-[13px]">
          <b className="font-bold">Niveau {level}</b>
          <span className="text-encre-douce">
            {formatNumber(xp)} / {formatNumber(xpToNext)} XP
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={xpToNext}
          aria-valuenow={xp}
          aria-label={`Niveau ${level} : ${xp} XP sur ${xpToNext} vers le niveau ${level + 1}`}
          className="h-2 overflow-hidden rounded-pill bg-ligne"
        >
          {/* scaleX, not width: only transform animates (docs/12-motion.md). */}
          <div className="q-bar-fill h-full rounded-pill bg-magenta" style={{ transform: `scaleX(${share})` }} />
        </div>
      </div>
    </div>
  );
}
