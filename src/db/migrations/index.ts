import { SQLiteDatabase } from 'expo-sqlite';
import { logger } from '@/core/logger';

export interface Migration {
  version: number;
  name: string;
  up: (db: SQLiteDatabase) => Promise<void>;
}

export const migrations: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    up: async (_db: SQLiteDatabase) => {
      logger.info('Running migration 001_initial_schema');
    },
  },
];

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);
}
