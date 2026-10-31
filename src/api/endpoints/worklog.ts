import { z } from 'zod';
import { apiClient } from '../client';
import { AppError } from '../errors';
import { logger } from '@/core/logger';
import { failingPaths } from '../zod-paths';
import { appendFile, multipartConfig, UploadFile } from '../multipart';

// Only the fields the app reads are strict. The rest can arrive as ids or populated
// objects (userId, meter photos, locations), so they are not constrained here.
const OptionalNumber = z.coerce.number().nullish();

export const WorklogItemSchema = z.object({
  _id: z.string(),
  date: z.string().nullish(),
  workStartedAt: z.string().nullish(),
  workEndedAt: z.string().nullish(),
  initialReading: OptionalNumber,
  finalReading: OptionalNumber,
  vehicle: z.string().nullish(),
});

export const WorklogListSchema = z.object({
  docs: z.array(WorklogItemSchema),
  totalDocs: z.number(),
  page: z.number(),
  totalPages: z.number(),
  limit: z.number().optional(),
  hasPrevPage: z.boolean().optional(),
  hasNextPage: z.boolean().optional(),
});

export type WorklogItem = z.infer<typeof WorklogItemSchema>;
export type WorklogListResponse = z.infer<typeof WorklogListSchema>;
export type WorklogVehicle = 'CAR' | 'BIKE';

export interface StartWorklogRequest {
  initialReading: number;
  startMeter: UploadFile;
  latitude: string;
  longitude: string;
  accuracy?: string;
  vehicle?: WorklogVehicle;
}

export interface EndWorklogRequest {
  finalReading: number;
  endMeter: UploadFile;
  latitude: string;
  longitude: string;
  accuracy?: string;
}

export interface WorklogListParams {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Start/end already succeeded server-side when this runs, so a shape mismatch
 * must not surface as a failure. Callers re-read the day log when this is null.
 */
function parseMutationResponse(endpoint: string, data: unknown): WorklogItem | null {
  const parsed = WorklogItemSchema.safeParse(data);
  if (!parsed.success) {
    logger.warn('Unexpected worklog mutation response shape', { endpoint, fields: failingPaths(parsed.error) });
    return null;
  }
  return parsed.data;
}

export const worklogEndpoints = {
  /** Starts today's shift. The server stamps `workStartedAt`. */
  async startWorkShift(data: StartWorklogRequest): Promise<WorklogItem | null> {
    const form = new FormData();
    form.append('initialReading', String(data.initialReading));
    form.append('latitude', data.latitude);
    form.append('longitude', data.longitude);
    if (data.accuracy) form.append('accuracy', data.accuracy);
    if (data.vehicle) form.append('vehicle', data.vehicle);
    appendFile(form, 'startMeter', data.startMeter, 'start_meter.jpg');

    const response = await apiClient.post<unknown>('/api/v1/agent/worklog/start', form, multipartConfig);
    return parseMutationResponse('start', response.data);
  },

  /** Ends today's shift. The server stamps `workEndedAt`. */
  async endWorkShift(data: EndWorklogRequest): Promise<WorklogItem | null> {
    const form = new FormData();
    form.append('finalReading', String(data.finalReading));
    form.append('latitude', data.latitude);
    form.append('longitude', data.longitude);
    if (data.accuracy) form.append('accuracy', data.accuracy);
    appendFile(form, 'endMeter', data.endMeter, 'end_meter.jpg');

    const response = await apiClient.post<unknown>('/api/v1/agent/worklog/end', form, multipartConfig);
    return parseMutationResponse('end', response.data);
  },

  /** Paginated work logs of the logged-in agent. */
  async getWorklogs(params?: WorklogListParams): Promise<WorklogListResponse> {
    const response = await apiClient.get<unknown>('/api/v1/agent/worklog', {
      params: {
        startDate: params?.startDate,
        endDate: params?.endDate,
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
      },
    });
    const parsed = WorklogListSchema.safeParse(response.data);
    if (!parsed.success) {
      logger.warn('Unexpected worklog list response shape', { fields: failingPaths(parsed.error) });
      throw new AppError('INVALID_RESPONSE', 'Unexpected worklog list response');
    }
    return parsed.data;
  },

  /**
   * Work log for one date (YYYY-MM-DD). Resolves to null when no shift exists:
   * the backend answers 200 with an empty body (or 404) in that case.
   */
  async getWorklogByDate(date: string): Promise<WorklogItem | null> {
    try {
      const response = await apiClient.get<unknown>('/api/v1/agent/worklog/user', {
        params: { date },
      });
      if (response.data === '' || response.data === null || response.data === undefined) {
        return null;
      }
      const parsed = WorklogItemSchema.safeParse(response.data);
      if (!parsed.success) {
        logger.warn('Unexpected worklog response shape', { fields: failingPaths(parsed.error) });
        throw new AppError('INVALID_RESPONSE', 'Unexpected worklog response');
      }
      return parsed.data;
    } catch (error) {
      if (error instanceof AppError && error.code === 'NOT_FOUND') {
        return null;
      }
      throw error;
    }
  },
};
