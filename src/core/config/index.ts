export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  sentryDsn?: string;
  offlineSyncIntervalMs: number;
  locationUpdateIntervalMs: number;
}

export const config: AppConfig = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api-dev.example.com',
  environment: (process.env.EXPO_PUBLIC_ENV as AppConfig['environment']) || 'development',
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  offlineSyncIntervalMs: 60 * 1000, // 1 minute
  locationUpdateIntervalMs: 15 * 1000, // 15 seconds
};
