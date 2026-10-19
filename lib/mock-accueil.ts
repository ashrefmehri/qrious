// Accueil (design phase): an example student, as in the Home mockups. The pseudo
// and section shown on the page are the real ones; everything here is invented
// until QCMs exist (M4/M5). Not real students or content.

import type { MosaicRow } from "@/components/ui/Mosaic";
import type { Difficulty, TileState } from "@/lib/game-rules";

function numbered(subject: string, states: TileState[]): MosaicRow {
  return { subject, tiles: states.map((state, i) => ({ chapter: `Chapitre ${i + 1}`, state })) };
}

function named(subject: string, chapters: [string, TileState][]): MosaicRow {
  return { subject, tiles: chapters.map(([chapter, state]) => ({ chapter, state })) };
}

export type MockQcm = {
  id: string;
  subject: string;
  chapter: string;
  title: string;
  questions: number;
  minutes: number;
  difficulty: Difficulty;
  xp: number;
  bestScore?: string;
  source?: string;
};

export type MockRankRow = {
  rank: number;
  /** null = the student's own row, shown with their real pseudo. */
  name: string | null;
  xp: number;
  change?: number;
};

export const MOCK_HOME: {
  totalXp: number;
  coach: { chapter: string; tile: TileState; correctAnswersNeeded: number; qcmQuestions: number; qcmId: string };
  mosaic: MosaicRow[];
  suggestions: MockQcm[];
  leaderboard: MockRankRow[];
} = {
  /** levelFromXp() turns it into « Niveau 7 » and « 240 / 400 XP ». */
  totalXp: 1590,
  coach: {
    chapter: "Intégrales",
    tile: "commence",
    correctAnswersNeeded: 6,
    qcmQuestions: 10,
    qcmId: "calcul-aires",
  },
  mosaic: [
    named("Mathématiques", [
      ["Limites et continuité", "maitrise"], ["Suites réelles", "maitrise"], ["Dérivabilité", "maitrise"],
      ["Fonctions réciproques", "solide"], ["Primitives", "solide"], ["Intégrales", "commence"],
      ["Fonction logarithme", "solide"], ["Fonction exponentielle", "commence"], ["Équations différentielles", "vide"],
      ["Nombres complexes", "commence"], ["Probabilités", "commence"], ["Statistiques", "vide"],
    ]),
    numbered("Physique-Chimie", ["maitrise", "solide", "solide", "commence", "commence", "vide", "vide", "vide", "vide", "vide"]),
    numbered("Sciences naturelles", ["solide", "solide", "commence", "commence", "vide", "vide", "vide", "vide"]),
    numbered("Informatique", ["maitrise", "solide", "solide", "commence", "vide", "vide"]),
  ],
  suggestions: [
    {
      id: "calcul-aires",
      subject: "Maths",
      chapter: "Intégrales",
      title: "Calcul d'aires sous une courbe",
      questions: 10,
      minutes: 8,
      difficulty: "moyen",
      xp: 40,
      source: "Inspiré du Bac 2024",
    },
    {
      id: "ondes-progressives",
      subject: "Physique",
      chapter: "Ondes mécaniques",
      title: "Ondes progressives",
      questions: 10,
      minutes: 8,
      difficulty: "facile",
      xp: 30,
      bestScore: "6/10",
    },
  ],
  leaderboard: [
    { rank: 11, name: "amine.k", xp: 1240 },
    { rank: 12, name: null, xp: 1180, change: 3 },
    { rank: 13, name: "sarra.m", xp: 1150 },
  ],
};
