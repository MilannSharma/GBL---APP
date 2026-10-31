import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { visitsApi } from '../api';
import { matchEntities } from '../entity-search';

const DIRECTORY_STALE_MS = 5 * 60 * 1000;

/**
 * Hospital search while the agent types: matches any part of the name. Uses the agent's cached
 * hospital list; only when that list is too large to load does it fall back to the server's
 * start-of-name search. Empty term -> no request.
 */
export function useEntitySearch(term: string) {
  const debounced = useDebouncedValue(term.trim());
  const hasTerm = debounced.length > 0;

  const directory = useQuery({
    queryKey: ['entityDirectory'],
    queryFn: () => visitsApi.getEntityDirectory(),
    enabled: hasTerm,
    staleTime: DIRECTORY_STALE_MS,
  });
  const needsServerSearch = hasTerm && directory.isSuccess && !directory.data.isComplete;
  const remote = useQuery({
    queryKey: ['entitySearch', debounced],
    queryFn: () => visitsApi.searchEntities(debounced),
    enabled: needsServerSearch,
  });

  const data = useMemo(() => {
    if (!hasTerm || !directory.data) return undefined;
    return directory.data.isComplete ? matchEntities(directory.data.entities, debounced) : remote.data;
  }, [hasTerm, directory.data, debounced, remote.data]);

  return {
    data,
    isError: directory.isError || remote.isError,
    // True while the typed text has not been searched yet, so "no results" is never shown early.
    isPending: term.trim() !== debounced || (hasTerm && data === undefined && !directory.isError && !remote.isError),
  };
}

/** All contacts of one entity (not paginated by the server). */
export function useEntityContacts(entityId: string | undefined) {
  return useQuery({
    queryKey: ['entityContacts', entityId],
    queryFn: () => visitsApi.getContacts(entityId as string),
    enabled: Boolean(entityId),
  });
}

/** Visits of every agent to one hospital, newest first (team-wide history). */
export function useEntityVisits(entityId: string | undefined) {
  return useQuery({
    queryKey: ['entityVisits', entityId],
    queryFn: () => visitsApi.getEntityVisits(entityId as string),
    enabled: Boolean(entityId),
  });
}

/** One visit with its contact populated (popup on the hospital page and the visits list). */
export function useVisitDetail(visitId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['visitDetail', visitId],
    queryFn: () => visitsApi.getVisit(visitId as string),
    enabled: Boolean(visitId) && enabled,
  });
}
