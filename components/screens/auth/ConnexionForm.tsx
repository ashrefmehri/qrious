"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

type Field = "email" | "password";
type Errors = Partial<Record<Field, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string): Errors {
  const errors: Errors = {};
  if (!email) errors.email = "Entre ton e-mail.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Cet e-mail n'a pas l'air valide.";
  if (!password) errors.password = "Entre ton mot de passe.";
  return errors;
}

/** E-mail + password sign-in. Checks the fields in the browser; the real sign-in (Better Auth) comes in M3. */
export function ConnexionForm() {
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validate(String(data.get("email") ?? "").trim(), String(data.get("password") ?? ""));
    setErrors(found);

    const firstInvalid = (["email", "password"] as const).find((field) => found[field]);
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLInputElement).focus();
      return;
    }
    // M3: sign in with Better Auth, then go to ?next= or /app.
  }

  // An error disappears as soon as the student edits that field.
  const clear = (field: Field) => () => {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
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
      <Button type="submit" size="lg" fullWidth>
        Se connecter
      </Button>
    </form>
  );
}
