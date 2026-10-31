import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { HospitalDetailScreen } from '@/features/visits';
import { useSafeBack } from '@/hooks/useSafeBack';

export default function HospitalDetailRoute() {
  const goBack = useSafeBack('/(tabs)/visits');
  // The search result passes what it already knows; the server has no entity-by-id endpoint yet.
  const { id, name, city, state, hospitalType, address } = useLocalSearchParams<{
    id: string;
    name?: string;
    city?: string;
    state?: string;
    hospitalType?: string;
    address?: string;
  }>();

  return (
    <HospitalDetailScreen
      entity={{
        id,
        name: name ?? '',
        city,
        state,
        hospitalType,
        address: address || [city, state].filter(Boolean).join(', ') || undefined,
      }}
      onBack={goBack}
    />
  );
}
