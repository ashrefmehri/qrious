// Input rules for the auth forms, with the messages shown under each field.
// The same schemas run in the browser (instant errors) and in the server
// actions (never trust the browser).

import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

/** E-mail verification code: 6 digits, valid 10 minutes, a new one at most every 60 s. */
export const VERIFICATION_CODE_LENGTH = 6;
export const VERIFICATION_CODE_MINUTES = 10;
export const RESEND_DELAY_SECONDS = 60;

const CHECK_TO_CONTINUE = "Coche cette case pour continuer.";

const email = z
  .string()
  .trim()
  .min(1, "Entre ton e-mail.")
  .pipe(z.email("Cet e-mail n'a pas l'air valide."));

/** The 2 required consent boxes: at sign-up, or in Bienvenue for Google students. */
export const consentSchema = z.object({
  /** Checkboxes send "on" when ticked and nothing otherwise. */
  conditions: z.literal("on", CHECK_TO_CONTINUE),
  age: z.literal("on", CHECK_TO_CONTINUE),
});

export const signUpSchema = z.object({
  email,
  password: z
    .string()
    .min(1, "Choisis un mot de passe.")
    .min(PASSWORD_MIN_LENGTH, `${PASSWORD_MIN_LENGTH} caractères minimum.`)
    .max(PASSWORD_MAX_LENGTH, `${PASSWORD_MAX_LENGTH} caractères maximum.`),
  ...consentSchema.shape,
});

export type SignUpField = keyof z.input<typeof signUpSchema>;
export const SIGN_UP_FIELDS: SignUpField[] = ["email", "password", "conditions", "age"];

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Entre ton mot de passe."),
});

export type SignInField = keyof z.input<typeof signInSchema>;
export const SIGN_IN_FIELDS: SignInField[] = ["email", "password"];

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(new RegExp(`^\\d{${VERIFICATION_CODE_LENGTH}}$`), `Entre les ${VERIFICATION_CODE_LENGTH} chiffres du code.`),
});

export type FieldErrors<Field extends string> = Partial<Record<Field, string>>;

/** The first message of each invalid field, ready to show under it. */
export function fieldErrors<Field extends string>(error: z.ZodError): FieldErrors<Field> {
  const errors: FieldErrors<Field> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as Field | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
