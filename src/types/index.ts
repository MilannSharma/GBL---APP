// Global Domain Models (mapped from API/DB, consumed by UI)

export type VisitStatus = 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type SyncStatus = 'draft' | 'pending' | 'synced' | 'failed';

export interface Visit {
  id: string;
  agentId: string;
  hospitalId: string;
  hospitalName: string;
  scheduledDate: string;
  status: VisitStatus;
  checkInTime?: string;
  checkOutTime?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  photoUrls: string[];
  signatureUrl?: string;
  syncStatus: SyncStatus;
}

export interface Hospital {
  id: string;
  name: string;
  code?: string;
  address: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  contactPerson?: string;
  contactPhone?: string;
}

/** The agent as returned by login and kept in secure store. Never holds the password. */
export interface AgentProfile {
  _id: string;
  name: string;
  code?: string | null;
  username?: string | null;
  contact?: number | string | null;
  email?: string | null;
  isManager?: boolean | null;
  isActive?: boolean | null;
  assignedStates?: string[] | null;
}
