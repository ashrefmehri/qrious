import { formatNumber } from "@/lib/format";

export type LeaderboardRowProps = {
  rank: number;
  /** The student's pseudo, never a full name. */
  name: string;
  /** XP this week. */
  xp: number;
  isMe?: boolean;
  /** Places gained this week. */
  change?: number;
};

/** One student in the weekly ranking. Never show a city, school or photo of another student. */
export function LeaderboardRow({ rank, name, xp, isMe = false, change }: LeaderboardRowProps) {
  return (
    <div
      aria-current={isMe ? "true" : undefined}
      className={`flex min-h-14 items-center gap-3 rounded-m px-3.5 py-2 font-text ${isMe ? "bg-nuit text-sur-nuit" : "bg-surface text-encre"}`}
    >
      <span className="w-8 shrink-0 text-center font-display text-lg font-semibold">{rank}</span>
      <span
        aria-hidden
        className={`flex size-9 shrink-0 items-center justify-center rounded-full font-bold ${isMe ? "bg-jaune text-sur-jaune" : "bg-magenta-clair text-magenta-texte"}`}
      >
        {name.charAt(0).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1 truncate text-[15px] font-bold">
        {name}
        {isMe && " (toi)"}
      </span>
      {change ? (
        <span data-rank-change className={`shrink-0 text-xs font-bold ${isMe ? "text-jaune" : "text-juste"}`}>
          <span aria-hidden>▲ </span>
          {change}
          <span className="sr-only"> places gagnées</span>
        </span>
      ) : null}
      <span className="shrink-0 text-sm font-bold whitespace-nowrap">{formatNumber(xp)} XP</span>
    </div>
  );
}
