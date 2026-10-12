import { useId, type ChangeEvent } from "react";

export type TextFieldProps = {
  label: string;
  id?: string;
  /** Field name in the submitted form. */
  name?: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  /** What to fix, in one sentence. Replaces the hint while shown. */
  error?: string;
  autoComplete?: string;
};

/** A labelled text input: the label sits above the field, never inside it. */
export function TextField({
  label,
  id,
  name,
  type = "text",
  placeholder,
  defaultValue,
  value,
  onChange,
  hint,
  error,
  autoComplete,
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const message = error ?? hint;
  const messageId = `${inputId}-message`;

  return (
    <div className="flex flex-col gap-1.5 font-text text-encre">
      <label htmlFor={inputId} className="text-sm font-bold">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={`h-12 w-full rounded-m border-2 bg-surface px-3.5 text-base text-encre transition-colors duration-150 placeholder:text-encre-douce ${error ? "border-faux" : "border-trait hover:border-encre"}`}
      />
      {message && (
        <span id={messageId} className={`text-[13px] ${error ? "font-bold text-faux" : "text-encre-douce"}`}>
          {message}
        </span>
      )}
    </div>
  );
}
