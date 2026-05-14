/**
 * Utility functions to prevent hydration mismatches
 */

/**
 * Formats a number as currency without locale-specific formatting
 * to prevent hydration mismatches between server and client
 */
export const formatCurrency = (amount: number): string => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Formats a number without locale-specific formatting
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Formats a date consistently to prevent hydration mismatches
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

/**
 * Safe number formatting that checks for hydration environment
 */
export const safeFormatNumber = (num: number): string => {
  // Use consistent formatting during hydration
  if (typeof window === 'undefined') {
    return formatNumber(num);
  }
  return formatNumber(num);
};

/**
 * Safe currency formatting that checks for hydration environment
 */
export const safeFormatCurrency = (amount: number): string => {
  // Use consistent formatting during hydration
  if (typeof window === 'undefined') {
    return formatCurrency(amount);
  }
  return formatCurrency(amount);
};
