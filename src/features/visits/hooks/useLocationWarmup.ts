import { useCallback, useEffect, useRef, useState } from 'react';
import { acquireCoordinates, startLocationTracker, LocationTracker, ShiftCoordinates } from '@/features/worklog';

export type LocationWarmupStatus = 'idle' | 'locating' | 'ready' | 'failed';

/**
 * Starts the GPS the moment `isActive` turns true (the Add Visit sheet opens), so the fix is
 * already there when the agent presses Save. `getFix` hands over the best fix without waiting
 * when one is ready.
 */
export function useLocationWarmup(isActive: boolean) {
  const trackerRef = useRef<LocationTracker | null>(null);
  const [status, setStatus] = useState<LocationWarmupStatus>('idle');
  const [attempt, setAttempt] = useState(0);

  // Opening or closing the sheet resets the status right away, not one render later.
  const [wasActive, setWasActive] = useState(isActive);
  if (isActive !== wasActive) {
    setWasActive(isActive);
    setStatus(isActive ? 'locating' : 'idle');
  }

  useEffect(() => {
    if (!isActive) return undefined;
    let isCancelled = false;
    const tracker = startLocationTracker();
    trackerRef.current = tracker;
    tracker.getFix().then(
      () => {
        if (!isCancelled) setStatus('ready');
      },
      () => {
        if (!isCancelled) setStatus('failed');
      }
    );
    return () => {
      isCancelled = true;
      tracker.stop();
      trackerRef.current = null;
    };
  }, [isActive, attempt]);

  const getFix = useCallback(
    (): Promise<ShiftCoordinates> => (trackerRef.current ? trackerRef.current.getFix() : acquireCoordinates()),
    []
  );
  const retry = useCallback(() => {
    setStatus('locating');
    setAttempt((count) => count + 1);
  }, []);

  return { status, getFix, retry };
}
