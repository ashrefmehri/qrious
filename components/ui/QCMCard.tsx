import Link from "next/link";
import type { Difficulty } from "@/lib/game-rules";
import { Icon } from "./Icon";
import { XPChip } from "./XPChip";

export type QCMCardProps = {
  subject: string;
  chapter: string;
  title: string;
  questions: number;
  minutes: number;
  difficulty: Difficulty;
  xp: number;
  /** « 8/10 », if the student already played it. */
  bestScore?: string;
  /** « Inspiré du Bac 2024 », shown when never attempted. */
  source?: string;
  href: string;
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = { facile: "Facile", moyen: "Moyen", difficile: "Difficile" };

/** A QCM in a list. The whole card is one link to the QCM detail page. */
export function QCMCard({ subject, chapter, title, questions, minutes, difficulty, xp, bestScore, source, href }: QCMCardProps) {
  return (
    <Link
      href={href}
      className="q-pressable flex flex-col gap-2.5 rounded-l bg-surface p-4 font-text text-encre shadow-carte transition-shadow hover:shadow-levee sm:p-6 dark:shadow-none dark:hover:shadow-none"
    >
      <span className="text-[13px] font-bold text-magenta-texte">
        {subject} · {chapter}
      </span>
      <h3 className="font-display text-xl leading-6.5 font-semibold tracking-[-0.01em]">{title}</h3>
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[13px] text-encre-douce">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="list" size={16} />
          {questions} questions
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon name="clock" size={16} />
          {minutes} min
        </span>
        <span className="inline-flex h-6 items-center rounded-pill border border-ligne bg-fond px-2.5 text-xs font-bold text-encre">
          {DIFFICULTY_LABELS[difficulty]}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-3">
        <span className="text-[13px] text-encre-douce">
          {bestScore ? `Meilleur score : ${bestScore}` : (source ?? "Jamais tenté")}
        </span>
        <XPChip amount={xp} />
      </div>
    </Link>
  );
}
