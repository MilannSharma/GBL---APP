import type { HospitalVisit } from '../types';
import { buildMapStops } from './useVisitsMap';

function visit(id: string, visitedAt: string, extra: Partial<HospitalVisit> = {}): HospitalVisit {
  return {
    id,
    hospitalName: `Hospital ${id}`,
    address: '',
    visitedAt,
    time: '',
    date: '',
    isoDate: '2026-10-31',
    status: 'visited',
    ...extra,
  };
}

describe('buildMapStops', () => {
  it('orders the day oldest first and numbers from 1', () => {
    const stops = buildMapStops(
      [visit('c', '2026-10-31T12:00:00Z'), visit('a', '2026-10-31T08:00:00Z'), visit('b', '2026-10-31T10:00:00Z')],
      []
    );
    expect(stops.map((stop) => [stop.order, stop.visit.id])).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });

  it('takes the saved location from the visit profile, not from the list row', () => {
    const [stop] = buildMapStops(
      [visit('a', '2026-10-31T08:00:00Z')],
      [visit('a', '2026-10-31T08:00:00Z', { latitude: 26.8626, longitude: 75.7223, accuracy: '10' })]
    );
    expect(stop.coordinate).toEqual({ latitude: 26.8626, longitude: 75.7223 });
  });

  it('keeps a visit without a location in the list but gives it no coordinate', () => {
    const stops = buildMapStops(
      [visit('a', '2026-10-31T08:00:00Z'), visit('b', '2026-10-31T09:00:00Z')],
      [undefined, visit('b', '2026-10-31T09:00:00Z', { latitude: 26.9, longitude: 75.8 })]
    );
    expect(stops[0].coordinate).toBeNull();
    expect(stops[1].coordinate).toEqual({ latitude: 26.9, longitude: 75.8 });
  });

  it.each([
    ['0,0', 0, 0],
    ['NaN', Number.NaN, 75.8],
    ['missing', undefined, undefined],
  ])('rejects an unusable point (%s)', (_label, latitude, longitude) => {
    const [stop] = buildMapStops(
      [visit('a', '2026-10-31T08:00:00Z')],
      [visit('a', '2026-10-31T08:00:00Z', { latitude, longitude })]
    );
    expect(stop.coordinate).toBeNull();
  });
});
