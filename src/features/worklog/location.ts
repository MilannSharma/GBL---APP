import * as Location from 'expo-location';
import { AppError } from '@/api/errors';
import { permissions } from '@/core/permissions';

// A fix this tight is a real GPS lock; waiting for better only costs the agent time.
const GOOD_ACCURACY_M = 25;
const MAX_WAIT_MS = 12000;
// If the wait budget is already spent when a fix is asked for (warm-up ran long ago) and nothing
// usable has arrived, give the receiver this much more time before giving up.
const MIN_GRACE_MS = 4000;
const LAST_KNOWN_MAX_AGE_MS = 2 * 60 * 1000;
// An older fix is trusted less: 1 m of accuracy per second of age (roughly walking speed).
const AGE_PENALTY_M_PER_S = 1;
const PLACE_PART_COUNT = 3;
// Android's Geocoder may return an Open Location Code ("W7P5+4M") as the name: not a place name.
const PLUS_CODE = /^[A-Z0-9]{4,}\+[A-Z0-9]*$/i;

export interface ShiftCoordinates {
  latitude: string;
  longitude: string;
  accuracy?: string;
}

export interface LocationTracker {
  /**
   * The best fix so far. Resolves as soon as a fix is accurate enough; otherwise when the wait
   * budget ends with the best one seen. Rejects with LOCATION_UNAVAILABLE when there is none.
   */
  getFix(): Promise<ShiftCoordinates>;
  stop(): void;
}

function rank(position: Location.LocationObject): number {
  const ageSeconds = Math.max(0, Date.now() - position.timestamp) / 1000;
  return (position.coords.accuracy ?? Number.POSITIVE_INFINITY) + ageSeconds * AGE_PENALTY_M_PER_S;
}

function isGood(position: Location.LocationObject): boolean {
  return rank(position) <= GOOD_ACCURACY_M;
}

function toCoordinates(position: Location.LocationObject): ShiftCoordinates {
  const { latitude, longitude, accuracy } = position.coords;
  return {
    latitude: String(latitude),
    longitude: String(longitude),
    accuracy: accuracy !== null && accuracy !== undefined ? String(accuracy) : undefined,
  };
}

/**
 * Starts listening to the GPS right away (high accuracy) and keeps the best fix, so a later
 * `getFix()` is usually instant. The permission prompt is part of starting. Call `stop()` to
 * release the receiver.
 */
export function startLocationTracker(): LocationTracker {
  const startedAt = Date.now();
  const listeners = new Set<() => void>();
  let best: Location.LocationObject | null = null;
  let failure: AppError | null = null;
  let subscription: Location.LocationSubscription | null = null;
  let isStopped = false;

  const notify = () => listeners.forEach((listener) => listener());

  const consider = (position: Location.LocationObject) => {
    if (!best || rank(position) < rank(best)) {
      best = position;
      notify();
    }
  };

  void (async () => {
    const granted = await permissions.requestLocationPermission();
    if (!granted) {
      failure = new AppError('LOCATION_UNAVAILABLE', 'Location permission denied', { reason: 'denied' });
      return;
    }
    // A recent cached fix makes the first answer instant; fresher fixes replace it as they arrive.
    const cached = await Location.getLastKnownPositionAsync({ maxAge: LAST_KNOWN_MAX_AGE_MS }).catch(() => null);
    if (cached) consider(cached);
    if (isStopped) return;
    const watching = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 0 },
      consider
    );
    if (isStopped) watching.remove();
    else subscription = watching;
  })()
    .catch(() => {
      failure = new AppError('LOCATION_UNAVAILABLE', 'No GPS fix available', { reason: 'no-fix' });
    })
    .finally(notify);

  return {
    getFix: () =>
      new Promise<ShiftCoordinates>((resolve, reject) => {
        let timer: ReturnType<typeof setTimeout> | undefined;

        const settle = (isDeadline: boolean): boolean => {
          const fix = best;
          if (fix && (isGood(fix) || isDeadline || failure)) {
            resolve(toCoordinates(fix));
          } else if (failure || isDeadline) {
            reject(failure ?? new AppError('LOCATION_UNAVAILABLE', 'No GPS fix available', { reason: 'no-fix' }));
          } else {
            return false;
          }
          clearTimeout(timer);
          listeners.delete(onChange);
          return true;
        };
        const onChange = () => {
          settle(false);
        };

        if (settle(false)) return;
        listeners.add(onChange);
        const remaining = Math.max(startedAt + MAX_WAIT_MS - Date.now(), MIN_GRACE_MS);
        timer = setTimeout(() => settle(true), remaining);
      }),
    stop: () => {
      isStopped = true;
      subscription?.remove();
      subscription = null;
    },
  };
}

/**
 * One accurate GPS fix for a shift call: listens until the fix is good (or the wait budget ends)
 * and then releases the receiver. Throws LOCATION_UNAVAILABLE when there is no usable fix.
 */
export async function acquireCoordinates(): Promise<ShiftCoordinates> {
  const tracker = startLocationTracker();
  try {
    return await tracker.getFix();
  } finally {
    tracker.stop();
  }
}

/**
 * Human-readable place for a coordinate, e.g. "Civil Lines, Jaipur, Rajasthan". Null when the
 * device cannot reverse-geocode it; callers then fall back to a plain "open in maps" label.
 */
export async function describePlace(latitude: number, longitude: number): Promise<string | null> {
  const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
  if (!place) return null;

  const street = place.street ?? (place.name && !PLUS_CODE.test(place.name) ? place.name : null);
  const parts = [street, place.district, place.city ?? place.subregion, place.region].filter(
    (part): part is string => Boolean(part && part.trim())
  );
  const unique = parts.filter((part, index) => parts.indexOf(part) === index);
  return unique.slice(0, PLACE_PART_COUNT).join(', ') || null;
}
