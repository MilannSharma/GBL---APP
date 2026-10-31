import type { Region } from 'react-native-maps';

// Never frame tighter than about a city block, so area names and roads stay readable.
export const MIN_FRAME_DELTA = 0.015;

/** Region that holds every point with some margin; a single point gets the minimum zoom, not the maximum. */
export function frameRegion(points: { latitude: number; longitude: number }[]): Region {
  const lats = points.map((point) => point.latitude);
  const lngs = points.map((point) => point.longitude);
  const latitudeDelta = Math.max((Math.max(...lats) - Math.min(...lats)) * 1.8, MIN_FRAME_DELTA);
  const longitudeDelta = Math.max((Math.max(...lngs) - Math.min(...lngs)) * 1.8, MIN_FRAME_DELTA);
  return {
    // Centre a little north so the points sit below the header instead of under it.
    latitude: (Math.max(...lats) + Math.min(...lats)) / 2 + latitudeDelta * 0.12,
    longitude: (Math.max(...lngs) + Math.min(...lngs)) / 2,
    latitudeDelta,
    longitudeDelta,
  };
}
