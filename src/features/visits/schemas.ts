import { z } from 'zod';

export const visitFilterSchema = z.object({
  status: z.enum(['all', 'assigned', 'in_progress', 'completed', 'cancelled']).optional(),
  date: z.string().optional(),
});
