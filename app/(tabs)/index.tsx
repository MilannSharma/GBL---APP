import React, { useState, useEffect } from 'react';
import { HomeDashboard, useHospitalVisits } from '@/features/visits';
import { storage } from '@/core/storage';

export default function HomeRoute() {
  const { visits, visitedCount, totalCount, isLoading, refetch } = useHospitalVisits();
  const [userName, setUserName] = useState<string>('Field Agent');

  useEffect(() => {
    async function loadAgentProfile() {
      try {
        const raw = await storage.getItem(storage.keys.USER_PROFILE);
        if (raw) {
          const profile = JSON.parse(raw);
          if (profile?.name) {
            setUserName(profile.name);
          }
        }
      } catch {
        // Fallback default
      }
    }
    loadAgentProfile();
  }, []);

  return (
    <HomeDashboard
      userName={userName}
      visits={visits}
      visitedCount={visitedCount}
      totalVisits={totalCount}
      isLoading={isLoading}
      onRefresh={async () => {
        await refetch();
      }}
    />
  );
}
