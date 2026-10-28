import { create } from 'zustand';

export interface DaySessionState {
  isDayStarted: boolean;
  dayStartTime?: string;
  startDay: (customTime?: string) => void;
  endDay: () => void;
}

export const useDaySessionStore = create<DaySessionState>((set) => ({
  isDayStarted: false,
  dayStartTime: undefined,
  startDay: (customTime) => {
    const time =
      customTime ||
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    set({ isDayStarted: true, dayStartTime: time });
  },
  endDay: () => {
    set({ isDayStarted: false, dayStartTime: undefined });
  },
}));
