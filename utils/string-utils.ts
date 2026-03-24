/**
 * Extracts a numeric value from a raw UI string by removing non-digit characters.
 * Preserves decimal separators represented by dots.
 */
export function extractNumberFromString(value: string): number {
    return Number(value.replace(/[^0-9.]/g, ''));
}

/**
 * Normalizes UI text content by replacing non-breaking spaces and collapsing
 * repeated whitespace into single spaces for stable cross-page comparisons.
 */
export function normalizeString(value: string): string {
    return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}
