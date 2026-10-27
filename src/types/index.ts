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

export interface AgentProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  assignedHospitalIds: string[];
}
