import { useCallback, useEffect, useState } from 'react';
import { AppError } from '@/api/errors';
import { t } from '@/core/i18n';
import { acquireCoordinates } from '../location';

export type ShiftLocationStatus = 'locating' | 'ready' | 'denied' | 'failed';

/** Pre-flight GPS check shown in the shift modals while they are open. */
export function useShiftLocation(isActive: boolean) {
  const [status, setStatus] = useState<ShiftLocationStatus>('locating');
  const [label, setLabel] = useState<string>(t('worklog.gpsLocating'));

  const [attempt, setAttempt] = useState(0);

  // Opening the sheet or pressing retry starts a fresh lookup, shown as "locating" right away.
  const [lookupKey, setLookupKey] = useState({ isActive, attempt });
  if (lookupKey.isActive !== isActive || lookupKey.attempt !== attempt) {
    setLookupKey({ isActive, attempt });
    if (isActive) {
      setStatus('locating');
      setLabel(t('worklog.gpsLocating'));
    }
  }

  useEffect(() => {
    if (!isActive) return undefined;
    let isCancelled = false;
    acquireCoordinates().then(
      (coords) => {
        if (isCancelled) return;
        setStatus('ready');
        setLabel(
          t('worklog.gpsReady')
            .replace('{lat}', Number(coords.latitude).toFixed(4))
            .replace('{lng}', Number(coords.longitude).toFixed(4))
        );
      },
      (err: unknown) => {
        if (isCancelled) return;
        const isDenied = err instanceof AppError && err.meta?.reason === 'denied';
        setStatus(isDenied ? 'denied' : 'failed');
        setLabel(t(isDenied ? 'worklog.gpsDenied' : 'worklog.gpsFailed'));
      }
    );
    return () => {
      isCancelled = true;
    };
  }, [isActive, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  return { status, label, retry };
}
