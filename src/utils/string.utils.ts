/** Uppercases the first character of a string, leaving the rest unchanged. */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
