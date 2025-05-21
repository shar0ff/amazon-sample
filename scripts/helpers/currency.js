/**
 * Converts a price in cents to a formatted dollar amount string.
 *
 * @param {number} priceCents - The price in cents (e.g., 1999 for $19.99).
 * @returns {string} - A string formatted to two decimal places (e.g., "19.99").
 */
export function formatCurrency(priceCents) {
    return (Math.round(priceCents) / 100).toFixed(2);
}