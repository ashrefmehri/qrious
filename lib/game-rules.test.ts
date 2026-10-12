import { describe, expect, it } from "vitest";
import {
  attemptXp,
  correctAnswersToNextState,
  levelFromXp,
  nextTileState,
  playsTileDrop,
  replayXpRate,
  tileStateFromHistory,
  xpToNextLevel,
  type AnsweredQuestion,
  type ChapterHistory,
} from "./game-rules";

const day = (n: number) => new Date(Date.UTC(2026, 9, 5 + n, 10));

function history(results: boolean[], extra: Partial<ChapterHistory> = {}): ChapterHistory {
  return { results, trialAnswers: 0, difficileQcmPassed: false, ...extra };
}

function results(correct: number, wrong: number): boolean[] {
  return [...Array<boolean>(wrong).fill(false), ...Array<boolean>(correct).fill(true)];
}

describe("attemptXp", () => {
  const answers: AnsweredQuestion[] = [
    { difficulty: "facile", correct: true },
    { difficulty: "moyen", correct: true },
    { difficulty: "difficile", correct: false },
  ];

  it("gives 2, 4, 6 XP per correct answer by difficulty, plus 5 for finishing", () => {
    expect(attemptXp("qcm", answers)).toEqual({ answers: 6, finish: 5, perfect: 0, rate: 1, total: 11 });
  });

  it("adds 10 for a perfect score", () => {
    const perfect = answers.map((answer) => ({ ...answer, correct: true }));
    expect(attemptXp("qcm", perfect).total).toBe(12 + 5 + 10);
  });

  it("gives no perfect bonus without answers", () => {
    expect(attemptXp("qcm", []).total).toBe(5);
  });

  it("applies the replay rate and rounds down", () => {
    expect(attemptXp("qcm", answers, 0.5).total).toBe(5);
    expect(attemptXp("qcm", answers, 0).total).toBe(0);
  });

  it("never reduces Défi rapide", () => {
    expect(attemptXp("defi", answers, 0).total).toBe(11);
  });

  it("gives nothing for the trial", () => {
    expect(attemptXp("essai", answers).total).toBe(0);
  });
});

describe("replayXpRate", () => {
  it("gives full XP on the first play", () => {
    expect(replayXpRate([], day(0))).toBe(1);
  });

  it("gives 50 % on the 2nd and 3rd plays within 7 days, then 0", () => {
    expect(replayXpRate([day(0)], day(1))).toBe(0.5);
    expect(replayXpRate([day(0), day(1)], day(2))).toBe(0.5);
    expect(replayXpRate([day(0), day(1), day(2)], day(3))).toBe(0);
    expect(replayXpRate([day(0), day(1), day(2), day(3)], day(6))).toBe(0);
  });

  it("gives full XP again 7 days after the first play of the window", () => {
    expect(replayXpRate([day(0), day(1), day(2), day(3)], day(7))).toBe(1);
  });

  it("opens a new window after a full-XP replay", () => {
    expect(replayXpRate([day(0), day(7)], day(8))).toBe(0.5);
    expect(replayXpRate([day(0), day(7), day(8), day(9)], day(10))).toBe(0);
  });

  it("ignores the order of previous plays", () => {
    expect(replayXpRate([day(2), day(0), day(1)], day(3))).toBe(0);
  });
});

describe("levels", () => {
  it("needs 100 + 50 × (n − 1) XP to go from level n to n + 1", () => {
    expect(xpToNextLevel(1)).toBe(100);
    expect(xpToNextLevel(6)).toBe(350);
    expect(xpToNextLevel(7)).toBe(400);
  });

  it("starts at level 1", () => {
    expect(levelFromXp(0)).toEqual({ level: 1, xpInLevel: 0, xpForNextLevel: 100 });
    expect(levelFromXp(-5)).toEqual({ level: 1, xpInLevel: 0, xpForNextLevel: 100 });
  });

  it("moves up exactly at the threshold", () => {
    expect(levelFromXp(99).level).toBe(1);
    expect(levelFromXp(100)).toEqual({ level: 2, xpInLevel: 0, xpForNextLevel: 150 });
  });

  it("shows « Niveau 7 » and « 240 / 400 XP »", () => {
    // Levels 1 to 6 need 100 + 150 + 200 + 250 + 300 + 350 = 1350 XP.
    expect(levelFromXp(1350 + 240)).toEqual({ level: 7, xpInLevel: 240, xpForNextLevel: 400 });
  });
});

