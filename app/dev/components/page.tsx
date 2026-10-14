import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AnswerOption } from "@/components/ui/AnswerOption";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Icon, ICON_NAMES } from "@/components/ui/Icon";
import { LeaderboardRow } from "@/components/ui/LeaderboardRow";
import { Logo } from "@/components/ui/Logo";
import { Mosaic, type MosaicRow } from "@/components/ui/Mosaic";
import { MosaicTile } from "@/components/ui/MosaicTile";
import { TextField } from "@/components/ui/TextField";
import { XPChip } from "@/components/ui/XPChip";
import { TILE_STATES, type TileState } from "@/lib/game-rules";
import { ThemeSwitch } from "../tokens/ThemeSwitch";

export const metadata: Metadata = { title: "Composants · Qrious" };

const chapters = (states: TileState[]) => states.map((state, i) => ({ chapter: `Chapitre ${i + 1}`, state }));

const ROWS: MosaicRow[] = [
  {
    subject: "Mathématiques",
    tiles: chapters(["maitrise", "maitrise", "solide", "solide", "commence", "vide", "vide", "vide"]),
  },
  { subject: "Physique-Chimie", tiles: chapters(["solide", "commence", "commence", "vide", "vide", "vide"]) },
];

const VARIANTS = ["primary", "secondary", "ghost", "reward", "on-nuit"] as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="label text-encre-douce">{title}</h3>
      {children}
    </section>
  );
}

function Showcase({ theme, title }: { theme: "light" | "dark"; title: string }) {
  return (
    <div data-theme={theme} className="flex min-w-0 flex-col gap-8 rounded-l bg-fond p-4 text-encre sm:p-6">
      <h2 className="title">{title}</h2>

      <Section title="Logo">
        <div className="flex flex-wrap items-center gap-6">
          <Logo size={26} />
          <Logo size={20} />
          <Logo size={28} symbolOnly />
          <span className="rounded-m bg-nuit p-3">
            <Logo size={22} onDark />
          </span>
        </div>
      </Section>

      <Section title="Icon">
        <ul className="flex flex-wrap gap-3 text-encre">
          {ICON_NAMES.map((name) => (
            <li key={name} title={name} className="flex size-10 items-center justify-center rounded-m bg-surface">
              <Icon name={name} />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          {VARIANTS.filter((v) => v !== "reward" && v !== "on-nuit").map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
          <Button icon="arrowRight" size="lg">
            Essayer gratuitement
          </Button>
          <Button size="sm" variant="secondary">
            Petit
          </Button>
          <Button disabled>Désactivé</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-l bg-nuit p-4">
          <Button variant="reward" icon="arrowRight">
            Continuer
          </Button>
          <Button variant="on-nuit">Plus tard</Button>
        </div>
        <Button fullWidth variant="secondary">
          Pleine largeur
        </Button>
      </Section>

      <Section title="AnswerOption">
        <div className="flex flex-col gap-2">
          <AnswerOption letter="A">f′(x) = ln(x)</AnswerOption>
          <AnswerOption letter="B" state="selected">
            f′(x) = 1/x
          </AnswerOption>
          <AnswerOption letter="C" state="correct">
            f′(x) = ln(x) + 1
          </AnswerOption>
          <AnswerOption letter="D" state="wrong">
            f′(x) = x + ln(x)
          </AnswerOption>
          <AnswerOption letter="E" state="disabled">
            f′(x) = 1
          </AnswerOption>
        </div>
      </Section>

      <Section title="MosaicTile">
        <div className="flex flex-wrap items-center gap-3">
          {TILE_STATES.map((state) => (
            <MosaicTile key={state} state={state} size={28} label="Probabilités" />
          ))}
          <MosaicTile state="solide" size={40} label="Intégrales" highlight />
          <MosaicTile state="maitrise" size={40} label="Suites" />
          <MosaicTile state="commence" size={20} />
          <MosaicTile state="maitrise" size={14} />
        </div>
      </Section>

      <Section title="Mosaic">
        <Card>
          <Mosaic rows={ROWS} tileSize={24} />
        </Card>
        <Card>
          <Mosaic rows={ROWS.slice(0, 1)} tileSize={20} hideHeads showLegend={false} />
        </Card>
      </Section>

      <Section title="XPChip">
        <div className="flex flex-wrap items-center gap-3">
          <XPChip amount={40} />
          <span className="rounded-m bg-nuit p-3">
            <XPChip amount={1180} />
          </span>
        </div>
      </Section>

      <Section title="LeaderboardRow">
        <div className="flex flex-col gap-2.5">
          <LeaderboardRow rank={11} name="amine.k" xp={1240} />
          <LeaderboardRow rank={12} name="yasmine.b" xp={1180} isMe change={3} />
          <LeaderboardRow rank={13} name="un_pseudo_tres_long_2026" xp={1150} change={1} />
        </div>
      </Section>

      <Section title="TextField">
        <TextField label="E-mail" type="email" placeholder="toi@exemple.tn" />
        <TextField label="Mot de passe" type="password" hint="8 caractères minimum." />
        <TextField label="E-mail" type="email" defaultValue="yasmine@" error="Cet e-mail n'a pas l'air valide." />
      </Section>

      <Section title="Checkbox">
        <div className="flex flex-col">
          <Checkbox name={`exemple-${theme}`}>J&apos;ai 16 ans ou plus, ou l&apos;accord d&apos;un parent.</Checkbox>
          <Checkbox name={`erreur-${theme}`} error="Coche cette case pour continuer.">
            J&apos;accepte les Conditions.
          </Checkbox>
        </div>
      </Section>

      <Section title="Card">
        <Card>Carte normale</Card>
        <Card raised>Carte levée</Card>
      </Section>
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <main className="mx-auto flex max-w-page flex-col gap-10 px-4 py-10 sm:px-6 lg:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="display-l">Composants</h1>
        <ThemeSwitch />
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <Showcase theme="light" title="Clair" />
        <Showcase theme="dark" title="Sombre" />
      </div>
    </main>
  );
}
