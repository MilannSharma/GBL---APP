import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visitsApi } from '../api';
import { HospitalVisit } from '../types';
import { useDaySessionStore } from '../store/useDaySessionStore';

export function useHospitalVisits() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string>('24 Nov 2025');
  const [statusFilter, setStatusFilter] = useState<'all' | 'visited' | 'not_visited'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'name' | 'status'>('time');

  // Shared day session state from Zustand
  const { isDayStarted, dayStartTime, startDay, endDay } = useDaySessionStore();

  const {
    data: rawVisits = [],
    isLoading,
    refetch,
  } = useQuery<HospitalVisit[]>({
    queryKey: ['hospitalVisits'],
    queryFn: async () => {
      return visitsApi.getHospitalVisits('all');
    },
  });

  // Calculate base date visits
  const dateVisits = useMemo(() => {
    if (!selectedDate || selectedDate === 'All Dates') return rawVisits;
    return rawVisits.filter((v) => {
      const matchExact = v.date.toLowerCase() === selectedDate.toLowerCase();
      const matchPartial = selectedDate.includes(v.date) || v.date.includes(selectedDate);
      return matchExact || matchPartial;
    });
  }, [rawVisits, selectedDate]);

  // Dynamic live metric counters for the active date
  const visitedCount = useMemo(
    () => dateVisits.filter((v) => v.status === 'visited').length,
    [dateVisits]
  );

  const notVisitedCount = useMemo(
    () => dateVisits.filter((v) => v.status === 'not_visited').length,
    [dateVisits]
  );

  // Filter by status (All / Visited / Not Visited) and then sort
  const filteredAndSortedVisits = useMemo(() => {
    let list = [...dateVisits];

    // Status filter
    if (statusFilter === 'visited') {
      list = list.filter((v) => v.status === 'visited');
    } else if (statusFilter === 'not_visited') {
      list = list.filter((v) => v.status === 'not_visited');
    }

    // Sort order
    if (sortBy === 'name') {
      return list.sort((a, b) => a.hospitalName.localeCompare(b.hospitalName));
    }
    if (sortBy === 'status') {
      return list.sort((a, b) => (a.status === 'visited' ? 1 : -1));
    }
    // Default: time
    return list.sort((a, b) => a.time.localeCompare(b.time));
  }, [dateVisits, statusFilter, sortBy]);

  // Mutations
  const addVisitMutation = useMutation({
    mutationFn: (newVisit: Omit<HospitalVisit, 'id'>) =>
      visitsApi.addHospitalVisit(newVisit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalVisits'] });
    },
  });

  const updateVisitMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<HospitalVisit> }) =>
      visitsApi.updateHospitalVisit(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalVisits'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => visitsApi.toggleHospitalVisitStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalVisits'] });
    },
  });

  return {
    visits: filteredAndSortedVisits,
    allVisits: rawVisits,
    visitedCount,
    notVisitedCount,
    totalCount: dateVisits.length,
    selectedDate,
    setSelectedDate,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    isDayStarted,
    dayStartTime,
    startDay,
    endDay,
    isLoading,
    refetch,
    addVisit: addVisitMutation.mutateAsync,
    updateVisit: updateVisitMutation.mutateAsync,
    toggleStatus: toggleStatusMutation.mutateAsync,
  };
}
