import { HospitalEntity, HospitalVisit } from './types';

/** Route of the hospital page. It gets what the caller already knows; the server has no entity-by-id endpoint. */
export function hospitalHref(entity: HospitalEntity) {
  return {
    pathname: '/hospital/[id]' as const,
    params: {
      id: entity.id,
      name: entity.name,
      city: entity.city ?? '',
      state: entity.state ?? '',
      hospitalType: entity.hospitalType ?? '',
      address: entity.address ?? '',
    },
  };
}

/** The hospital a visit belongs to, or null when the visit carries no hospital id. */
export function hospitalOfVisit(visit: HospitalVisit): HospitalEntity | null {
  if (!visit.entityId) return null;
  return {
    id: visit.entityId,
    name: visit.hospitalName,
    city: visit.city,
    state: visit.state,
    hospitalType: visit.hospitalType,
    address: visit.address || undefined,
  };
}
