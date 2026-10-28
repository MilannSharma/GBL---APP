// TODO(api): Mock fallback for visits per rule 5 until backend endpoints are active
import { HospitalVisit } from './types';

export const MUMBAI_HOSPITAL_PRESETS = [
  {
    name: 'Apollo Hospitals, Andheri',
    address: 'Andheri West, Mumbai, Maharashtra',
    city: 'Mumbai',
    department: 'Cardiology',
    doctorName: 'Dr. Rajesh Sharma',
    latitude: 19.1197,
    longitude: 72.8464,
  },
  {
    name: 'Fortis Healthcare, Mulund',
    address: 'Mulund West, Mumbai, Maharashtra',
    city: 'Mumbai',
    department: 'Orthopedics',
    doctorName: 'Dr. Ananya Iyer',
    latitude: 19.1726,
    longitude: 72.9425,
  },
  {
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    address: 'Andheri East, Mumbai, Maharashtra',
    city: 'Mumbai',
    department: 'Neurology',
    doctorName: 'Dr. Vikram Seth',
    latitude: 19.1311,
    longitude: 72.8256,
  },
  {
    name: 'Lilavati Hospital',
    address: 'Bandra West, Mumbai, Maharashtra',
    city: 'Mumbai',
    department: 'Oncology',
    doctorName: 'Dr. Priya Merchant',
    latitude: 19.0514,
    longitude: 72.8295,
  },
  {
    name: 'Hiranandani Hospital',
    address: 'Powai, Mumbai, Maharashtra',
    city: 'Mumbai',
    department: 'General Medicine',
    doctorName: 'Dr. Sameer Kulkarni',
    latitude: 19.1198,
    longitude: 72.9056,
  },
  {
    name: 'Wockhardt Hospital',
    address: 'Mumbai Central, Mumbai, Maharashtra',
    city: 'Mumbai',
    department: 'Nephrology',
    doctorName: 'Dr. Farhan Shaikh',
    latitude: 18.9712,
    longitude: 72.8197,
  },
  {
    name: 'P.D. Hinduja Hospital',
    address: 'Mahim, Mumbai, Maharashtra',
    city: 'Mumbai',
    department: 'Pediatrics',
    doctorName: 'Dr. Meera Nambiar',
    latitude: 19.0330,
    longitude: 72.8397,
  },
];

let memoryVisits: HospitalVisit[] = [
  {
    id: 'v-apollo-1',
    hospitalName: 'Apollo Hospitals, Andheri',
    address: 'Andheri West, Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    time: '09:30 AM',
    date: '24 Nov 2025',
    isoDate: '2025-11-24',
    status: 'not_visited',
    doctorName: 'Dr. Rajesh Sharma',
    department: 'Cardiology',
    latitude: 19.1197,
    longitude: 72.8464,
    notes: 'Verify ICU drug availability and discuss monthly supply schedule.',
  },
  {
    id: 'v-fortis-2',
    hospitalName: 'Fortis Healthcare, Mulund',
    address: 'Mulund West, Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    time: '11:15 AM',
    date: '24 Nov 2025',
    isoDate: '2025-11-24',
    status: 'not_visited',
    doctorName: 'Dr. Ananya Iyer',
    department: 'Orthopedics',
    latitude: 19.1726,
    longitude: 72.9425,
    notes: 'Orthopedic surgical kit demonstration and stock refill audit.',
  },
  {
    id: 'v-kokilaben-3',
    hospitalName: 'Kokilaben Dhirubhai Ambani Hospital',
    address: 'Andheri East, Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    time: '01:00 PM',
    date: '24 Nov 2025',
    isoDate: '2025-11-24',
    status: 'not_visited',
    doctorName: 'Dr. Vikram Seth',
    department: 'Neurology',
    latitude: 19.1311,
    longitude: 72.8256,
    notes: 'Quarterly review with Chief of Pharmacy.',
  },
  {
    id: 'v-lilavati-4',
    hospitalName: 'Lilavati Hospital',
    address: 'Bandra West, Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    time: '02:30 PM',
    date: '24 Nov 2025',
    isoDate: '2025-11-24',
    status: 'not_visited',
    doctorName: 'Dr. Priya Merchant',
    department: 'Oncology',
    latitude: 19.0514,
    longitude: 72.8295,
    notes: 'Follow-up on chemotherapy consumable order status.',
  },
  {
    id: 'v-hiranandani-5',
    hospitalName: 'Hiranandani Hospital',
    address: 'Powai, Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    time: '04:00 PM',
    date: '24 Nov 2025',
    isoDate: '2025-11-24',
    status: 'not_visited',
    doctorName: 'Dr. Sameer Kulkarni',
    department: 'General Medicine',
    latitude: 19.1198,
    longitude: 72.9056,
    notes: 'Collect signed purchase requisition from Dr. Kulkarni.',
  },
  {
    id: 'v-wockhardt-6',
    hospitalName: 'Wockhardt Hospital',
    address: 'Mumbai Central, Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    time: '05:30 PM',
    date: '24 Nov 2025',
    isoDate: '2025-11-24',
    status: 'not_visited',
    doctorName: 'Dr. Farhan Shaikh',
    department: 'Nephrology',
    latitude: 18.9712,
    longitude: 72.8197,
    notes: 'Dialysis fluid batch verification and receipt confirmation.',
  },
  {
    id: 'v-hinduja-7',
    hospitalName: 'P.D. Hinduja Hospital',
    address: 'Mahim, Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    time: '07:00 PM',
    date: '24 Nov 2025',
    isoDate: '2025-11-24',
    status: 'not_visited',
    doctorName: 'Dr. Meera Nambiar',
    department: 'Pediatrics',
    latitude: 19.0330,
    longitude: 72.8397,
    notes: 'Evening wrap-up visit and pediatric unit delivery handover.',
  },
];

export const visitsApi = {
  async getHospitalVisits(dateFilter?: string): Promise<HospitalVisit[]> {
    if (!dateFilter || dateFilter === 'all') {
      return [...memoryVisits];
    }
    return memoryVisits.filter(
      (v) => v.date.toLowerCase() === dateFilter.toLowerCase() || v.isoDate === dateFilter
    );
  },

  async getVisitById(id: string): Promise<HospitalVisit | undefined> {
    return memoryVisits.find((v) => v.id === id);
  },

  async addHospitalVisit(
    newVisit: Omit<HospitalVisit, 'id'>
  ): Promise<HospitalVisit> {
    const created: HospitalVisit = {
      ...newVisit,
      id: `v-custom-${Date.now()}`,
    };
    memoryVisits = [created, ...memoryVisits];
    return created;
  },

  async updateHospitalVisit(
    id: string,
    updates: Partial<HospitalVisit>
  ): Promise<HospitalVisit | null> {
    const idx = memoryVisits.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    const updated = { ...memoryVisits[idx], ...updates };
    memoryVisits[idx] = updated;
    return updated;
  },

  async toggleHospitalVisitStatus(
    id: string
  ): Promise<HospitalVisit | null> {
    const visit = memoryVisits.find((v) => v.id === id);
    if (!visit) return null;
    const nextStatus = visit.status === 'visited' ? 'not_visited' : 'visited';
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updates: Partial<HospitalVisit> = {
      status: nextStatus,
      checkInTime: nextStatus === 'visited' ? timeStr : undefined,
      checkOutTime: nextStatus === 'visited' ? 'In progress' : undefined,
    };
    return visitsApi.updateHospitalVisit(id, updates);
  },
};
