/**
 * Utility constants and helpers.
 * 
 * Centralized constants prevent magic strings scattered across the codebase.
 * AsyncStorage keys are defined here to avoid typo-induced bugs.
 */

// ── AsyncStorage Keys ──
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@RewardLoop:authToken',
  USER_DATA: '@RewardLoop:userData',
  FAVORITES: '@RewardLoop:favorites',
  LOYALTY_DATA: '@RewardLoop:loyaltyData',
};

// ── Loyalty Point Values ──
// Defined as constants so they can be tuned from a single place
// (or eventually fetched from a backend config endpoint).
export const LOYALTY_POINTS = {
  LOGIN_BONUS: 5,
  FAVORITE_ADDED: 10,
};

// ── Loyalty Transaction Types ──
export const TRANSACTION_TYPES = {
  LOGIN_BONUS: 'LOGIN_BONUS',
  FAVORITE_ADDED: 'FAVORITE_ADDED',
};

/**
 * Format a date string into a readable format.
 * @param {string} isoString - ISO 8601 date string
 * @returns {string} e.g. "25 Feb 2026, 4:30 PM"
 */
export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Truncate text to a maximum length with ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
};
