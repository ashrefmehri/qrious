"use client";

import { useEffect, useState, useTransition, type SubmitEvent } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { isNetworkError, OFFLINE_MESSAGE } from "@/lib/network";
import { VERIFICATION_CODE_LENGTH, verificationCodeSchema } from "@/lib/validation/auth";
import { resendVerificationCode, verifyEmail } from "@/server/actions/auth";

type VerificationFormProps = {
  /** Seconds before « Renvoyer le code » is available (a code was just sent). */
  initialWait: number;
};

/** The 6-digit code field, « Valider », and « Renvoyer le code » with its countdown. */
export function VerificationForm({ initialWait }: VerificationFormProps) {
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [wait, setWait] = useState(initialWait);
  const [verifying, startVerifying] = useTransition();
  const [resending, startResending] = useTransition();

  // Count down to 0, one second at a time.
  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (verifying) return;
    const form = event.currentTarget;
    const formData = new FormData(form);

    const parsed = verificationCodeSchema.safeParse({ code: formData.get("code") });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      (form.elements.namedItem("code") as HTMLInputElement | null)?.focus();
      return;
    }

    setNotice(undefined);
    startVerifying(async () => {
      try {
        // On success the action signs the student in and redirects.
        const result = await verifyEmail(formData);
        setError(result.error);
      } catch (error) {
        // No internet: keep the code typed and say so. Anything else (redirects included) goes on.
        if (!isNetworkError(error)) throw error;
        setError(OFFLINE_MESSAGE);
      }
    });
  }

  function resend() {
    if (resending || wait > 0) return;
    startResending(async () => {
      try {
        const result = await resendVerificationCode();
        setWait(result.waitSeconds);
        setError(result.error);
        setNotice(result.sent ? "Nouveau code envoyé. Seul le dernier code marche." : undefined);
      } catch (error) {
        if (!isNetworkError(error)) throw error;
        setNotice(undefined);
        setError(OFFLINE_MESSAGE);
      }
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 lg:gap-4.5">
      <TextField
        label={`Code à ${VERIFICATION_CODE_LENGTH} chiffres`}
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={VERIFICATION_CODE_LENGTH}
        error={error}
        onChange={() => error && setError(undefined)}
      />
      <Button type="submit" size="lg" fullWidth>
        {verifying ? "Vérification…" : "Valider"}
      </Button>

      <div className="flex flex-col items-center gap-1">
        <Button variant="ghost" onClick={resend} disabled={resending || wait > 0}>
          {wait > 0 ? `Renvoyer le code dans ${wait} s` : resending ? "Envoi…" : "Renvoyer le code"}
        </Button>
        {notice && (
          <p role="status" className="text-center text-sm text-encre-douce">
            {notice}
          </p>
        )}
      </div>

      {process.env.NODE_ENV !== "production" && (
        <p className="rounded-m bg-magenta-clair px-3.5 py-2.5 text-[13px] text-encre">
          Développement : pas encore d&apos;envoi d&apos;e-mail, le code s&apos;affiche dans le terminal de{" "}
          <code>npm run dev</code>.
        </p>
      )}
    </form>
  );
}
