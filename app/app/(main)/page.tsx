import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AccueilSkeleton } from "@/components/screens/accueil/AccueilSkeleton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CoachCard } from "@/components/ui/CoachCard";
import { LeaderboardRow } from "@/components/ui/LeaderboardRow";
import { Logo } from "@/components/ui/Logo";
import { Mosaic } from "@/components/ui/Mosaic";
import { QCMCard } from "@/components/ui/QCMCard";
import { XPBar } from "@/components/ui/XPBar";
import { levelFromXp } from "@/lib/game-rules";
import { MOCK_HOME } from "@/lib/mock-accueil";
import { getSections } from "@/server/queries/sections";
import { requireCompleteProfile } from "@/server/queries/student";

export const metadata: Metadata = { title: "Accueil · Qrious" };

// Accueil (docs/05-screens.md, HomePhone / HomeTablet / HomeDesktop).
// Design phase: the pseudo and section are real; level, coach, mosaic,
// suggestions and leaderboard come from MOCK_HOME (lib/mock-accueil.ts) until QCMs exist (M4/M5).
export default function AccueilPage() {
  return (
    <div className="q-page-in mx-auto flex max-w-page flex-col px-4 pt-3 pb-6 sm:px-6 sm:py-7 lg:px-10 lg:pt-8 lg:pb-12">
      {/* Reads the session at request time, so it sits behind a Suspense boundary (Cache Components). */}
      <Suspense fallback={<AccueilSkeleton />}>
        <Accueil />
      </Suspense>
    </div>
  );
}

const h2 = "font-display text-[19px] leading-6 font-semibold sm:text-[21px] lg:text-[22px] lg:leading-7";
const link = "inline-flex min-h-11 items-center text-sm font-bold text-magenta-texte hover:text-encre sm:text-[15px]";

async function Accueil() {
  const { profile } = await requireCompleteProfile();
  const sectionName = (await getSections()).find((option) => option.id === profile.sectionId)?.name ?? "";
  const { level, xpInLevel, xpForNextLevel } = levelFromXp(MOCK_HOME.totalXp);
  const { coach, mosaic, suggestions, leaderboard } = MOCK_HOME;
  const coachTitle = `Prochaine tuile : ${coach.chapter}`;

  return (
    <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
      {/* Phone: logo and profile on top (the navigation is the bottom bar). */}
      <div className="flex h-11 items-center justify-between sm:hidden">
        <Logo size={22} />
        <Link
          href="/app/profil"
          aria-label="Profil"
          className="flex size-11 items-center justify-center rounded-full bg-nuit font-bold text-jaune"
        >
          {profile.pseudo.charAt(0).toUpperCase()}
        </Link>
      </div>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5 lg:gap-6">
        <div className="flex flex-col gap-0.5 lg:gap-1">
          <h1 className="font-display text-[28px] leading-8.5 font-semibold tracking-[-0.02em] sm:text-[32px] sm:leading-9.5 lg:text-4xl lg:leading-10.5">
            Salut {profile.pseudo}
          </h1>
          <span className="hidden text-sm text-encre-douce sm:block lg:text-[15px]">Bac {sectionName}</span>
        </div>
        <div className="sm:flex-[0_1_300px] lg:min-w-65 lg:flex-[0_1_360px]">
          <XPBar level={level} xp={xpInLevel} xpToNext={xpForNextLevel} />
        </div>
      </header>

      {/* Below 1024 px the two columns melt into one list (display: contents), ordered for each width. */}
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-5 lg:flex lg:flex-row lg:items-start lg:gap-6">
        <div className="contents lg:flex lg:min-w-0 lg:flex-2 lg:flex-col lg:gap-6">
          <div className="order-1 sm:col-span-2">
            <CoachCard
              title={coachTitle}
              tile={coach.tile}
              actionLabel="Continuer"
              href={`/app/qcm/${coach.qcmId}`}
            >
              Encore {coach.correctAnswersNeeded} bonnes réponses pour la rendre solide.
              <span className="hidden sm:inline"> Un QCM de {coach.qcmQuestions} questions suffit.</span>
            </CoachCard>
          </div>

          <Card className="order-3 flex flex-col gap-3 sm:col-span-2 sm:gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className={h2}>
                Ta mosaïque<span className="hidden sm:inline"> Bac</span>
              </h2>
              <Link href="/app/progres" className={`-my-3 ${link}`}>
                <span className="sm:hidden">Tout voir</span>
                <span className="hidden sm:inline">Voir tes progrès</span>
              </Link>
            </div>
            {/* Phone: 3 subjects, smaller tiles, no legend (HomePhone). */}
            <div className="sm:hidden">
              <Mosaic rows={[mosaic[0], mosaic[1], mosaic[3]]} tileSize={18} showLegend={false} />
            </div>
            <div className="hidden sm:block">
              <Mosaic rows={mosaic} tileSize={24} />
            </div>
          </Card>

          <section aria-labelledby="pour-toi" className="order-4 flex flex-col gap-3 sm:col-span-2">
            <h2 id="pour-toi" className={h2}>
              Pour toi aujourd&apos;hui
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {suggestions.map((qcm) => (
                <QCMCard key={qcm.id} {...qcm} href={`/app/qcm/${qcm.id}`} />
              ))}
            </div>
          </section>
        </div>

        <div className="contents lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:gap-6">
          {/* Phone: Défi rapide is a single button, right under the coach. */}
          <div className="order-2 sm:hidden">
            <Button href="/app/defi" variant="secondary" size="lg" icon="zap" fullWidth>
              Défi rapide · 10 questions
            </Button>
          </div>

          <section
            aria-labelledby="defi"
            className="order-5 hidden flex-col gap-3 rounded-l bg-magenta-clair p-6 text-encre sm:flex"
          >
            <h2 id="defi" className={h2}>
              Défi rapide
            </h2>
            <p className="text-[15px] leading-5.5">
              10 questions au hasard dans tes matières.<span className="hidden lg:inline"> Environ 6 minutes.</span>
            </p>
            <Button href="/app/defi" icon="zap" fullWidth>
              Lancer le défi
            </Button>
          </section>

          {/* Phone: heading + own row, no card (HomePhone); a card from 640 px. */}
          <section
            aria-labelledby="classement"
            className="order-6 flex flex-col gap-2 font-text text-encre sm:gap-2.5 sm:rounded-l sm:bg-surface sm:p-6 sm:shadow-carte sm:dark:shadow-none"
          >
              <div className="flex flex-col gap-0.5 lg:flex-row lg:items-baseline lg:justify-between lg:gap-3">
                <h2 id="classement" className={h2}>
                  <span className="sm:hidden">Classement de la semaine</span>
                  <span className="hidden sm:inline">Classement</span>
                </h2>
                <span className="hidden text-[13px] text-encre-douce sm:block">
                  Section {sectionName} · cette semaine
                </span>
              </div>
              {leaderboard.map((row) => {
                const me = row.name === null;
                // Phone and tablet show only the student's own row; desktop shows the neighbours too.
                return (
                  <div key={row.rank} className={me ? "" : "hidden lg:block"}>
                    <LeaderboardRow
                      rank={row.rank}
                      name={row.name ?? profile.pseudo}
                      xp={row.xp}
                      isMe={me}
                      change={row.change}
                    />
                  </div>
                );
              })}
              <Link href="/app/classement" className={`hidden sm:inline-flex ${link}`}>
                <span className="lg:hidden">Voir tout</span>
                <span className="hidden lg:inline">Voir tout le classement</span>
              </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
