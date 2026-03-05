/**
 * Sanitize a string for safe inclusion in SVG/XML.
 * Prevents XSS via SVG injection.
 */
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Validate a hex color string (without #). Accepts 3, 4, 6, or 8 hex chars.
 */
export function isValidHex(hex: string): boolean {
  return /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?$/.test(hex);
}

/**
 * Sanitize a GitHub username. GitHub usernames allow alphanumeric + single hyphens,
 * 1-39 characters, cannot start/end with hyphen.
 */
export function sanitizeUsername(username: string): string | null {
  const clean = username.trim();
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(clean)) {
    return clean;
  }
  return null;
}

/**
 * Sanitize a hex color query parameter. Returns cleaned hex (no #) or undefined.
 */
export function sanitizeHexParam(
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  const clean = value.replace(/^#/, "");
  return isValidHex(clean) ? clean : undefined;
}

/**
 * Format a number with locale-aware commas for display.
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}
