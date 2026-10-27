import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { LoadingView } from '@/components/LoadingView';
import { storage } from '@/core/storage';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const token = await storage.getItem(storage.keys.AUTH_TOKEN);
      if (token) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }

    const timer = setTimeout(checkAuth, 600);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Screen scrollable={false}>
      <LoadingView message="Loading Field Agent..." />
    </Screen>
  );
}
