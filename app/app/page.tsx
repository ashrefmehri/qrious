import type { Metadata } from "next";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { signOut } from "@/server/actions/auth";
import { getSections } from "@/server/queries/sections";
import { requireCompleteProfile } from "@/server/queries/student";

export const metadata: Metadata = { title: "Accueil · Qrious" };

// TEMPORARY: proves that sign-up and Bienvenue work until Accueil (M2/M5)
// replaces it. Delete this file when app/app/(main)/page.tsx is created; the
// (main) and (focus) layouts must then call requireCompleteProfile().
export default function TemporaryAppPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lecture flex-col justify-center gap-6 px-4 sm:px-6">
      <Logo size={26} />
      {/* The session is read at request time, so it sits behind a Suspense boundary (Cache Components). */}
      <Suspense fallback={<div className="q-skeleton h-36" />}>
        <SignedInCard />
      </Suspense>
    </main>
  );
}

async function SignedInCard() {
  const { profile } = await requireCompleteProfile();
  const sectionName = (await getSections()).find((option) => option.id === profile.sectionId)?.name;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="display-l max-sm:text-[28px] max-sm:leading-8.5">Salut {profile.pseudo}</h1>
      <p className="body text-encre-douce">
        Section <b className="text-encre">{sectionName}</b>. Accueil arrive bientôt.
      </p>
      <form action={signOut}>
        <Button type="submit" variant="secondary">
          Se déconnecter
        </Button>
      </form>
    </div>
  );
}
