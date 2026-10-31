export type { Visit, VisitStatus, SyncStatus } from '@/types';

/** UI model of one agent visit to an entity (hospital). Built from the visit API by `mappers.ts`. */
export interface HospitalVisit {
  id: string;
  entityId?: string;
  hospitalName: string;
  address: string;
  city?: string;
  state?: string;
  hospitalType?: string;
  visitedAt: string; // UTC ISO timestamp; orders the day's timeline
  time: string; // e.g. "09:30 AM"
  date: string; // e.g. "24 Nov 2025"
  isoDate: string; // e.g. "2025-11-24"
  // A visit is a single point-in-time record on the server; every listed visit is a visit that happened.
  status: 'visited' | 'not_visited';
  latitude?: number;
  longitude?: number;
  /** GPS accuracy in meters, as captured on the phone at the visit. */
  accuracy?: string;
  agentId?: string;
  agentName?: string;
  contactName?: string;
  contactPhone?: string;
  contactRole?: string;
  contactRoleDesc?: string;
  remark?: string;
  selfieUrl?: string;
  // Aliases read by the Home timeline cards: contact met and its role, remark as notes.
  doctorName?: string;
  department?: string;
  notes?: string;
}

/** A hospital as shown in search results and on the hospital page. */
export interface HospitalEntity {
  id: string;
  name: string;
  city?: string;
  state?: string;
  hospitalType?: string;
  address?: string;
}

export interface HospitalContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role?: string;
  roleDesc?: string;
}
