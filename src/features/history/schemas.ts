import { z } from 'zod';

export const historyFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
