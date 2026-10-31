const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Milliseconds until the next IST midnight (when the backend's "today" changes). */
export function msUntilNextIstMidnight(now: Date = new Date()): number {
  const istMs = now.getTime() + IST_OFFSET_MS;
  return DAY_MS - (istMs % DAY_MS);
}

/**
 * Today's calendar date (YYYY-MM-DD) in IST. The backend matches worklogs to
 * "today" using IST, so the device timezone must not influence this value.
 */
export function getTodayIstDateString(now: Date = new Date()): string {
  return new Date(now.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}
