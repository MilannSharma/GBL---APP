import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateContactRequest } from '@/api';
import { HospitalContact } from '../types';
import { visitsApi } from '../api';

/** Saves a contact on a hospital page (no visit needed) and refreshes that hospital's contact list. */
export function useAddContact() {
  const queryClient = useQueryClient();

  return useMutation<HospitalContact, Error, CreateContactRequest>({
    mutationFn: (data) => visitsApi.addContact(data),
    onSuccess: (_contact, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['entityContacts', variables.entityId] });
    },
  });
}
