import Link from "next/link";
import { Checkbox } from "@/components/ui/Checkbox";

type ConsentField = "conditions" | "age";

type ConsentCheckboxesProps = {
  errors: Partial<Record<ConsentField, string>>;
  /** Clears that box's error when it changes. */
  onChange: (field: ConsentField) => () => void;
};

const inlineLink = "font-bold text-magenta-texte underline hover:text-encre";

/** The 2 required boxes (docs/08-onboarding.md): at sign-up, or in Bienvenue for Google students. */
export function ConsentCheckboxes({ errors, onChange }: ConsentCheckboxesProps) {
  return (
    <div className="flex flex-col">
      <Checkbox name="conditions" error={errors.conditions} onChange={onChange("conditions")}>
        J&apos;accepte les{" "}
        <Link href="/conditions" className={inlineLink}>
          Conditions
        </Link>{" "}
        et la{" "}
        <Link href="/confidentialite" className={inlineLink}>
          Politique de confidentialité
        </Link>
        .
      </Checkbox>
      <Checkbox name="age" error={errors.age} onChange={onChange("age")}>
        J&apos;ai 16 ans ou plus, ou l&apos;accord d&apos;un parent.
      </Checkbox>
    </div>
  );
}
