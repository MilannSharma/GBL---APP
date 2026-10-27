import React from 'react';
import { HomeDashboard, useTodayVisits } from '@/features/visits';

export default function HomeRoute() {
  const { visits, isLoading, refetch } = useTodayVisits();

  const visitedCount = visits.filter((v) => v.status === 'completed').length;
  const totalVisits = visits.length;

  return (
    <HomeDashboard
      userName="Sajibur Rahman"
      visitedCount={visitedCount}
      totalVisits={totalVisits}
      isLoading={isLoading}
      onRefresh={async () => {
        await refetch();
      }}
    />
  );
}

