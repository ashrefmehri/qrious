// French formatting for everything students read (fr-FR: « 1 180 » with a
// narrow no-break space as thousands separator).

const numberFormat = new Intl.NumberFormat("fr-FR");

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}
