import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { VisitFormComponent } from '@/features/visit-form';

export default function FormRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <Header title="Visit Form" onBack={() => router.back()} />
      <VisitFormComponent
        visitId={id}
        onSuccess={() => router.push(`/visit/${id}/photos`)}
      />
    </Screen>
  );
}
