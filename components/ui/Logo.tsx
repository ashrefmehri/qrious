export type LogoProps = {
  /** Wordmark font size in px; the symbol is 1.1 × this. Minimum 20 (16 for the symbol alone). */
  size?: number;
  /** Yellow dot and light wordmark, for `nuit` grounds. */
  onDark?: boolean;
  symbolOnly?: boolean;
};

/** The question-mark Q and the live « qrious » wordmark. */
export function Logo({ size = 28, onDark = false, symbolOnly = false }: LogoProps) {
  const mark = (
    <svg width={size * 1.1} height={size * 1.1} viewBox="0 0 64 64" aria-hidden>
      <path
        d="M15.3 36.5 A17 17 0 1 1 34.4 44.4 L33.8 49"
        fill="none"
        strokeWidth={7.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-magenta"
      />
      <circle cx={50} cy={55} r={6} className={onDark ? "fill-jaune" : "fill-encre"} />
    </svg>
  );

  if (symbolOnly) {
    return (
      <span role="img" aria-label="Qrious" className="inline-flex">
        {mark}
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label="Qrious"
      className={`inline-flex items-center gap-px font-display leading-none font-semibold tracking-[-0.035em] ${onDark ? "text-sur-nuit" : "text-encre"}`}
      style={{ fontSize: size }}
    >
      {mark}
      <span aria-hidden>qrious</span>
    </span>
  );
}
