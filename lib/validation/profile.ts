// Input rules for Bienvenue (and later Paramètres), with the messages shown
// under each field. Run in the browser and again in the server action.

import { z } from "zod";
import { consentSchema } from "./auth";

export const PSEUDO_MIN_LENGTH = 3;
export const PSEUDO_MAX_LENGTH = 20;
export const LYCEE_MAX_LENGTH = 100;

/** Letters of any alphabet (accents, Arabic…), digits, « . », « _ » and « - ». No spaces. */
const PSEUDO_PATTERN = /^[\p{L}\p{M}\p{N}._-]+$/u;

export const pseudoSchema = z
  .string()
  .trim()
  .min(1, "Choisis un pseudo.")
  .min(PSEUDO_MIN_LENGTH, `${PSEUDO_MIN_LENGTH} caractères minimum.`)
  .max(PSEUDO_MAX_LENGTH, `${PSEUDO_MAX_LENGTH} caractères maximum.`)
  .regex(PSEUDO_PATTERN, "Lettres, chiffres, point, tiret ou tiret bas seulement, sans espace.");

export const sectionChoiceSchema = z.object({
  /** Checked against the section table on the server. */
  section: z.string().min(1, "Choisis ta section."),
});

export const profileSchema = z.object({
  ...sectionChoiceSchema.shape,
  pseudo: pseudoSchema,
  lycee: z
    .string()
    .trim()
    .max(LYCEE_MAX_LENGTH, `${LYCEE_MAX_LENGTH} caractères maximum.`)
    .optional()
    .transform((value) => value || null),
});

/** Bienvenue for students who haven't ticked the consent boxes yet (Google sign-ups). */
export const profileWithConsentSchema = profileSchema.extend(consentSchema.shape);

export type ProfileField = keyof z.input<typeof profileWithConsentSchema>;
export const PROFILE_FIELDS: ProfileField[] = ["section", "pseudo", "lycee", "conditions", "age"];
