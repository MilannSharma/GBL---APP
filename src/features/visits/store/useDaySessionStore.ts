import { create } from 'zustand';
import { storage } from '@/core/storage';

const STORAGE_KEY = 'gblh_day_session';

export interface DaySessionState {
  isDayStarted: boolean;
  dayStartTime?: string;
  initSession: () => Promise<void>;
  startDay: (customTime?: string) => void;
  endDay: () => void;
}

export const useDaySessionStore = create<DaySessionState>((set) => ({
  isDayStarted: false,
  dayStartTime: undefined,

  initSession: async () => {
    try {
      const stored = await storage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.isDayStarted) {
          set({ isDayStarted: true, dayStartTime: parsed.dayStartTime });
        }
      }
    } catch {
      // Safe fallback
    }
  },

  startDay: (customTime) => {
    const time =
      customTime ||
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    set({ isDayStarted: true, dayStartTime: time });
    storage.setItem(STORAGE_KEY, JSON.stringify({ isDayStarted: true, dayStartTime: time })).catch(() => {});
  },

  endDay: () => {
    set({ isDayStarted: false, dayStartTime: undefined });
    storage.removeItem(STORAGE_KEY).catch(() => {});
  },
}));

// Auto-initialize session from storage on module load
useDaySessionStore.getState().initSession().catch(() => {});
