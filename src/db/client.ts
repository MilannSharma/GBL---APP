import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL } from './schema';
import { logger } from '@/core/logger';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    try {
      dbInstance = await SQLite.openDatabaseAsync('field_agent.db');
      await dbInstance.execAsync(CREATE_TABLES_SQL);
      logger.info('SQLite Database initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize SQLite database', error);
      throw error;
    }
  }
  return dbInstance;
}
