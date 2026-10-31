import { frameRegion, MIN_FRAME_DELTA } from './frame-region';

describe('frameRegion', () => {
  it('never zooms tighter than a city block for a single point', () => {
    const region = frameRegion([{ latitude: 26.86, longitude: 75.72 }]);
    expect(region.latitudeDelta).toBe(MIN_FRAME_DELTA);
    expect(region.longitudeDelta).toBe(MIN_FRAME_DELTA);
    expect(region.longitude).toBe(75.72);
  });

  it('holds every point with margin', () => {
    const points = [
      { latitude: 26.85, longitude: 75.72 },
      { latitude: 26.95, longitude: 75.83 },
    ];
    const region = frameRegion(points);
    expect(region.latitudeDelta).toBeCloseTo(0.18, 5);
    expect(region.longitudeDelta).toBeCloseTo(0.198, 5);
    for (const point of points) {
      expect(Math.abs(point.latitude - region.latitude)).toBeLessThan(region.latitudeDelta / 2);
      expect(Math.abs(point.longitude - region.longitude)).toBeLessThan(region.longitudeDelta / 2);
    }
  });
});
