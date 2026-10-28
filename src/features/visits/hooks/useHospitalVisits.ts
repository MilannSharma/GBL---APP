import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visitsApi } from '../api';
import { HospitalVisit } from '../types';

export function useHospitalVisits() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string>('24 Nov 2025');
  const [sortBy, setSortBy] = useState<'time' | 'name' | 'status'>('time');
  const [isDayStarted, setIsDayStarted] = useState<boolean>(false);

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

  // Calculate live counts across the active date
  const dateVisits = useMemo(() => {
    if (!selectedDate || selectedDate === 'All Dates') return rawVisits;
    return rawVisits.filter(
      (v) => v.date.toLowerCase() === selectedDate.toLowerCase()
    );
  }, [rawVisits, selectedDate]);

  const visitedCount = useMemo(
    () => dateVisits.filter((v) => v.status === 'visited').length,
    [dateVisits]
  );

  const notVisitedCount = useMemo(
    () => dateVisits.filter((v) => v.status === 'not_visited').length,
    [dateVisits]
  );

  // Apply sorting
  const sortedVisits = useMemo(() => {
    const list = [...dateVisits];
    if (sortBy === 'name') {
      return list.sort((a, b) => a.hospitalName.localeCompare(b.hospitalName));
    }
    if (sortBy === 'status') {
      return list.sort((a, b) => (a.status === 'visited' ? 1 : -1));
    }
    // Default: time
    return list.sort((a, b) => a.time.localeCompare(b.time));
  }, [dateVisits, sortBy]);

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
    visits: sortedVisits,
    allVisits: rawVisits,
    visitedCount,
    notVisitedCount,
    totalCount: dateVisits.length,
    selectedDate,
    setSelectedDate,
    sortBy,
    setSortBy,
    isDayStarted,
    setIsDayStarted,
    isLoading,
    refetch,
    addVisit: addVisitMutation.mutateAsync,
    updateVisit: updateVisitMutation.mutateAsync,
    toggleStatus: toggleStatusMutation.mutateAsync,
  };
}
