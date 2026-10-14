"use client";

import Link from "next/link";
import { useState, useTransition, type SubmitEvent } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { fieldErrors, SIGN_IN_FIELDS, signInSchema, type FieldErrors, type SignInField } from "@/lib/validation/auth";
import { isNetworkError, OFFLINE_MESSAGE } from "@/lib/network";
import { signIn } from "@/server/actions/auth";

function focusFirstInvalid(form: HTMLFormElement, errors: FieldErrors<SignInField>) {
  const field = SIGN_IN_FIELDS.find((name) => errors[name]);
  if (field) (form.elements.namedItem(field) as HTMLInputElement | null)?.focus();
}

/**
 * E-mail + password sign-in. Checked in the browser first (same Zod rules as
 * the server), then the server action signs in, or sends an unverified
 * student to /verification with a new code.
 */
export function ConnexionForm() {
  const [errors, setErrors] = useState<FieldErrors<SignInField>>({});
  const [formError, setFormError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const formData = new FormData(form);

    const parsed = signInSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      const found = fieldErrors<SignInField>(parsed.error);
      setErrors(found);
      focusFirstInvalid(form, found);
      return;
    }

    // Back to the page the student wanted (?next=), checked again on the server.
    const next = new URLSearchParams(window.location.search).get("next");
    if (next) formData.set("next", next);

    setFormError(undefined);
    startTransition(async () => {
      try {
        // On success the action redirects, so a result only comes back on failure.
        const result = await signIn(formData);
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

  // An error disappears as soon as the student edits that field.
  const clear = (field: SignInField) => () => {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    if (formError) setFormError(undefined);
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 lg:gap-4.5">
      <TextField
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        error={errors.email}
        onChange={clear("email")}
      />
      <TextField
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="current-password"
        error={errors.password}
        onChange={clear("password")}
      />
      <Link
        href="/mot-de-passe-oublie"
        className="-my-3 inline-flex min-h-11 items-center self-end text-sm font-bold text-magenta-texte hover:text-encre"
      >
        Mot de passe oublié ?
      </Link>
      {formError && (
        <p role="alert" className="text-sm font-bold text-faux">
          {formError}
        </p>
      )}
      <Button type="submit" size="lg" fullWidth>
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
