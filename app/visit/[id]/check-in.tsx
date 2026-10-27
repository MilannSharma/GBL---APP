import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { CheckInAction } from '@/features/checkin';

export default function CheckInRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <Header title="Hospital Check-In" onBack={() => router.back()} />
      <CheckInAction
        visitId={id}
        onSuccess={() => router.push(`/visit/${id}/form`)}
      />
    </Screen>
  );
}
