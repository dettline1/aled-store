export const CURRENCIES = {
  RUB: 'RUB',
  EUR: 'EUR',
  USD: 'USD',
} as const;

export const DEFAULT_CURRENCY = CURRENCIES.RUB;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 24,
  MAX_LIMIT: 100,
} as const;

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const MEDIA = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ],
  THUMBNAIL_SIZES: {
    SMALL: { width: 150, height: 150 },
    MEDIUM: { width: 300, height: 300 },
    LARGE: { width: 800, height: 800 },
  },
} as const;

export const JWT = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
} as const;

export const RATE_LIMITS = {
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
  },
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
  },
} as const;
