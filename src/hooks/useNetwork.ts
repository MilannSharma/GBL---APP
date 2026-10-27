import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
}

export function useNetwork(): NetworkState {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isInternetReachable: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function checkNetwork() {
      try {
        const state = await Network.getNetworkStateAsync();
        if (isMounted) {
          setNetworkState({
            isConnected: state.isConnected ?? true,
            isInternetReachable: state.isInternetReachable ?? true,
          });
        }
      } catch {
        // Fallback to assuming connected
      }
    }

    checkNetwork();
    const interval = setInterval(checkNetwork, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return networkState;
}
