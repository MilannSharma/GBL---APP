import { useCallback } from 'react';
import { useRouter } from 'expo-router';

type Fallback = Parameters<ReturnType<typeof useRouter>['replace']>[0];

/**
 * Goes back when there is a screen to go back to; otherwise (deep link, replaced route, first
 * screen after a restart) goes to `fallback` so the back button never does nothing.
 */
export function useSafeBack(fallback: Fallback) {
  const router = useRouter();
  return useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallback);
    }
  }, [router, fallback]);
}
