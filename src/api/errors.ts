export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'INVALID_RESPONSE'
  | 'LOCATION_UNAVAILABLE'
  | 'OUTBOX_SYNC_FAILED'
  | 'OFFLINE_STORAGE_ERROR'
  | 'UNKNOWN_ERROR';

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly meta?: Record<string, unknown>;

  constructor(code: AppErrorCode, message: string, meta?: Record<string, unknown>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.meta = meta;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
