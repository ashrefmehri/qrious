import { formatNumber } from "@/lib/format";

export type XPChipProps = { amount: number };

/** The yellow reward chip. Works on surface and nuit. */
export function XPChip({ amount }: XPChipProps) {
  return (
    <span className="inline-flex h-8 items-center gap-1 rounded-pill bg-jaune px-3.5 font-text text-[15px] font-bold whitespace-nowrap text-sur-jaune">
      + {formatNumber(amount)} XP
    </span>
  );
}
