import { getDb } from '../client';
import { hospitalsEndpoints } from '@/api/endpoints/hospitals';
import { logger } from '@/core/logger';

export interface LocalHospital {
  id: string;
  name: string;
  code?: string | null;
  address: string;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contact_person?: string | null;
  contact_phone?: string | null;
  created_at: string;
  updated_at: string;
}

export const hospitalsRepo = {
  async getAll(): Promise<LocalHospital[]> {
    const db = await getDb();
    return await db.getAllAsync<LocalHospital>(`SELECT * FROM hospitals ORDER BY name ASC`);
  },

  async getById(id: string): Promise<LocalHospital | null> {
    const db = await getDb();
    return await db.getFirstAsync<LocalHospital>(`SELECT * FROM hospitals WHERE id = ?`, [id]);
  },

  async refreshHospitals(): Promise<void> {
    try {
      const remoteHospitals = await hospitalsEndpoints.getHospitals();
      const db = await getDb();
      const now = new Date().toISOString();

      await db.withTransactionAsync(async () => {
        for (const h of remoteHospitals) {
          await db.runAsync(
            `INSERT OR REPLACE INTO hospitals (
              id, name, code, address, city, state, latitude, longitude,
              contact_person, contact_phone, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              h.id,
              h.name,
              h.code || null,
              h.address,
              h.city || null,
              h.state || null,
              h.latitude || null,
              h.longitude || null,
              h.contactPerson || null,
              h.contactPhone || null,
              now,
              now,
            ]
          );
        }
      });
    } catch (error) {
      logger.warn('Failed to refresh hospitals from API, keeping local cache', { error });
    }
  },
};
