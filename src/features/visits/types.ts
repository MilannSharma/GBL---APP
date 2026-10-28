export type { Visit, VisitStatus, SyncStatus } from '@/types';

export interface HospitalVisit {
  id: string;
  hospitalName: string;
  address: string;
  city?: string;
  state?: string;
  time: string; // e.g. "09:30 AM"
  date: string; // e.g. "24 Nov 2025"
  isoDate: string; // e.g. "2025-11-24"
  status: 'visited' | 'not_visited';
  latitude?: number;
  longitude?: number;
  doctorName?: string;
  department?: string;
  notes?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface VisitFilterOptions {
  status?: 'all' | 'visited' | 'not_visited';
  date?: string;
  sortBy?: 'time' | 'name' | 'status';
}
