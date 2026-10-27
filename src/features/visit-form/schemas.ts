import { z } from 'zod';

export const visitFormSchema = z.object({
  doctorMet: z.string().min(2, 'Doctor name must be at least 2 characters'),
  department: z.string().min(2, 'Department is required'),
  discussionNotes: z.string().min(10, 'Discussion notes must be at least 10 characters'),
  orderCollected: z.boolean().default(false),
  orderValue: z.number().nonnegative().optional(),
  followUpDate: z.string().optional(),
});

export type VisitFormValues = z.infer<typeof visitFormSchema>;
