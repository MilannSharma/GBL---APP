import { useState } from 'react';
import * as Location from 'expo-location';
import { visitsRepo } from '@/db/repositories/visits.repo';
import { permissions } from '@/core/permissions';

export function useCheckIn(visitId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkIn = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const hasPermission = await permissions.requestLocationPermission();
      if (!hasPermission) {
        setError('Location permission is required to check in.');
        return false;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const idempotencyKey = `checkin_${visitId}_${Date.now()}`;
      await visitsRepo.checkInOptimistic(
        visitId,
        idempotencyKey,
        location.coords.latitude,
        location.coords.longitude
      );

      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Check-in failed';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkIn,
    loading,
    error,
  };
}
