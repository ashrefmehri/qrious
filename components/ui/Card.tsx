import type { ReactNode } from "react";

export type CardProps = {
  /** Stronger shadow, for cards floating over the page (landing illustrations). */
  raised?: boolean;
  /** Layout only (width, gap, position); never colors. */
  className?: string;
  children: ReactNode;
};

/** The design system's white card (q-card): surface, large radius, soft shadow in light mode. */
export function Card({ raised = false, className = "", children }: CardProps) {
  return (
    <div
      className={`rounded-l bg-surface p-4 font-text text-encre sm:p-6 dark:shadow-none ${raised ? "shadow-levee" : "shadow-carte"} ${className}`}
    >
      {children}
    </div>
  );
}
