import { format } from 'date-fns';
import type { EntityContactDto, EntitySummaryDto, VisitDto } from '@/api';
import { normalizeState } from './constants/indian-states';
import { HospitalContact, HospitalEntity, HospitalVisit } from './types';

type Populated<T> = Exclude<T, string | null | undefined>;

/** Populated refs can come back as a bare id when the referenced document no longer exists. */
function populated<T>(value: T): Populated<T> | undefined {
  return value && typeof value === 'object' ? (value as Populated<T>) : undefined;
}

type AddressDto = EntitySummaryDto['address'];

/** "Civil Lines, Chomu, Jaipur, RAJASTHAN - 226001" from whichever parts the server has. */
function formatAddress(address: AddressDto): string {
  const place = joinParts(address?.streetAddress, address?.city, address?.district, normalizeState(address?.state));
  const pincode = address?.pincode != null ? String(address.pincode).trim() : '';
  return pincode ? `${place} - ${pincode}` : place;
}

function joinParts(...parts: Array<string | null | undefined>): string {
  return parts.filter((part): part is string => Boolean(part && part.trim())).join(', ');
}

export function toHospitalEntity(dto: EntitySummaryDto): HospitalEntity {
  return {
    id: dto._id,
    name: dto.name,
    city: dto.address?.city ?? undefined,
    state: normalizeState(dto.address?.state),
    hospitalType: dto.hospitalType ?? undefined,
    address: formatAddress(dto.address) || undefined,
  };
}

export function toHospitalContact(dto: EntityContactDto): HospitalContact {
  return {
    id: dto._id,
    name: dto.name,
    phone: dto.contact != null ? String(dto.contact) : undefined,
    email: dto.email ?? undefined,
    role: dto.role ?? undefined,
    roleDesc: dto.roleDesc ?? undefined,
  };
}

export function toHospitalVisit(dto: VisitDto): HospitalVisit {
  const entity = populated(dto.entityId);
  const contact = populated(dto.entityContactId);
  const agent = populated(dto.userId);
  const visitedAt = new Date(dto.visitedAt);
  // GeoJSON stores [longitude, latitude].
  const position = populated(dto.location);
  const [longitude, latitude] = position?.location?.coordinates ?? [];
  const city = entity?.address?.city ?? undefined;
  const state = normalizeState(entity?.address?.state);
  const contactName = contact?.name;
  const contactRole = contact?.role ?? undefined;

  return {
    id: dto._id,
    entityId: entity?._id ?? (typeof dto.entityId === 'string' ? dto.entityId : undefined),
    hospitalName: entity?.name ?? '',
    address: formatAddress(entity?.address),
    city,
    state,
    hospitalType: entity?.hospitalType ?? undefined,
    visitedAt: visitedAt.toISOString(),
    time: format(visitedAt, 'hh:mm a'),
    date: format(visitedAt, 'dd MMM yyyy'),
    isoDate: format(visitedAt, 'yyyy-MM-dd'),
    status: 'visited',
    latitude,
    longitude,
    accuracy: position?.accuracy != null ? String(position.accuracy) : undefined,
    agentId: agent?._id ?? (typeof dto.userId === 'string' ? dto.userId : undefined),
    agentName: agent?.name ?? undefined,
    contactName,
    contactPhone: contact?.contact != null ? String(contact.contact) : undefined,
    contactRole,
    contactRoleDesc: contact?.roleDesc ?? undefined,
    remark: dto.remark ?? undefined,
    selfieUrl: dto.selfie?.url,
    doctorName: contactName,
    department: contactRole,
    notes: dto.remark ?? undefined,
  };
}
