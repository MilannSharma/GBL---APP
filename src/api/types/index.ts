// Raw Backend API DTOs

export interface ApiAuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  agent: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    assignedHospitalIds: string[];
  };
}

export interface ApiVisitDto {
  id: string;
  agentId: string;
  hospitalId: string;
  hospitalName: string;
  scheduledDate: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  checkInTime?: string;
  checkOutTime?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  photoUrls?: string[];
  signatureUrl?: string;
  updatedAt: string;
}

export interface ApiHospitalDto {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  contactPerson: string;
  contactPhone: string;
}

export interface ApiNotificationDto {
  id: string;
  title: string;
  body: string;
  type: 'visit_assigned' | 'reminder' | 'system';
  read: boolean;
  createdAt: string;
}

export interface ApiSyncItemDto {
  idempotencyKey: string;
  action: 'check_in' | 'upload_photo' | 'submit_form' | 'check_out';
  entityId: string;
  payload: Record<string, unknown>;
  createdAt: string;
}
