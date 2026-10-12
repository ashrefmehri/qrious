import type { CSSProperties } from "react";
import { HeroDemo } from "@/components/screens/landing/HeroDemo";
import { Reveal } from "@/components/screens/landing/Reveal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LeaderboardRow } from "@/components/ui/LeaderboardRow";
import { Mosaic } from "@/components/ui/Mosaic";
import { EXAMPLE_MATHS_DROP, EXAMPLE_ROWS } from "@/lib/mock";
import "@/components/screens/landing/landing.css";

const { physique, svt, info } = EXAMPLE_ROWS;

// Landing: make a Bac student try a question in under 10 seconds (docs/05-screens.md).
// Everything here is static illustration; no invented statistics.
// Motion: the hero plays on load, every other section once as it scrolls into view
// (docs/12-motion.md « Landing »).

const STEPS: { icon: IconName; title: string; short: string; long: string }[] = [
  {
    icon: "list",
    title: "1. Réponds",
    short: "Des QCM rangés par matière et par chapitre de ton programme.",
    long: "Des QCM de 5 à 20 questions, rangés par matière et par chapitre de ton programme.",
  },
  {
    icon: "check",
    title: "2. Comprends",
    short: "Chaque réponse est expliquée. Tes erreurs deviennent des révisions.",
    long: "Après chaque réponse, tu vois si c'est juste et pourquoi. Tes erreurs deviennent des révisions.",
  },
  {
    icon: "mosaic",
    title: "3. Progresse",
    short: "Chaque chapitre est une tuile. Ta mosaïque Bac se remplit.",
    long: "Chaque chapitre est une tuile. Regarde ta mosaïque Bac se remplir, semaine après semaine.",
  },
];

const SECTIONS = [
  "Mathématiques",
  "Sciences expérimentales",
  "Sciences techniques",
  "Sciences de l’informatique",
  "Économie et gestion",
  "Lettres",
  "Sport",
];

const gutter = "px-4 sm:px-6 lg:px-10";