describe("tileStateFromHistory", () => {
  it("is vide with no answers", () => {
    expect(tileStateFromHistory(history([]))).toBe("vide");
  });

  it("counts trial answers toward commencé only", () => {
    expect(tileStateFromHistory(history([], { trialAnswers: 3 }))).toBe("commence");
    expect(tileStateFromHistory(history(results(9, 0), { trialAnswers: 3 }))).toBe("commence");
  });

  it("is solide from 10 answers at 70 % or more", () => {
    expect(tileStateFromHistory(history(results(7, 3)))).toBe("solide");
    expect(tileStateFromHistory(history(results(6, 4)))).toBe("commence");
    expect(tileStateFromHistory(history(results(9, 0)))).toBe("commence");
  });

  it("measures success on the last 20 answers only", () => {
    expect(tileStateFromHistory(history(results(14, 10)))).toBe("solide");
    expect(tileStateFromHistory(history([...results(20, 0), ...results(0, 7)]))).toBe("commence");
  });

  it("is maîtrisé from 20 answers at 85 % and a passed Difficile QCM", () => {
    expect(tileStateFromHistory(history(results(17, 3), { difficileQcmPassed: true }))).toBe("maitrise");
    expect(tileStateFromHistory(history(results(16, 4), { difficileQcmPassed: true }))).toBe("solide");
    expect(tileStateFromHistory(history(results(20, 0)))).toBe("solide");
    expect(tileStateFromHistory(history(results(19, 0), { difficileQcmPassed: true }))).toBe("solide");
  });
});

describe("nextTileState and playsTileDrop", () => {
  it("can rise several steps at once", () => {
    expect(nextTileState("vide", "solide")).toBe("solide");
  });

  it("drops one step at most per attempt", () => {
    expect(nextTileState("maitrise", "commence")).toBe("solide");
    expect(nextTileState("solide", "commence")).toBe("commence");
  });

  it("plays the drop only on the way up", () => {
    expect(playsTileDrop("commence", "solide")).toBe(true);
    expect(playsTileDrop("solide", "solide")).toBe(false);
    expect(playsTileDrop("maitrise", "solide")).toBe(false);
  });
});

describe("correctAnswersToNextState", () => {
  it("needs 1 answer to start a tile", () => {
    expect(correctAnswersToNextState(history([]), "vide")).toBe(1);
  });

  it("needs 10 correct answers to make a trial-only tile solide", () => {
    expect(correctAnswersToNextState(history([], { trialAnswers: 3 }), "commence")).toBe(10);
  });

  it("finds the smallest streak that reaches 70 %", () => {
    // 6/10 now; 9/13 is 69 %, 10/14 is 71 %.
    expect(correctAnswersToNextState(history(results(6, 4)), "commence")).toBe(4);
  });

  it("is null when answers alone cannot reach the next state", () => {
    expect(correctAnswersToNextState(history(results(20, 0)), "solide")).toBeNull();
    expect(correctAnswersToNextState(history(results(20, 0)), "maitrise")).toBeNull();
  });

  it("counts toward maîtrisé once a Difficile QCM is passed", () => {
    // 15/20 now; each correct answer pushes a wrong one out of the window.
    expect(correctAnswersToNextState(history(results(15, 5), { difficileQcmPassed: true }), "solide")).toBe(2);
  });
});
