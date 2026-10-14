import { useId, type ChangeEvent, type ReactNode } from "react";

export type CheckboxProps = {
  /** Field name in the submitted form. */
  name: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** What to fix, in one sentence. */
  error?: string;
  /** The label; may contain links. */
  children: ReactNode;
};

/** A native checkbox with its label; the whole label row is the tap target. */
export function Checkbox({ name, onChange, error, children }: CheckboxProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1 font-text text-encre">
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 py-2.5 text-sm leading-5">
        <input
          id={id}
          name={name}
          type="checkbox"
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="size-5 shrink-0 cursor-pointer accent-action"
        />
        <span>{children}</span>
      </label>
      {error && (
        <span id={errorId} className="pl-8 text-[13px] font-bold text-faux">
          {error}
        </span>
      )}
    </div>
  );
}
