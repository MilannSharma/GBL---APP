import { z } from 'zod';
import { apiClient } from '../client';
import { AppError } from '../errors';
import { failingPaths } from '../zod-paths';
import { appendFile, multipartConfig, UploadFile } from '../multipart';
import { logger } from '@/core/logger';
import { EntityContactSchema, EntitySummarySchema } from './entities';

const UserRefSchema = z.object({
  _id: z.string(),
  name: z.string().nullish(),
  code: z.string().nullish(),
});

// Populated refs fall back to a bare id string when the referenced document is gone.
const ref = <T extends z.ZodTypeAny>(schema: T) => z.union([schema, z.string()]).nullish();

export const VisitSchema = z.object({
  _id: z.string(),
  visitedAt: z.string(),
  remark: z.string().nullish(),
  // A bare id in the list response, a populated object in the profile response.
  location: z
    .union([
      z.string(),
      z.object({
        // GeoJSON order: [longitude, latitude]
        location: z.object({ coordinates: z.array(z.number()) }).nullish(),
        accuracy: z.union([z.string(), z.number()]).nullish(),
      }),
    ])
    .nullish(),
  selfie: z.object({ url: z.string() }).nullish(),
  userId: ref(UserRefSchema),
  entityId: ref(EntitySummarySchema),
  entityContactId: ref(EntityContactSchema),
});

const VisitListSchema = z.object({
  docs: z.array(VisitSchema),
  totalDocs: z.number(),
  page: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean().optional(),
});

const CreateVisitResponseSchema = z.object({
  visit: z.object({ _id: z.string(), selfie: z.object({ url: z.string() }).nullish() }),
});

export type VisitDto = z.infer<typeof VisitSchema>;
export type VisitListResponse = z.infer<typeof VisitListSchema>;

export interface VisitListParams {
  entityId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface NewEntityInput {
  name: string;
  hospitalType?: string;
  city?: string;
  state?: string;
}

export interface NewContactInput {
  name: string;
  contact: string;
  role?: string;
}

/** Exactly one of `entityId`/`entity` and one of `entityContactId`/`entityContact` (server rule). */
export interface CreateVisitRequest {
  entityId?: string;
  entity?: NewEntityInput;
  entityContactId?: string;
  entityContact?: NewContactInput;
  latitude: string;
  longitude: string;
  accuracy?: string;
  selfie: UploadFile;
  remark?: string;
  worklogId?: string;
}

export interface CreateVisitResult {
  visitId: string;
  /** False when the server saved the visit but the selfie upload to storage failed. */
  hasSelfie: boolean;
}

function validationError(message: string): AppError {
  return new AppError('VALIDATION_ERROR', message);
}

/**
 * Mirrors the server's pre-write checks so obvious mistakes never leave the device.
 * `entity`, `entityContact` and `location` are objects sent as JSON-stringified text fields
 * (verified on the dev server on 31 Oct; bracket notation is still accepted as a fallback).
 */
export function buildCreateVisitForm(data: CreateVisitRequest): FormData {
  if (Boolean(data.entityId) === Boolean(data.entity)) {
    throw validationError('Send either entityId or entity');
  }
  if (Boolean(data.entityContactId) === Boolean(data.entityContact)) {
    throw validationError('Send either entityContactId or entityContact');
  }

  const form = new FormData();
  const addText = (field: string, value: string | undefined) => {
    if (value !== undefined && value.trim() !== '') form.append(field, value.trim());
  };
  const filled = (value: Record<string, string | undefined>): Record<string, string> => {
    const out: Record<string, string> = {};
    for (const [key, item] of Object.entries(value)) {
      if (item && item.trim()) out[key] = item.trim();
    }
    return out;
  };

  addText('entityId', data.entityId);
  if (data.entity) {
    const { name, hospitalType, city, state } = data.entity;
    // The backend stores states in capitals (e.g. RAJASTHAN).
    const address = filled({ city, state: state?.toUpperCase() });
    form.append(
      'entity',
      JSON.stringify({
        ...filled({ name, hospitalType }),
        ...(Object.keys(address).length ? { address } : {}),
      })
    );
  }
  addText('entityContactId', data.entityContactId);
  if (data.entityContact) {
    form.append('entityContact', JSON.stringify(filled({ ...data.entityContact })));
  }
  form.append(
    'location',
    JSON.stringify(filled({ latitude: data.latitude, longitude: data.longitude, accuracy: data.accuracy }))
  );
  addText('remark', data.remark);
  addText('worklogId', data.worklogId);
  appendFile(form, 'selfie', data.selfie, 'selfie.jpg');
  return form;
}

export const visitsEndpoints = {
  /**
   * Creates entity (if new) + contact (if new) + visit in one server transaction.
   * Sending the same payload again within ~2 minutes returns the original visit (no duplicates).
   */
  async createVisitWithEntity(data: CreateVisitRequest): Promise<CreateVisitResult> {
    const form = buildCreateVisitForm(data);
    const response = await apiClient.post<unknown>('/api/v1/agent/visit/with-entity', form, multipartConfig);
    const parsed = CreateVisitResponseSchema.safeParse(response.data);
    if (!parsed.success) {
      // Saved server-side already; surface a typed error instead of pretending it failed.
      logger.warn('Unexpected create-visit response shape', { fields: failingPaths(parsed.error) });
      throw new AppError('INVALID_RESPONSE', 'Visit saved but the response could not be read');
    }
    return { visitId: parsed.data.visit._id, hasSelfie: Boolean(parsed.data.visit.selfie) };
  },

  /** The logged-in agent's own visits, newest first. */
  async getVisits(params: VisitListParams = {}): Promise<VisitListResponse> {
    const response = await apiClient.get<unknown>('/api/v1/agent/visit', {
      params: { ...params, page: params.page ?? 1, limit: params.limit ?? 10 },
    });
    const parsed = VisitListSchema.safeParse(response.data);
    if (!parsed.success) {
      logger.warn('Unexpected visit list response shape', { fields: failingPaths(parsed.error) });
      throw new AppError('INVALID_RESPONSE', 'Unexpected visit list response');
    }
    logger.info('Visits fetched', { count: parsed.data.docs.length, total: parsed.data.totalDocs });
    return parsed.data;
  },

  /** Team-wide visit history of one hospital: visits by any agent, newest first. */
  async getVisitsForEntity(params: { entityId: string; page?: number; limit?: number }): Promise<VisitListResponse> {
    const response = await apiClient.get<unknown>('/api/v1/agent/visit/for-entity', {
      params: { entityId: params.entityId, page: params.page ?? 1, limit: params.limit ?? 10 },
    });
    const parsed = VisitListSchema.safeParse(response.data);
    if (!parsed.success) {
      logger.warn('Unexpected entity visits response shape', { fields: failingPaths(parsed.error) });
      throw new AppError('INVALID_RESPONSE', 'Unexpected entity visits response');
    }
    return parsed.data;
  },

  async getVisit(id: string): Promise<VisitDto> {
    const response = await apiClient.get<unknown>('/api/v1/agent/visit/profile', { params: { id } });
    const parsed = VisitSchema.safeParse(response.data);
    if (!parsed.success) {
      logger.warn('Unexpected visit response shape', { fields: failingPaths(parsed.error) });
      throw new AppError('INVALID_RESPONSE', 'Unexpected visit response');
    }
    return parsed.data;
  },
};
