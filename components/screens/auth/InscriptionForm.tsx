"use client";

import { useState, useTransition, type SubmitEvent } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import {
  fieldErrors,
  PASSWORD_MIN_LENGTH,
  SIGN_UP_FIELDS,
  signUpSchema,
  type FieldErrors,
  type SignUpField,
} from "@/lib/validation/auth";
import { isNetworkError, OFFLINE_MESSAGE } from "@/lib/network";
import { signUp } from "@/server/actions/auth";
import { ConsentCheckboxes } from "./ConsentCheckboxes";

function focusFirstInvalid(form: HTMLFormElement, errors: FieldErrors<SignUpField>) {
  const field = SIGN_UP_FIELDS.find((name) => errors[name]);
  if (field) (form.elements.namedItem(field) as HTMLInputElement | null)?.focus();
}

/**
 * Sign-up with e-mail. The fields are checked in the browser first (same Zod
 * rules as the server), then the server action creates the account.
 */
export function InscriptionForm() {
  const [errors, setErrors] = useState<FieldErrors<SignUpField>>({});
  const [formError, setFormError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const formData = new FormData(form);

    const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      const found = fieldErrors<SignUpField>(parsed.error);
      setErrors(found);
      focusFirstInvalid(form, found);
      return;
    }

    setFormError(undefined);
    startTransition(async () => {
      try {
        // On success the action redirects, so a result only comes back on failure.
        const result = await signUp(formData);
        if (result.errors) {
          setErrors(result.errors);
          focusFirstInvalid(form, result.errors);
        }
        setFormError(result.formError);
      } catch (error) {
        // No internet: keep what was typed and say so. Anything else (redirects included) goes on.
        if (!isNetworkError(error)) throw error;
        setFormError(OFFLINE_MESSAGE);
      }
    });
  }

  // An error disappears as soon as the student changes that field.
  const clear = (field: SignUpField) => () => {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 lg:gap-4.5">
      <TextField
        label="E-mail"
        name="email"
        type="email"
        placeholder="toi@exemple.tn"
        autoComplete="email"
        error={errors.email}
        onChange={clear("email")}
      />
      <TextField
        label="Mot de passe"
        name="password"
        type="password"
        hint={`${PASSWORD_MIN_LENGTH} caractères minimum.`}
        autoComplete="new-password"
        error={errors.password}
        onChange={clear("password")}
      />
      <ConsentCheckboxes errors={errors} onChange={clear} />
      {formError && (
        <p role="alert" className="text-sm font-bold text-faux">
          {formError}
        </p>
      )}
      <Button type="submit" size="lg" fullWidth>
        {pending ? "Création du compte…" : "Créer mon compte"}
      </Button>
    </form>
  );
}
