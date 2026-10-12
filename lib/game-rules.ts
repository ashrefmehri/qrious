// Qrious game rules (docs/07-game-rules.md). Every number here is a
// PROPOSITION to tune with real students: no other file may contain them.

export type Difficulty = "facile" | "moyen" | "difficile";

/** qcm = a regular QCM, defi = Défi rapide, essai = the free trial. */
export type AttemptKind = "qcm" | "defi" | "essai";

export const TILE_STATES = ["vide", "commence", "solide", "maitrise"] as const;
export type TileState = (typeof TILE_STATES)[number];

const DAY_MS = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// XP

export const XP_PER_CORRECT_ANSWER: Record<Difficulty, number> = {
  facile: 2,
  moyen: 4,
  difficile: 6,
};
export const XP_FINISH_BONUS = 5;
export const XP_PERFECT_BONUS = 10;

/** Anti-farming: replays of the same QCM inside this window earn less. */
export const REPLAY_WINDOW_DAYS = 7;
/** The 2nd and 3rd plays in the window earn REPLAY_REDUCED_RATE, later ones 0. */
export const REPLAY_REDUCED_PLAYS = 2;
export const REPLAY_REDUCED_RATE = 0.5;

export type AnsweredQuestion = { difficulty: Difficulty; correct: boolean };

export type AttemptXp = {
  answers: number;
  finish: number;
  perfect: number;
  /** Anti-farming rate applied to the sum (1, 0.5 or 0). */
  rate: number;
  total: number;
};

/**
 * Share of XP a new play of a QCM earns, given the student's previous
 * finished plays of that same QCM. The window opens on a full-XP play and
 * lasts REPLAY_WINDOW_DAYS: 1st play 100 %, 2nd and 3rd 50 %, then 0 until
 * the window closes.
 */
export function replayXpRate(previousPlays: readonly Date[], now: Date): number {
  const times = previousPlays
    .map((play) => play.getTime())
    .filter((time) => time <= now.getTime())
    .sort((a, b) => a - b);

  let windowStart: number | null = null;
  let playsInWindow = 0;
  for (const time of times) {
    if (windowStart === null || time - windowStart >= REPLAY_WINDOW_DAYS * DAY_MS) {
      windowStart = time;
      playsInWindow = 1;
    } else {
      playsInWindow += 1;
    }
  }

  if (windowStart === null || now.getTime() - windowStart >= REPLAY_WINDOW_DAYS * DAY_MS) return 1;
  return playsInWindow <= REPLAY_REDUCED_PLAYS ? REPLAY_REDUCED_RATE : 0;
}

/**
 * XP for a finished attempt. `rate` comes from replayXpRate; Défi rapide is
 * never reduced and the trial earns nothing. Reduced totals round down.
 */
export function attemptXp(
  kind: AttemptKind,
  answers: readonly AnsweredQuestion[],
  rate = 1,
): AttemptXp {
  if (kind === "essai") return { answers: 0, finish: 0, perfect: 0, rate: 0, total: 0 };

  const answersXp = answers.reduce(
    (sum, answer) => sum + (answer.correct ? XP_PER_CORRECT_ANSWER[answer.difficulty] : 0),
    0,
  );
  const perfect = answers.length > 0 && answers.every((answer) => answer.correct) ? XP_PERFECT_BONUS : 0;
  const appliedRate = kind === "defi" ? 1 : rate;
  const total = Math.floor((answersXp + XP_FINISH_BONUS + perfect) * appliedRate);

  return { answers: answersXp, finish: XP_FINISH_BONUS, perfect, rate: appliedRate, total };
}

// ---------------------------------------------------------------------------
// Levels

export const LEVEL_BASE_XP = 100;
export const LEVEL_STEP_XP = 50;

/** XP needed to go from `level` to `level + 1`. */
export function xpToNextLevel(level: number): number {
  return LEVEL_BASE_XP + LEVEL_STEP_XP * (level - 1);
}

export type LevelProgress = {
  level: number;
  /** XP earned inside the current level (« 240 » in « 240 / 400 XP »). */
  xpInLevel: number;
  /** XP the current level needs (« 400 »). */
  xpForNextLevel: number;
};

export function levelFromXp(totalXp: number): LevelProgress {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));
  while (remaining >= xpToNextLevel(level)) {
    remaining -= xpToNextLevel(level);
    level += 1;
  }
  return { level, xpInLevel: remaining, xpForNextLevel: xpToNextLevel(level) };
}

// ---------------------------------------------------------------------------
// Mosaic tile states

