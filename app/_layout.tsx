import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { AppProviders } from '@/core/providers';
import { setUnauthorizedHandler } from '@/api/session';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    setUnauthorizedHandler(() => router.replace('/(auth)/login'));
    return () => setUnauthorizedHandler(null);
  }, [router]);

  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="visit/[id]" />
        <Stack.Screen name="hospital/[id]" />
        <Stack.Screen name="history/[id]" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="system/update" />
      </Stack>
    </AppProviders>
  );
}
