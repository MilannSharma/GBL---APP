import React from 'react';
import { Stack } from 'expo-router';
import { AppProviders } from '@/core/providers';

export default function RootLayout() {
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
        <Stack.Screen name="sync" />
        <Stack.Screen name="system/update" />
      </Stack>
    </AppProviders>
  );
}
