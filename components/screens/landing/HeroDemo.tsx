import type { CSSProperties } from "react";
import { AnswerOption, type AnswerState } from "@/components/ui/AnswerOption";
import { Card } from "@/components/ui/Card";
import { Mosaic } from "@/components/ui/Mosaic";
import { XPChip } from "@/components/ui/XPChip";
import { EXAMPLE_MATHS_DROP, EXAMPLE_ROWS } from "@/lib/mock";

// The hero illustration plays the Qrious loop once on load, in pure CSS
// (landing.css): the student picks A, A turns « Pas encore » and C « Juste »,
// « + 40 XP » pops, then the Maths tile drops in. Each answer state is a layer
// stacked on the idle option and fading in at its moment (--at). Under
// « Réduire les animations » the final state shows at once.

/** When each step happens, after the page opens. */
const MOMENTS = {
  select: "1500ms",
  check: "2300ms",
  xp: "2900ms",
  tileDrop: "3300ms",
};

const ANSWERS: { letter: "A" | "C"; text: string; layers: { state: AnswerState; at: string }[] }[] = [
  {
    letter: "A",
    text: "f′(x) = ln(x)",
    layers: [
      { state: "selected", at: MOMENTS.select },
      { state: "wrong", at: MOMENTS.check },
    ],
  },
  { letter: "C", text: "f′(x) = ln(x) + 1", layers: [{ state: "correct", at: MOMENTS.check }] },
];

const at = (moment: string) => ({ "--at": moment }) as CSSProperties;

export function HeroDemo() {
  return (
    <div
      aria-hidden
      inert
      className="hero-demo landing-in mt-2 grid gap-4 [--i:3] sm:grid-cols-2 lg:relative lg:mt-0 lg:block lg:min-h-115 lg:flex-[1_1_480px]"
    >
      <Card raised className="flex flex-col gap-2.5 sm:gap-3 lg:absolute lg:top-0 lg:left-0 lg:w-105">
        <span className="text-[13px] font-bold text-magenta-texte">Maths · Fonction logarithme</span>
        <p className="text-base leading-6 lg:text-lg lg:leading-6.75">Quelle est la dérivée de f(x) = x ln(x) ?</p>
        {ANSWERS.map((answer) => (
          <div key={answer.letter} className="grid">
            <div className="[grid-area:1/1]">
              <AnswerOption letter={answer.letter}>{answer.text}</AnswerOption>
            </div>
            {answer.layers.map((layer) => (
              <div key={layer.state} className="demo-step [grid-area:1/1]" style={at(layer.at)}>
                <AnswerOption letter={answer.letter} state={layer.state}>
                  {answer.text}
                </AnswerOption>
              </div>
            ))}
          </div>
        ))}
      </Card>

      <Card raised className="hidden flex-col gap-3 sm:flex lg:absolute lg:right-0 lg:bottom-0 lg:w-95">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold">Ta mosaïque</span>
          <span className="demo-pop" style={at(MOMENTS.xp)}>
            <XPChip amount={40} />
          </span>
        </div>
        <div style={at(MOMENTS.tileDrop)}>
          <Mosaic rows={[EXAMPLE_MATHS_DROP, EXAMPLE_ROWS.physique]} tileSize={20} showLegend={false} />
        </div>
      </Card>
    </div>
  );
}
