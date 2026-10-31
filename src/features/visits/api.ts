import {
  entitiesEndpoints,
  visitsEndpoints,
  CreateContactRequest,
  CreateVisitRequest,
  CreateVisitResult,
  VisitListParams,
} from '@/api';
import { toHospitalContact, toHospitalEntity, toHospitalVisit } from './mappers';
import { HospitalContact, HospitalEntity, HospitalVisit } from './types';

// The server only matches the start of a name, so the agent's hospitals are loaded once and matched
// on the phone. Beyond this many, the directory is incomplete and the server search is used instead.
const DIRECTORY_PAGE_SIZE = 200;
const DIRECTORY_MAX_ENTITIES = 1000;

export interface EntityDirectory {
  entities: HospitalEntity[];
  /** False when the agent has more hospitals than were loaded. */
  isComplete: boolean;
}

export const visitsApi = {
  async getVisits(params: VisitListParams): Promise<HospitalVisit[]> {
    const result = await visitsEndpoints.getVisits(params);
    return result.docs.map(toHospitalVisit);
  },

  async getEntityVisits(entityId: string): Promise<HospitalVisit[]> {
    const result = await visitsEndpoints.getVisitsForEntity({ entityId, limit: 50 });
    return result.docs.map(toHospitalVisit);
  },

  async addContact(data: CreateContactRequest): Promise<HospitalContact> {
    return toHospitalContact(await entitiesEndpoints.createContact(data));
  },

  async getVisit(id: string): Promise<HospitalVisit> {
    return toHospitalVisit(await visitsEndpoints.getVisit(id));
  },

  createVisit(data: CreateVisitRequest): Promise<CreateVisitResult> {
    return visitsEndpoints.createVisitWithEntity(data);
  },

  async searchEntities(name: string): Promise<HospitalEntity[]> {
    const result = await entitiesEndpoints.searchEntities({ name, limit: 10 });
    return result.docs.map(toHospitalEntity);
  },

  async getEntityDirectory(): Promise<EntityDirectory> {
    const entities: HospitalEntity[] = [];
    for (let page = 1; entities.length < DIRECTORY_MAX_ENTITIES; page += 1) {
      const result = await entitiesEndpoints.searchEntities({ page, limit: DIRECTORY_PAGE_SIZE });
      entities.push(...result.docs.map(toHospitalEntity));
      if (page >= result.totalPages) return { entities, isComplete: true };
    }
    return { entities, isComplete: false };
  },

  async getContacts(entityId: string): Promise<HospitalContact[]> {
    const contacts = await entitiesEndpoints.getContactsByEntity(entityId);
    return contacts.map(toHospitalContact);
  },
};