/** Success rates are measured on the chapter's most recent answers. */
export const TILE_RECENT_ANSWERS = 20;
export const SOLIDE_MIN_ANSWERS = 10;
export const SOLIDE_MIN_SUCCESS = 0.7;
export const MAITRISE_MIN_ANSWERS = 20;
export const MAITRISE_MIN_SUCCESS = 0.85;
/** Maîtrisé also needs one Difficile QCM of the chapter finished with this score. */
export const MAITRISE_DIFFICILE_MIN_SCORE = 0.8;

export type ChapterHistory = {
  /**
   * Correct (true) or wrong (false) for the chapter's answers in QCMs and
   * Défi rapide, oldest first. Passing only the last TILE_RECENT_ANSWERS is
   * enough: no threshold needs more.
   */
  results: readonly boolean[];
  /** Answers given in the free trial: they only count toward « Commencé ». */
  trialAnswers: number;
  /** A Difficile QCM of this chapter was finished with ≥ MAITRISE_DIFFICILE_MIN_SCORE. */
  difficileQcmPassed: boolean;
};

export function tileStateRank(state: TileState): number {
  return TILE_STATES.indexOf(state);
}

function meetsRate(correct: number, total: number, rate: number): boolean {
  return total > 0 && correct >= rate * total - 1e-9;
}

/** The state the chapter's answers qualify for, before the one-step-down rule. */
export function tileStateFromHistory(history: ChapterHistory): TileState {
  const answered = history.results.length;
  const recent = history.results.slice(-TILE_RECENT_ANSWERS);
  const recentCorrect = recent.filter(Boolean).length;

  if (
    answered >= MAITRISE_MIN_ANSWERS &&
    meetsRate(recentCorrect, recent.length, MAITRISE_MIN_SUCCESS) &&
    history.difficileQcmPassed
  ) {
    return "maitrise";
  }
  if (answered >= SOLIDE_MIN_ANSWERS && meetsRate(recentCorrect, recent.length, SOLIDE_MIN_SUCCESS)) {
    return "solide";
  }
  if (answered + history.trialAnswers > 0) return "commence";
  return "vide";
}

/** State to store after an attempt: it can rise any number of steps but drops one at most. */
export function nextTileState(previous: TileState, qualified: TileState): TileState {
  const previousRank = tileStateRank(previous);
  return tileStateRank(qualified) >= previousRank - 1 ? qualified : TILE_STATES[previousRank - 1];
}

/** The tile drop animation only plays on the way up. */
export function playsTileDrop(previous: TileState, next: TileState): boolean {
  return tileStateRank(next) > tileStateRank(previous);
}

/**
 * Coach hint « Encore N bonnes réponses pour la rendre solide »: the smallest
 * number of correct answers in a row that reaches the state above `current`.
 * Null when answers alone cannot get there (already maîtrisé, or maîtrisé
 * still needs a Difficile QCM).
 */
export function correctAnswersToNextState(history: ChapterHistory, current: TileState): number | null {
  const target = tileStateRank(current) + 1;
  if (target >= TILE_STATES.length) return null;

  // After TILE_RECENT_ANSWERS correct answers the recent window is perfect,
  // so if the target is reachable by answers it is reached by then.
  for (let n = 1; n <= TILE_RECENT_ANSWERS; n++) {
    const results = [...history.results, ...Array<boolean>(n).fill(true)];
    if (tileStateRank(tileStateFromHistory({ ...history, results })) >= target) return n;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Weekly leaderboard (logic in M6)

/** Weeks run Monday 00:00 to Sunday 23:59 in this time zone. */
export const LEADERBOARD_TIME_ZONE = "Africa/Tunis";
/** The leaderboard stays locked until the student has finished this many QCMs. */
export const LEADERBOARD_UNLOCK_FINISHED_QCMS = 3;
export const LEADERBOARD_TOP_COUNT = 50;

// ---------------------------------------------------------------------------
// Défi rapide (logic in M6)

export const DEFI_QUESTION_COUNT = 10;
/** Questions taken from the student's weakest started chapters… */
export const DEFI_WEAK_QUESTION_COUNT = 5;
/** …which are the N started chapters with the lowest recent success rate. */
export const DEFI_WEAK_CHAPTER_COUNT = 3;
/** Avoid questions answered in the last N days when possible. */
export const DEFI_AVOID_REPEAT_DAYS = 7;

// ---------------------------------------------------------------------------
// Coach suggestion (logic in M5)

/** Suggest the easiest difficulty not yet passed at this score. */
export const SUGGESTION_PASS_SCORE = 0.7;
/** Subject used for the first suggestion while coefficients are unknown. */
export const SUGGESTION_FALLBACK_SUBJECT = "mathematiques";
