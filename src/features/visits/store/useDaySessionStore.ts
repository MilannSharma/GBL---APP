import { create } from 'zustand';
import { storage } from '@/core/storage';
import { getTodayIstDateString } from '@/core/date';

const STORAGE_KEY = 'gblh_day_session';

interface PersistedDaySession {
  isDayStarted: boolean;
  isDayEnded?: boolean;
  dayStartTime?: string;
  dayDate: string;
}

export interface DaySessionState {
  isDayStarted: boolean;
  /** True once today's shift was ended; a shift can run only once per day. */
  isDayEnded: boolean;
  dayStartTime?: string;
  initSession: () => Promise<void>;
  startDay: (customTime?: string) => void;
  endDay: () => void;
  /** Applies the backend worklog as the authoritative shift state. */
  applyServerShift: (shift: {
    isDayStarted: boolean;
    isDayEnded: boolean;
    dayStartTime?: string;
  }) => void;
}

function persist(session: PersistedDaySession | null): void {
  const write = session
    ? storage.setItem(STORAGE_KEY, JSON.stringify(session))
    : storage.removeItem(STORAGE_KEY);
  write.catch(() => {
    // Cache only: the next server sync restores the state.
  });
}

export const useDaySessionStore = create<DaySessionState>((set) => ({
  isDayStarted: false,
  isDayEnded: false,
  dayStartTime: undefined,

  initSession: async () => {
    try {
      const stored = await storage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Partial<PersistedDaySession>;
      // A cached "started" flag from a previous day must never gate today's visits.
      const isToday = parsed.dayDate === getTodayIstDateString();
      if (isToday && (parsed.isDayStarted || parsed.isDayEnded)) {
        set({
          isDayStarted: Boolean(parsed.isDayStarted),
          isDayEnded: Boolean(parsed.isDayEnded),
          dayStartTime: parsed.dayStartTime,
        });
      } else {
        persist(null);
      }
    } catch {
      persist(null);
    }
  },

  startDay: (customTime) => {
    const time =
      customTime ||
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    set({ isDayStarted: true, isDayEnded: false, dayStartTime: time });
    persist({ isDayStarted: true, dayStartTime: time, dayDate: getTodayIstDateString() });
  },

  endDay: () => {
    set({ isDayStarted: false, dayStartTime: undefined });
    persist(null);
  },

  applyServerShift: ({ isDayStarted, isDayEnded, dayStartTime }) => {
    set({
      isDayStarted,
      isDayEnded,
      dayStartTime: isDayStarted ? dayStartTime : undefined,
    });
    if (isDayStarted || isDayEnded) {
      persist({ isDayStarted, isDayEnded, dayStartTime, dayDate: getTodayIstDateString() });
    } else {
      persist(null);
    }
  },
}));

// Auto-initialize session from storage on module load
useDaySessionStore.getState().initSession().catch(() => {});
