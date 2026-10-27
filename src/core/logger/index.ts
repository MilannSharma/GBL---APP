const SENSITIVE_KEYS = [
  'token',
  'password',
  'otp',
  'patient',
  'signature',
  'photo',
  'authorization',
  'secret',
];

function sanitize(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitize);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
    const isSensitive = SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s));
    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null) {
      sanitized[key] = sanitize(val);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>): void {
    if (__DEV__) {
      // In development, structured logging
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, context ? sanitize(context) : '');
    }
  },

  info(message: string, context?: Record<string, unknown>): void {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.info(`[INFO] ${message}`, context ? sanitize(context) : '');
    }
  },

  warn(message: string, context?: Record<string, unknown>): void {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, context ? sanitize(context) : '');
  },

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    const safeContext = context ? sanitize(context) : {};
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, error, safeContext);
  },
};
