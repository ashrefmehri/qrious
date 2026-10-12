import type { ReactNode } from "react";
import { Icon } from "./Icon";

export type AnswerState = "idle" | "selected" | "correct" | "wrong" | "disabled";

export type AnswerOptionProps = {
  letter: "A" | "B" | "C" | "D" | "E";
  state?: AnswerState;
  onClick?: () => void;
  /** The answer text; may contain a KaTeX formula. */
  children: ReactNode;
};

const OPTION = {
  idle: "border-trait bg-surface hover:border-encre",
  selected: "border-magenta bg-magenta-clair hover:border-encre",
  correct: "cursor-default border-juste bg-juste-clair",
  wrong: "cursor-default border-faux bg-faux-clair",
  disabled: "cursor-default border-trait bg-surface opacity-55",
};

const LETTER = {
  idle: "border-trait bg-fond text-encre",
  selected: "border-magenta bg-magenta text-sur-jaune",
  correct: "border-juste bg-juste text-surface",
  wrong: "border-faux bg-faux text-surface",
  disabled: "border-trait bg-fond text-encre",
};

/** One answer choice. Correct and wrong always show an icon and a word, never colour alone. */
export function AnswerOption({ letter, state = "idle", onClick, children }: AnswerOptionProps) {
  const locked = state === "correct" || state === "wrong" || state === "disabled";

  return (
    <button
      type="button"
      aria-pressed={state === "selected"}
      aria-disabled={locked || undefined}
      onClick={locked ? undefined : onClick}
      className={`flex min-h-15 w-full items-center gap-3.5 rounded-m border-2 px-4 py-3 text-left font-text text-[17px] leading-6 text-encre transition-colors duration-150 ${OPTION[state]}`}
    >
      <span
        aria-hidden
        className={`flex size-8 shrink-0 items-center justify-center rounded-[9px] border-[1.5px] text-[15px] font-bold ${LETTER[state]}`}
      >
        {letter}
      </span>
      <span className="flex-1">{children}</span>
      {state === "correct" && (
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-juste">
          <Icon name="check" size={18} stroke={2.4} />
          Juste
        </span>
      )}
      {state === "wrong" && (
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-faux">
          <Icon name="x" size={18} stroke={2.4} />
          Pas encore
        </span>
      )}
    </button>
  );
}
