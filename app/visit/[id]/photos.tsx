import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { PhotoCapture } from '@/features/media';
import { spacing } from '@/core/theme/spacing';

export default function PhotosRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <Header title="Capture Photos" onBack={() => router.back()} />
      <PhotoCapture />
      <Button
        title="Proceed to Signature"
        onPress={() => router.push(`/visit/${id}/signature`)}
        style={{ marginTop: spacing.xl }}
      />
    </Screen>
  );
}
