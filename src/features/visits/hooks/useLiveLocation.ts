import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { logger } from '@/core/logger';

export type LiveLocationStatus = 'loading' | 'granted' | 'denied';

export interface LiveCoordinate {
  latitude: number;
  longitude: number;
}

/**
 * Watches the agent's position while the map is open, plus a readable place name for it.
 * Never throws: a failed fix just leaves `coordinate` null so the map still works.
 */
export function useLiveLocation() {
  const [status, setStatus] = useState<LiveLocationStatus>('loading');
  const [coordinate, setCoordinate] = useState<LiveCoordinate | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    let subscription: Location.LocationSubscription | null = null;
    let lastGeocodeKey = '';

    async function start() {
      try {
        const { status: permission } = await Location.requestForegroundPermissionsAsync();
        if (!isActive) return;
        if (permission !== 'granted') {
          setStatus('denied');
          return;
        }
        setStatus('granted');
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, distanceInterval: 25, timeInterval: 10000 },
          (position) => {
            if (!isActive) return;
            const { latitude, longitude } = position.coords;
            setCoordinate({ latitude, longitude });
            // ~100 m grid so the geocoder is not hit on every small GPS jitter.
            const key = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
            if (key === lastGeocodeKey) return;
            lastGeocodeKey = key;
            Location.reverseGeocodeAsync({ latitude, longitude })
              .then(([place]) => {
                if (!isActive || !place) return;
                const area = place.district ?? place.subregion ?? place.city;
                setPlaceName([area, place.city && place.city !== area ? place.city : null].filter(Boolean).join(', ') || null);
              })
              .catch((error) => logger.warn('Reverse geocode failed on visits map', { error }));
          }
        );
      } catch (error) {
        logger.warn('Live location unavailable on visits map', { error });
        if (isActive) setStatus((current) => (current === 'loading' ? 'denied' : current));
      }
    }

    start();
    return () => {
      isActive = false;
      subscription?.remove();
    };
  }, []);

  return { status, coordinate, placeName };
}
