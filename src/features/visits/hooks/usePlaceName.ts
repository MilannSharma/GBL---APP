import { useQuery } from '@tanstack/react-query';
import { describePlace } from '@/features/worklog';

// Four decimals is about 11 m: visits at the same hospital share one lookup.
const COORDINATE_DECIMALS = 4;

/** Place name of a visit's coordinates. A failed lookup is not retried: the UI falls back to the map link. */
export function usePlaceName(latitude: number, longitude: number) {
  return useQuery({
    queryKey: ['placeName', latitude.toFixed(COORDINATE_DECIMALS), longitude.toFixed(COORDINATE_DECIMALS)],
    queryFn: () => describePlace(latitude, longitude),
    staleTime: Infinity,
    retry: false,
  });
}
