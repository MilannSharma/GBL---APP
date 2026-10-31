import { useCallback, useState } from 'react';
import { AppError, CreateVisitRequest } from '@/api';
import { logger } from '@/core/logger';
import { t } from '@/core/i18n';
import { HospitalContact, HospitalEntity } from '../types';
import { useCreateVisit } from './useCreateVisit';
import { useLocationWarmup } from './useLocationWarmup';
import { useSelfie } from './useSelfie';

const MIN_PHONE_DIGITS = 7;

export interface ContactFields {
  name: string;
  phone: string;
  role: string;
}

const EMPTY_CONTACT: ContactFields = { name: '', phone: '', role: '' };

function toFailureMessage(err: unknown): string {
  if (err instanceof AppError) {
    switch (err.code) {
      case 'LOCATION_UNAVAILABLE':
        return t(err.meta?.reason === 'denied' ? 'visits.add.errLocationDenied' : 'visits.add.errLocation');
      case 'NETWORK_ERROR':
        return t('visits.add.errNetwork');
      case 'UNAUTHORIZED':
        return t('visits.add.errSession');
      case 'FORBIDDEN':
        return t('visits.add.errForbidden');
      case 'SERVER_ERROR':
        return t('visits.add.errServer');
      case 'INVALID_RESPONSE':
        return t('visits.add.errUnreadable');
      case 'VALIDATION_ERROR':
        // Server-owned rules (missing entity, contact not in entity, ...) carry a readable message.
        return err.message || t('visits.add.errFailed');
      default:
        break;
    }
  }
  return t('visits.add.errFailed');
}

/**
 * Form state of the Add Visit sheet. Every field is a plain text field; picking a
 * suggestion only links the typed value to an existing record, and editing the
 * text again unlinks it (it then counts as new). While `isOpen`, the GPS is already
 * warming up so Save does not have to wait for a location.
 */
export function useCreateVisitForm(isOpen: boolean) {
  const createVisit = useCreateVisit();
  const selfie = useSelfie();
  const gps = useLocationWarmup(isOpen);
  const { reset: resetSelfie } = selfie;
  const { reset: resetMutation } = createVisit;

  const [hospitalName, setHospitalNameState] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<HospitalEntity | null>(null);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [contact, setContactState] = useState<ContactFields>(EMPTY_CONTACT);
  const [selectedContact, setSelectedContact] = useState<HospitalContact | null>(null);
  const [remark, setRemark] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(
    (initialName = '') => {
      setHospitalNameState(initialName);
      setSelectedEntity(null);
      setCity('');
      setState('');
      setContactState(EMPTY_CONTACT);
      setSelectedContact(null);
      setRemark('');
      setError(null);
      resetSelfie();
      resetMutation();
    },
    [resetSelfie, resetMutation]
  );

  const setHospitalName = useCallback((value: string) => {
    setHospitalNameState(value);
    // Typing again means "not that hospital any more"; its contacts no longer apply either.
    setSelectedEntity(null);
    setSelectedContact(null);
  }, []);

  const pickEntity = useCallback((entity: HospitalEntity) => {
    setHospitalNameState(entity.name);
    setSelectedEntity(entity);
    setSelectedContact(null);
  }, []);

  const setContact = useCallback((next: ContactFields) => {
    setContactState(next);
    setSelectedContact(null);
  }, []);

  const pickContact = useCallback((picked: HospitalContact) => {
    setContactState({ name: picked.name, phone: picked.phone ?? '', role: picked.role ?? '' });
    setSelectedContact(picked);
  }, []);

  const validate = (): string | null => {
    if (!hospitalName.trim()) return t('visits.add.errHospital');
    if (!selectedContact) {
      if (!contact.name.trim() || !contact.phone.trim()) return t('visits.add.errContact');
      if (contact.phone.replace(/\D/g, '').length < MIN_PHONE_DIGITS) return t('visits.add.errPhone');
    }
    if (!selfie.selfieUri) return t('visits.add.errSelfie');
    return null;
  };

  /** Resolves to `{ hasSelfie }` on success, or null when validation/network failed (error is set). */
  const submit = async (): Promise<{ hasSelfie: boolean } | null> => {
    const invalid = validate();
    if (invalid || !selfie.selfieUri) {
      setError(invalid);
      return null;
    }

    setError(null);
    try {
      const coords = await gps.getFix();
      const request: CreateVisitRequest = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        selfie: { uri: selfie.selfieUri, name: 'selfie.jpg', type: 'image/jpeg' },
        remark,
        ...(selectedEntity
          ? { entityId: selectedEntity.id }
          : { entity: { name: hospitalName.trim(), city, state } }),
        ...(selectedContact
          ? { entityContactId: selectedContact.id }
          : { entityContact: { name: contact.name.trim(), contact: contact.phone.trim(), role: contact.role } }),
      };
      const result = await createVisit.mutateAsync(request);
      return { hasSelfie: result.hasSelfie };
    } catch (err: unknown) {
      logger.warn('Create visit failed', { code: err instanceof AppError ? err.code : 'UNKNOWN' });
      setError(toFailureMessage(err));
      return null;
    }
  };

  return {
    hospitalName,
    setHospitalName,
    selectedEntity,
    pickEntity,
    city,
    setCity,
    state,
    setState,
    contact,
    setContact,
    selectedContact,
    pickContact,
    remark,
    setRemark,
    selfie,
    gps,
    error: error ?? selfie.error,
    isSubmitting: createVisit.isPending,
    submit,
    reset,
  };
}
