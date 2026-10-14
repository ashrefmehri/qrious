"use client";

import { useEffect, useRef, useState, useTransition, type SubmitEvent } from "react";
import { ConsentCheckboxes } from "@/components/screens/auth/ConsentCheckboxes";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TextField } from "@/components/ui/TextField";
import { isNetworkError, OFFLINE_MESSAGE } from "@/lib/network";
import { fieldErrors, type FieldErrors } from "@/lib/validation/auth";
import {
  LYCEE_MAX_LENGTH,
  PROFILE_FIELDS,
  profileSchema,
  profileWithConsentSchema,
  PSEUDO_MAX_LENGTH,
  type ProfileField,
} from "@/lib/validation/profile";
import { completeProfile } from "@/server/actions/profile";
import type { SectionOption } from "@/server/queries/sections";

/** Icons of the section cards (BienvenueDesktop mockup). */
const SECTION_ICONS: Record<string, IconName> = {
  maths: "sigma",
  "sciences-exp": "leaf",
  "sciences-tech": "settings",
  info: "code",
  "eco-gestion": "arrowUp",
  lettres: "book",
  sport: "trophy",
};

type BienvenueWizardProps = {
  sections: SectionOption[];
  /** Google students haven't ticked the consent boxes yet. */
  needsConsent: boolean;
};

/**
 * Bienvenue in 2 steps on one page: 1. section, 2. pseudo + lycée (+ consent).
 * Everything is saved at the end by one server action.
 */
