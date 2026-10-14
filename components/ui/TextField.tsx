"use client";

import { useId, useState, type ChangeEvent } from "react";
import { Icon } from "./Icon";

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
  /** Which phone keyboard to show (e.g. "numeric" for a code). */
  inputMode?: "text" | "email" | "numeric";
  maxLength?: number;
};

/**
 * A labelled text input: the label sits above the field, never inside it.
 * Password fields get an eye button to show or hide what was typed.
 */
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
  inputMode,
  maxLength,
}: TextFieldProps) {
  const generatedId = useId();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputId = id ?? generatedId;
  const message = error ?? hint;
  const messageId = `${inputId}-message`;
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5 font-text text-encre">
      <label htmlFor={inputId} className="text-sm font-bold">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={isPassword && passwordVisible ? "text" : type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={`h-12 w-full rounded-m border-2 bg-surface px-3.5 text-base text-encre transition-colors duration-150 placeholder:text-encre-douce ${isPassword ? "pr-12" : ""} ${error ? "border-faux" : "border-trait hover:border-encre"}`}
        />
        {isPassword && (
          <button
            type="button"
            aria-label="Afficher le mot de passe"
            aria-pressed={passwordVisible}
            aria-controls={inputId}
            onClick={() => setPasswordVisible((visible) => !visible)}
            className="absolute top-1/2 right-0.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-m text-encre-douce hover:text-encre"
          >
            <Icon name={passwordVisible ? "eyeOff" : "eye"} size={20} />
          </button>
        )}
      </div>
      {message && (
        <span id={messageId} className={`text-[13px] ${error ? "font-bold text-faux" : "text-encre-douce"}`}>
          {message}
        </span>
      )}
    </div>
  );
}
