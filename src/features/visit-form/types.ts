export interface VisitFormData {
  visitId: string;
  doctorMet: string;
  department: string;
  discussionNotes: string;
  orderCollected?: boolean;
  orderValue?: number;
  followUpDate?: string;
}