export function BienvenueWizard({ sections, needsConsent }: BienvenueWizardProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [section, setSection] = useState("");
  const [errors, setErrors] = useState<FieldErrors<ProfileField>>({});
  const [formError, setFormError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const schema = needsConsent ? profileWithConsentSchema : profileSchema;

  // On each step, move focus to its title so screen readers announce it.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    titleRef.current?.focus();
  }, [step]);

  function continueToStep2() {
    if (!section) {
      setErrors({ section: "Choisis ta section." });
      return;
    }
    setErrors({});
    setStep(2);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("section", section);

    const parsed = schema.safeParse(Object.fromEntries(formData));
    const found = parsed.success ? {} : fieldErrors<ProfileField>(parsed.error);
    if (!parsed.success) {
      show(form, found);
      return;
    }

    setFormError(undefined);
    startTransition(async () => {
      try {
        // On success the action opens the app, so a result only comes back on failure.
        const result = await completeProfile(formData);
        if (result.errors) show(form, result.errors);
        setFormError(result.formError);
      } catch (error) {
        // No internet: keep what was typed and say so. Anything else (redirects included) goes on.
        if (!isNetworkError(error)) throw error;
        setFormError(OFFLINE_MESSAGE);
      }
    });
  }

  function show(form: HTMLFormElement, found: FieldErrors<ProfileField>) {
    setErrors(found);
    if (found.section) {
      setStep(1);
      return;
    }
    const field = PROFILE_FIELDS.find((name) => found[name]);
    if (field) (form.elements.namedItem(field) as HTMLInputElement | null)?.focus();
  }

  /** « Ajouter mon lycée plus tard »: send the form with the lycée left empty. */
  function skipLycee(form: HTMLFormElement | null) {
    const lycee = form?.elements.namedItem("lycee") as HTMLInputElement | null;
    if (lycee) lycee.value = "";
    form?.requestSubmit();
  }

  // An error disappears as soon as the student changes that field.
  const clear = (field: ProfileField) => () => {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const progress = (
    <div className="flex flex-col gap-2.5">
      <div className="flex min-h-11 items-center gap-2">
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            aria-label="Revenir au choix de la section"
            className="-ml-2.5 flex size-11 items-center justify-center rounded-m text-encre hover:bg-ligne"
          >
            <Icon name="arrowLeft" />
          </button>
        )}
        <span className="text-sm font-bold text-encre-douce">Étape {step} sur 2</span>
      </div>
      <div className="h-2 overflow-hidden rounded-pill bg-ligne">
        <div
          className="q-bar-fill h-full rounded-pill bg-magenta"
          style={{ transform: `scaleX(${step / 2})` }}
        />
      </div>
    </div>
  );

  const title = "font-display text-[28px] leading-8.5 font-semibold tracking-[-0.02em] outline-none lg:text-[34px] lg:leading-10";

  if (step === 1) {
    return (
      <div key="step-1" className="q-question-in flex flex-1 flex-col gap-5 lg:gap-5.5">
        {progress}
        <div className="flex flex-col gap-1.5">
          <h1 ref={titleRef} tabIndex={-1} className={title}>
            Ta section au Bac ?
          </h1>
          <p className="text-[15px] leading-6 text-encre-douce lg:text-base">
            On te montre les matières et les QCM de ton programme.
          </p>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Ta section</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {sections.map((option) => {
              const selected = option.id === section;
              return (
                <label
                  key={option.id}
                  className={`q-pressable flex min-h-15 cursor-pointer items-center gap-2.5 rounded-m border-2 px-3.5 py-2 text-[15px] leading-5 font-bold text-encre has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus ${selected ? "border-magenta bg-magenta-clair" : "border-trait bg-surface hover:border-encre"}`}
                >
                  <input
                    type="radio"
                    name="section-choice"
                    value={option.id}
                    checked={selected}
                    onChange={() => {
                      setSection(option.id);
                      setErrors({});
                    }}
                    className="sr-only"
                  />
                  <span className={`flex shrink-0 ${selected ? "text-magenta-texte" : "text-encre-douce"}`}>
                    <Icon name={SECTION_ICONS[option.id] ?? "book"} />
                  </span>
                  {option.name}
                </label>
              );
            })}
          </div>
          {errors.section && (
            <p role="alert" className="text-[13px] font-bold text-faux">
              {errors.section}
            </p>
          )}
        </fieldset>

        <div className="mt-auto pt-4 lg:mt-0 lg:flex lg:justify-end lg:pt-0">
          <Button size="lg" icon="arrowRight" onClick={continueToStep2} className="w-full lg:w-auto">
            Continuer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      key="step-2"
      noValidate
      onSubmit={handleSubmit}
      className="q-question-in flex flex-1 flex-col gap-5 lg:gap-5.5"
    >
      {progress}
      <div className="flex flex-col gap-1.5">
        <h1 ref={titleRef} tabIndex={-1} className={title}>
          Ton pseudo
        </h1>
        <p className="text-[15px] leading-6 text-encre-douce lg:text-base">
          C&apos;est le seul nom que les autres verront dans le classement.
        </p>
      </div>

      <TextField
        label="Pseudo"
        name="pseudo"
        autoComplete="nickname"
        maxLength={PSEUDO_MAX_LENGTH}
        hint="Tu pourras le changer quand tu veux."
        error={errors.pseudo}
        onChange={clear("pseudo")}
      />
      <hr className="border-ligne" />
      <TextField
        label="Ton lycée (facultatif)"
        name="lycee"
        placeholder="Ex. Lycée pilote de…"
        autoComplete="off"
        maxLength={LYCEE_MAX_LENGTH}
        hint="Personne d'autre ne le voit."
        error={errors.lycee}
        onChange={clear("lycee")}
      />
      {needsConsent && <ConsentCheckboxes errors={errors} onChange={clear} />}

      {formError && (
        <p role="alert" className="text-sm font-bold text-faux">
          {formError}
        </p>
      )}

      <div className="mt-auto flex flex-col items-center gap-1 pt-4 lg:mt-0 lg:flex-row-reverse lg:justify-start lg:gap-4 lg:pt-0">
        <Button type="submit" size="lg" icon="arrowRight" className="w-full lg:w-auto">
          {pending ? "Enregistrement…" : "Commencer"}
        </Button>
        <Button variant="ghost" size="sm" onClick={(event) => skipLycee((event.currentTarget as HTMLButtonElement).form)}>
          Ajouter mon lycée plus tard
        </Button>
      </div>
    </form>
  );
}
