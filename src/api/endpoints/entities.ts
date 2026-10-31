import { z } from 'zod';
import { apiClient } from '../client';
import { AppError } from '../errors';
import { failingPaths } from '../zod-paths';
import { logger } from '@/core/logger';

const AddressSchema = z.object({
  city: z.string().nullish(),
  state: z.string().nullish(),
  district: z.string().nullish(),
  pincode: z.union([z.string(), z.number()]).nullish(),
  streetAddress: z.string().nullish(),
});

export const EntitySummarySchema = z.object({
  _id: z.string(),
  name: z.string(),
  // Search only returns id + name today; backend will add these (docs/07-api/modules/visits.md).
  address: AddressSchema.nullish(),
  hospitalType: z.string().nullish(),
});

const EntitySearchSchema = z.object({
  docs: z.array(EntitySummarySchema),
  totalDocs: z.number(),
  page: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean().optional(),
});

// The list sample shows `contact` as a number while create takes a string; the app always uses string.
export const EntityContactSchema = z.object({
  _id: z.string(),
  name: z.string(),
  contact: z.union([z.string(), z.number()]).nullish(),
  email: z.string().nullish(),
  role: z.string().nullish(),
  roleDesc: z.string().nullish(),
});

export type EntitySummaryDto = z.infer<typeof EntitySummarySchema>;
export type EntityContactDto = z.infer<typeof EntityContactSchema>;
export type EntitySearchResponse = z.infer<typeof EntitySearchSchema>;

export interface CreateContactRequest {
  entityId: string;
  name: string;
  contact: string;
  role?: string;
  roleDesc?: string;
}

export interface EntitySearchParams {
  name?: string;
  page?: number;
  limit?: number;
}

function invalidResponse(what: string, error: z.ZodError): AppError {
  logger.warn(`Unexpected ${what} response shape`, { fields: failingPaths(error) });
  return new AppError('INVALID_RESPONSE', `Unexpected ${what} response`);
}

export const entitiesEndpoints = {
  /** Prefix, case-insensitive search scoped by the server to the agent's assigned states. */
  async searchEntities(params: EntitySearchParams): Promise<EntitySearchResponse> {
    const response = await apiClient.get<unknown>('/api/v1/agent/entity/search', {
      params: { name: params.name || undefined, page: params.page ?? 1, limit: params.limit ?? 10 },
    });
    const parsed = EntitySearchSchema.safeParse(response.data);
    if (!parsed.success) throw invalidResponse('entity search', parsed.error);
    return parsed.data;
  },

  /** All contacts of one entity (plain array, not paginated). */
  async getContactsByEntity(entityId: string): Promise<EntityContactDto[]> {
    const response = await apiClient.get<unknown>('/api/v1/agent/entity-contact/by-entity', {
      params: { entityId },
    });
    const parsed = z.array(EntityContactSchema).safeParse(response.data);
    if (!parsed.success) throw invalidResponse('entity contacts', parsed.error);
    return parsed.data;
  },

  /** Saves a contact on a hospital without logging a visit. `contact` stays a string (leading zeros). */
  async createContact(data: CreateContactRequest): Promise<EntityContactDto> {
    const body = {
      entityId: data.entityId,
      name: data.name.trim(),
      contact: data.contact.trim(),
      ...(data.role?.trim() ? { role: data.role.trim() } : {}),
      ...(data.roleDesc?.trim() ? { roleDesc: data.roleDesc.trim() } : {}),
    };
    const response = await apiClient.post<unknown>('/api/v1/agent/entity-contact', body);
    const parsed = EntityContactSchema.safeParse(response.data);
    if (!parsed.success) throw invalidResponse('create contact', parsed.error);
    return parsed.data;
  },
};
