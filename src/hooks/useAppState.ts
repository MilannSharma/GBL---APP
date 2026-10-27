import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState(): AppStateStatus {
  const [appState, setAppState] = useState<AppStateStatus>((AppState.currentState as AppStateStatus) ?? 'active');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return appState;
}
