import { useState } from 'react';
import { outboxRepo } from '@/db/repositories/outbox.repo';
import { VisitFormData } from '../types';

export function useVisitForm(visitId: string) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveForm = async (data: Omit<VisitFormData, 'visitId'>): Promise<boolean> => {
    setSubmitting(true);
    setError(null);

    try {
      const fullData: VisitFormData = { ...data, visitId };
      const idempotencyKey = `form_${visitId}_${Date.now()}`;

      // Save to outbox for offline-first submission
      await outboxRepo.enqueue({
        id: idempotencyKey,
        idempotency_key: idempotencyKey,
        action: 'submit_form',
        endpoint: `/visits/${visitId}/form`,
        method: 'POST',
        payload: JSON.stringify(fullData),
        next_attempt_at: new Date().toISOString(),
      });

      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save form';
      setError(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    saveForm,
    submitting,
    error,
  };
}
