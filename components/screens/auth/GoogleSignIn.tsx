"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore, useTransition } from "react";
import { isNetworkError, OFFLINE_MESSAGE } from "@/lib/network";
import { signInWithGoogle } from "@/server/actions/auth";
import { GoogleLogo } from "./GoogleLogo";

// When Google fails, Better Auth sends the student back with ?erreur=google
// plus its own code in ?error= (account_not_linked, access_denied…).
const subscribeToNothing = () => () => {};
function googleError(): string {
  const params = new URLSearchParams(window.location.search);
  if (params.get("erreur") !== "google") return "";
  return params.get("error") ?? "unknown";
}

/**
 * « Continuer avec Google » and the « ou avec ton e-mail » divider, at the top
 * of Connexion and Inscription. A solid button with the « G » on the left, as
 * Google lays out its sign-in buttons.
 */
export function GoogleSignIn() {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [offline, setOffline] = useState(false);
  const urlError = useSyncExternalStore(subscribeToNothing, googleError, () => "");
  const error = offline ? "" : urlError;

  function openGoogle() {
    if (pending) return;
    setOffline(false);
    startTransition(async () => {
      try {
        await signInWithGoogle(pathname);
      } catch (thrown) {
        // No internet: say so. Anything else (the redirect to Google included) goes on.
        if (!isNetworkError(thrown)) throw thrown;
        setOffline(true);
      }
    });
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={openGoogle}
          className="q-pressable relative flex min-h-14 w-full items-center justify-center rounded-m border-2 border-trait bg-surface px-14 font-text text-[17px] font-bold text-encre shadow-carte hover:border-encre dark:shadow-none"
        >
          <span className="absolute left-4 flex">
            <GoogleLogo size={22} />
          </span>
          {pending ? "Ouverture de Google…" : "Continuer avec Google"}
        </button>

        {!pending && offline && (
          <p role="alert" className="text-sm font-bold text-faux">
            {OFFLINE_MESSAGE}
          </p>
        )}
        {!pending && error === "account_not_linked" && (
          // The e-mail already has a password account; Google is never joined to it
          // automatically (disableImplicitLinking, docs/05-screens.md).
          <p role="alert" className="text-sm font-bold text-faux">
            Cet e-mail a déjà un compte avec mot de passe.{" "}
            {pathname === "/inscription" ? (
              <Link href="/connexion" className="underline hover:text-encre">
                Connecte-toi
              </Link>
            ) : (
              "Connecte-toi"
            )}{" "}
            avec ton e-mail et ton mot de passe.
          </p>
        )}
        {!pending && error === "access_denied" && (
          <p role="status" className="text-sm text-encre-douce">
            Connexion avec Google annulée.
          </p>
        )}
        {!pending && error && error !== "account_not_linked" && error !== "access_denied" && (
          <p role="alert" className="text-sm font-bold text-faux">
            La connexion avec Google n&apos;a pas marché. Réessaie.
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 text-[13px] text-encre-douce">
        <span aria-hidden className="h-px flex-1 bg-ligne" />
        ou avec ton e-mail
        <span aria-hidden className="h-px flex-1 bg-ligne" />
      </div>
    </>
  );
}