/** Place of an element in its entrance sequence. */
const order = (i: number) => ({ "--i": i }) as CSSProperties;

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className={`${gutter} pt-6 pb-10 sm:pt-10 sm:pb-14 lg:pt-14 lg:pb-20`}>
        <div className="mx-auto flex max-w-page flex-col gap-4.5 lg:flex-row lg:items-center lg:gap-14">
          <div className="flex flex-col gap-4.5 lg:flex-[1_1_480px] lg:gap-6">
            <span className="landing-in text-sm font-bold text-magenta-texte [--i:0] lg:text-[15px]">
              Pour le Bac tunisien · toutes les sections
            </span>
            <h1 className="landing-in font-display text-[42px] leading-11.5 font-semibold tracking-[-0.035em] [--i:1] sm:text-[56px] sm:leading-15 lg:text-[68px] lg:leading-17.5">
              Révise le Bac <br className="hidden lg:inline" />
              pièce par pièce.
            </h1>
            <p className="landing-in text-[17px] leading-6.5 text-encre-douce [--i:2] lg:max-w-130 lg:text-[19px] lg:leading-7.5">
              Des QCM sur tout le programme de ta section, chaque erreur expliquée, et ta progression qui prend forme,
              chapitre par chapitre.
            </p>
            <div className="landing-in flex flex-col gap-2.5 [--i:3] sm:flex-row sm:flex-wrap sm:gap-3">
              <Button href="/essai" size="lg" icon="arrowRight" className="w-full sm:w-auto">
                Essayer gratuitement
              </Button>
              <Button href="/connexion" variant="secondary" size="lg" className="w-full sm:w-auto">
                Se connecter
              </Button>
            </div>
            <span className="landing-in text-center text-[13px] text-encre-douce [--i:4] sm:text-left lg:text-sm">
              <span className="lg:hidden">Gratuit · sans compte pour essayer</span>
              <span className="hidden lg:inline">Gratuit · en français · sur téléphone et ordinateur</span>
            </span>
          </div>

          <HeroDemo />
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className={`${gutter} scroll-mt-4 bg-surface py-10 md:py-18`}>
        <Reveal className="mx-auto flex max-w-page flex-col gap-6 md:gap-10">
          <h2 className="reveal-item font-display text-[30px] leading-9 font-semibold md:text-center md:text-[44px] md:leading-12.5 md:tracking-[-0.02em]">
            Comment ça marche
          </h2>
          <ol className="flex flex-col gap-6 md:grid md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="reveal-item flex gap-3.5 md:flex-col md:gap-3" style={order(i + 1)}>
                <span className="reveal-pop flex size-11 shrink-0 items-center justify-center rounded-xl bg-magenta-clair text-magenta-texte md:size-13 md:rounded-m">
                  <Icon name={step.icon} />
                </span>
                <div className="flex flex-col gap-1 md:gap-3">
                  <h3 className="font-display text-xl font-semibold md:text-2xl">{step.title}</h3>
                  <p className="text-[15px] leading-5.5 text-encre-douce md:text-[17px] md:leading-6.5">
                    <span className="md:hidden">{step.short}</span>
                    <span className="hidden md:inline">{step.long}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* Tout ton Bac, en une mosaïque */}
      <section className={`${gutter} bg-nuit py-10 text-sur-nuit sm:py-14 lg:py-20`}>
        <Reveal className="mx-auto flex max-w-page flex-col gap-4.5 lg:flex-row lg:items-center lg:gap-14">
          <div className="flex flex-col gap-4.5 lg:flex-[1_1_400px] lg:gap-4">
            <h2 className="reveal-item font-display text-[30px] leading-9 font-semibold lg:text-[44px] lg:leading-12.5 lg:tracking-[-0.02em]">
              Tout ton Bac, <br className="hidden lg:inline" />
              en une mosaïque
            </h2>
            <p className="reveal-item text-base leading-6 text-sur-nuit-douce lg:text-lg lg:leading-7" style={order(1)}>
              <span className="lg:hidden">Une tuile par chapitre. Tu sais toujours ce qu&apos;il te reste à revoir.</span>
              <span className="hidden lg:inline">
                Une tuile par chapitre. Elle passe de Commencé à Solide puis Maîtrisé à mesure que tu réussis. Tu sais
                toujours ce qu&apos;il te reste à revoir.
              </span>
            </p>
          </div>
          <div className="reveal-item lg:flex-[1_1_480px]" style={order(2)}>
            <Card>
              <div className="sm:hidden">
                <Mosaic rows={[EXAMPLE_MATHS_DROP, physique, info]} tileSize={18} stagger />
              </div>
              <div className="hidden sm:block">
                <Mosaic rows={[EXAMPLE_MATHS_DROP, physique, svt, info]} tileSize={24} stagger />
              </div>
            </Card>
          </div>
        </Reveal>
      </section>

      {/* Les 7 sections + classement */}
      <section id="sections" className={`${gutter} scroll-mt-4 py-10 sm:py-14 lg:py-20`}>
        <Reveal className="mx-auto flex max-w-page flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="flex flex-col gap-4 lg:flex-[1_1_440px] lg:gap-4.5">
            <h2 className="reveal-item font-display text-[28px] leading-8.5 font-semibold lg:text-[40px] lg:leading-11.5 lg:tracking-[-0.02em]">
              Pour les 7 sections du Bac
            </h2>
            <ul className="flex flex-wrap gap-2 lg:gap-2.5">
              {SECTIONS.map((section, i) => (
                <li
                  key={section}
                  className="reveal-item rounded-pill border border-ligne bg-surface px-3.5 py-2 text-sm font-bold lg:px-4 lg:py-2.5 lg:text-[15px]"
                  style={order(1 + i / 2)}
                >
                  {section}
                </li>
              ))}
            </ul>
            <p className="reveal-item hidden text-base leading-6 text-encre-douce sm:block" style={order(5)}>
              Les autres années du lycée arrivent ensuite.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 lg:flex-[1_1_440px]">
            <h3 className="reveal-item mb-1.5 font-display text-[22px] font-semibold lg:text-2xl" style={order(1)}>
              Un classement chaque semaine
            </h3>
            <div className="reveal-item" style={order(2)}>
              <LeaderboardRow rank={11} name="amine.k" xp={1240} />
            </div>
            <div className="reveal-item" style={order(3)}>
              <LeaderboardRow rank={12} name="yasmine.b" xp={1180} isMe change={3} />
            </div>
            <div className="reveal-item hidden sm:block" style={order(4)}>
              <LeaderboardRow rank={13} name="sami.l" xp={1150} />
            </div>
            <span className="reveal-item text-[13px] text-encre-douce lg:text-sm" style={order(5)}>
              Entre élèves de ta section, avec ton pseudo seulement.
            </span>
          </div>
        </Reveal>
      </section>

      {/* Dernier appel */}
      <section className={`${gutter} pb-10 sm:pb-14 lg:pb-20`}>
        <Reveal className="mx-auto max-w-page">
          <div className="reveal-item flex flex-col gap-3.5 rounded-3xl bg-nuit px-5 py-7 text-center text-sur-nuit sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-6 sm:p-10 sm:text-left lg:rounded-[28px] lg:p-14">
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-[28px] leading-8.5 font-semibold lg:text-[40px] lg:leading-11.5 lg:tracking-[-0.02em]">
                Ta première tuile t&apos;attend.
              </h2>
              <span className="text-[15px] text-sur-nuit-douce lg:text-[17px]">3 questions, sans compte, en 1 minute.</span>
            </div>
            <Button href="/essai" variant="reward" size="lg" icon="arrowRight" className="w-full sm:w-auto">
              Essayer gratuitement
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
