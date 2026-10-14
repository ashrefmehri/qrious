import { Card } from "@/components/ui/Card";
import { Mosaic } from "@/components/ui/Mosaic";
import { EXAMPLE_EMPTY_ROWS } from "@/lib/mock";

/**
 * Navy panel of Inscription and Vérification (desktop): a new student's empty
 * mosaic, whose first tile drops in ringed. Shown while the free trial is
 * postponed (docs/08-onboarding.md).
 */
export function NewStudentPanel() {
  return (
    <>
      <div className="flex max-w-120 flex-col gap-5">
        <h2 className="font-display text-4xl leading-10.5 font-semibold tracking-[-0.02em]">Ta mosaïque commence ici</h2>
        <p className="text-[17px] leading-6.5 text-sur-nuit-douce">
          Une tuile par chapitre de ton programme. Elle avance à chaque bonne réponse.
        </p>
      </div>
      <div aria-hidden className="mosaic-fill max-w-120">
        <Card>
          <Mosaic rows={EXAMPLE_EMPTY_ROWS} tileSize={22} showLegend={false} stagger />
        </Card>
      </div>
    </>
  );
}
