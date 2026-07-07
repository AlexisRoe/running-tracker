/** Formats a km value to 2 decimals, hiding the decimal part entirely for whole numbers. */
export function formatDistance(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}
