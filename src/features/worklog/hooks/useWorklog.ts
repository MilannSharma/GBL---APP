import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { format } from 'date-fns';
import { worklogApi } from '../api';
import { acquireCoordinates } from '../location';
import { AppError } from '@/api/errors';
import { logger } from '@/core/logger';
import { getTodayIstDateString, msUntilNextIstMidnight } from '@/core/date';
import { t } from '@/core/i18n';
import type { VehicleType, WorklogItem } from '../types';

// Fire just after midnight so the server's date has definitely changed.
const MIDNIGHT_BUFFER_MS = 2000;

export function formatTimeFromIso(isoString?: string | null): string | undefined {
  if (!isoString) return undefined;
  const date = new Date(isoString);
  return Number.isNaN(date.getTime()) ? undefined : format(date, 'hh:mm a');
}

type ShiftFallbackKey = 'worklog.errStartFailed' | 'worklog.errEndFailed';

function toShiftErrorMessage(err: unknown, fallbackKey: ShiftFallbackKey): string {
  if (!(err instanceof AppError)) {
    return t(fallbackKey);
  }
  switch (err.code) {
    case 'LOCATION_UNAVAILABLE':
      return t(err.meta?.reason === 'denied' ? 'worklog.errLocationDenied' : 'worklog.errLocationFailed');
    case 'NETWORK_ERROR':
      return t('worklog.errNetwork');
    case 'UNAUTHORIZED':
      return t('worklog.errSession');
    case 'FORBIDDEN':
      return t('worklog.errForbidden');
    case 'VALIDATION_ERROR':
      // Server-owned business rule (e.g. already started / not started): show its message.
      return err.message || t(fallbackKey);
    default:
      return t(fallbackKey);
  }
}

export type WorklogLoadState = 'loading' | 'ready' | 'error';

/**
 * Today's shift state from the backend plus start/end actions. The server is the
 * source of truth; this hook does not touch the local day-session store.
 */
export function useWorklog() {
  const [todayWorklog, setTodayWorklog] = useState<WorklogItem | null>(null);
  const [loadState, setLoadState] = useState<WorklogLoadState>('loading');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayWorklog = useCallback(async (): Promise<WorklogItem | null> => {
    try {
      const log = await worklogApi.getWorklogByDate(getTodayIstDateString());
      setTodayWorklog(log);
      setLoadState('ready');
      return log;
    } catch (err: unknown) {
      logger.warn('Failed to fetch today worklog status', {
        error: err instanceof Error ? err.message : String(err),
      });
      setLoadState('error');
      return null;
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    worklogApi.getWorklogByDate(getTodayIstDateString()).then(
      (log) => {
        if (isCancelled) return;
        setTodayWorklog(log);
        setLoadState('ready');
      },
      (err: unknown) => {
        if (isCancelled) return;
        logger.warn('Failed to fetch today worklog status', {
          error: err instanceof Error ? err.message : String(err),
        });
        setLoadState('error');
      }
    );
    return () => {
      isCancelled = true;
    };
  }, []);

  // The shift belongs to one IST day. At midnight (or when the app returns to the
  // foreground on a new day) drop yesterday's shift and load the new day's status.
  const shownDate = useRef(getTodayIstDateString());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const scheduleNextMidnight = () => {
      clearTimeout(timer);
      timer = setTimeout(syncDay, msUntilNextIstMidnight() + MIDNIGHT_BUFFER_MS);
    };

    function syncDay() {
      const today = getTodayIstDateString();
      if (today !== shownDate.current) {
        shownDate.current = today;
        setTodayWorklog(null);
        setLoadState('loading');
        void fetchTodayWorklog();
      }
      scheduleNextMidnight();
    }

    scheduleNextMidnight();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') syncDay();
    });
    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, [fetchTodayWorklog]);

  // A null result means the server accepted the call but the body was unreadable: re-read the truth.
  const applyMutationResult = useCallback(
    async (result: WorklogItem | null) => {
      if (result) {
        setTodayWorklog(result);
        setLoadState('ready');
      } else {
        await fetchTodayWorklog();
      }
    },
    [fetchTodayWorklog]
  );

  const handleShiftFailure = useCallback(
    (err: unknown, label: string, fallbackKey: ShiftFallbackKey) => {
      setError(toShiftErrorMessage(err, fallbackKey));
      logger.warn(
        label,
        err instanceof AppError
          ? { code: err.code, serverMessage: err.message, serverResponse: err.meta }
          : { code: 'UNKNOWN' }
      );
      // A 4xx usually means local state was stale (already started/ended): resync.
      if (err instanceof AppError && err.code === 'VALIDATION_ERROR') {
        void fetchTodayWorklog();
      }
    },
    [fetchTodayWorklog]
  );

  const startShift = useCallback(
    async (params: { initialReading: number; startMeterUri: string; vehicle?: VehicleType }) => {
      if (todayWorklog?.workStartedAt) {
        setError(t('worklog.errAlreadyStarted'));
        return false;
      }
      setSubmitting(true);
      setError(null);
      try {
        const coords = await acquireCoordinates();
        const created = await worklogApi.startWorkShift({
          initialReading: params.initialReading,
          startMeter: { uri: params.startMeterUri },
          vehicle: params.vehicle,
          ...coords,
        });
        await applyMutationResult(created);
        return true;
      } catch (err: unknown) {
        handleShiftFailure(err, 'Start shift failed', 'worklog.errStartFailed');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [todayWorklog, applyMutationResult, handleShiftFailure]
  );

  const endShift = useCallback(
    async (params: { finalReading: number; endMeterUri: string }) => {
      if (todayWorklog?.workEndedAt) {
        setError(t('worklog.errAlreadyEnded'));
        return false;
      }
      if (!todayWorklog?.workStartedAt) {
        setError(t('worklog.errNotStarted'));
        return false;
      }
      setSubmitting(true);
      setError(null);
      try {
        const coords = await acquireCoordinates();
        const updated = await worklogApi.endWorkShift({
          finalReading: params.finalReading,
          endMeter: { uri: params.endMeterUri },
          ...coords,
        });
        await applyMutationResult(updated);
        return true;
      } catch (err: unknown) {
        handleShiftFailure(err, 'End shift failed', 'worklog.errEndFailed');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [todayWorklog, applyMutationResult, handleShiftFailure]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    todayWorklog,
    loadState,
    loadError: loadState === 'error' ? t('worklog.errLoadFailed') : null,
    submitting,
    error,
    clearError,
    fetchTodayWorklog,
    startShift,
    endShift,
    isDayStarted: Boolean(todayWorklog?.workStartedAt && !todayWorklog.workEndedAt),
    isDayEnded: Boolean(todayWorklog?.workEndedAt),
    dayStartTime: formatTimeFromIso(todayWorklog?.workStartedAt),
    dayEndTime: formatTimeFromIso(todayWorklog?.workEndedAt),
  };
}
