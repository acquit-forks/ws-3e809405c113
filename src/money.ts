export type Line = { amount: number };

/**
 * Formats the total of the given lines for a currency.
 *
 * The number of fraction digits is not a fixed choice per app: ISO 4217
 * defines a minor-unit exponent per currency (USD/EUR = 2, KWD/BHD/TND/JOD
 * etc. = 3, JPY/KRW/VND etc. = 0, CLF = 4). Intl.NumberFormat applies those
 * defaults, so the digits are derived from the currency rather than hardcoded.
 */
export function formatTotal(lines: Line[], currency: string): string {
  const sum = lines.reduce((total, line) => total + line.amount, 0);
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    useGrouping: false,
  });
  // Drop the currency symbol/signifier and the literal separator that some
  // currencies render between the symbol and the amount; keep only the number.
  const numericTypes = new Set([
    'minusSign',
    'plusSign',
    'integer',
    'group',
    'decimal',
    'fraction',
  ]);
  return formatter
    .formatToParts(sum)
    .filter((part) => numericTypes.has(part.type))
    .map((part) => part.value)
    .join('');
}
