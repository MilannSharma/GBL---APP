import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { visitsApi } from '../api';
import { HospitalVisit } from '../types';
import { useHospitalVisits } from './useHospitalVisits';

export interface MapStop {
  /** 1-based position on today's timeline, first visit added = 1. */
  order: number;
  visit: HospitalVisit;
  coordinate: { latitude: number; longitude: number } | null;
}

function toCoordinate(visit: HospitalVisit): MapStop['coordinate'] {
  const { latitude, longitude } = visit;
  const isValid =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    !(latitude === 0 && longitude === 0);
  return isValid ? { latitude, longitude } : null;
}

/**
 * Today's visits as a chronological timeline for the Visits Map: oldest first, so the route
 * runs from the first hospital added to the last.
 *
 * The visit list returns the saved GPS point as a bare id, only the profile endpoint populates
 * it, so each visit's profile is read for its coordinates. A visit whose profile has no point
 * stays in `stops` (for the list) with a null coordinate and is skipped by the route.
 */
export function useVisitsMap() {
  const { visits, visitedCount, totalCount, isLoading, isError, refetch } = useHospitalVisits();

  const profiles = useQueries({
    queries: visits.map((visit) => ({
      queryKey: ['visitProfile', visit.id],
      queryFn: () => visitsApi.getVisit(visit.id),
      // A saved GPS point never changes.
      staleTime: Infinity,
    })),
  });
  const profileKey = profiles.map((query) => query.dataUpdatedAt).join('|');
  const isLoadingLocations = profiles.some((query) => query.isLoading);

  const profileData = profiles.map((query) => query.data);
  const stops = useMemo<MapStop[]>(
    () => buildMapStops(visits, profileData),
    // profileKey changes whenever any profile resolves; `profileData` is a new array every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visits, profileKey]
  );

  const routeStops = useMemo(() => stops.filter((stop) => stop.coordinate !== null), [stops]);

  return {
    stops,
    routeStops,
    missingCoordinateCount: isLoadingLocations ? 0 : stops.length - routeStops.length,
    visitedCount,
    totalCount,
    isLoading,
    isError,
    refetch,
  };
}

function pickLocation(profile: HospitalVisit): Pick<HospitalVisit, 'latitude' | 'longitude' | 'accuracy'> {
  return { latitude: profile.latitude, longitude: profile.longitude, accuracy: profile.accuracy };
}

/**
 * Oldest visit first, numbered from 1. `profiles[i]` is the visit profile of `visits[i]` (or
 * undefined while it loads); only its saved GPS point is taken from it.
 */
export function buildMapStops(visits: HospitalVisit[], profiles: (HospitalVisit | undefined)[]): MapStop[] {
  return visits
    .map((visit, index) => {
      const profile = profiles[index];
      return profile ? { ...visit, ...pickLocation(profile) } : visit;
    })
    .sort((a, b) => a.visitedAt.localeCompare(b.visitedAt))
    .map((visit, index) => ({ order: index + 1, visit, coordinate: toCoordinate(visit) }));
}
