import { Card } from "@/components/ui/Card";
import { Mosaic } from "@/components/ui/Mosaic";
import { EXAMPLE_BAC_EMPTY_ROWS } from "@/lib/mock";

/** Navy panel of Bienvenue (desktop), as in the BienvenueDesktop mockup: an empty Bac mosaic. */
export function BienvenuePanel() {
  return (
    <>
      <div className="flex max-w-115 flex-col gap-2.5">
        <h2 className="font-display text-4xl leading-10.5 font-semibold tracking-[-0.02em]">Ta mosaïque Bac prend forme</h2>
        <p className="text-[17px] leading-6.5 text-sur-nuit-douce">
          Une tuile par chapitre de ton programme. Chaque QCM la fait avancer.
        </p>
      </div>
      <div aria-hidden className="mosaic-fill">
        <Card>
          <Mosaic rows={EXAMPLE_BAC_EMPTY_ROWS} tileSize={24} stagger />
        </Card>
      </div>
    </>
  );
}
