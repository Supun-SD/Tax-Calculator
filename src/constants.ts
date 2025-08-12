// Validation constants
export const VALIDATION = {
  MIN_PERCENTAGE: 0,
  MAX_PERCENTAGE: 100,
  MIN_AMOUNT: 0,
  MAX_AMOUNT: 999999999,
} as const;

// Default values
export const DEFAULTS = {
  ITEMS_PER_PAGE: 10,
  SEARCH_DEBOUNCE_MS: 300,
} as const;

// Application constants
export const APP = {
  NAME: 'Tax Calculator',
  VERSION: '1.0.0',
} as const;
