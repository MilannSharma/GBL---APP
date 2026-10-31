import React, { useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VisitRedirect, hospitalHref } from '@/features/visits';
import { useSafeBack } from '@/hooks/useSafeBack';

export default function VisitRoute() {
  const router = useRouter();
  const goBack = useSafeBack('/(tabs)/visits');
  const { id } = useLocalSearchParams<{ id: string }>();

  const handleOpenHospital = useCallback(
    (href: ReturnType<typeof hospitalHref>) => router.replace(href),
    [router]
  );

  return <VisitRedirect visitId={id} onOpenHospital={handleOpenHospital} onBack={goBack} />;
}
