import { useState, useEffect } from 'react';
import { storage } from '@/core/storage';
import { AgentProfile } from '@/types';

export function useProfile() {
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const stored = await storage.getItem(storage.keys.USER_PROFILE);
        if (stored) {
          setProfile(JSON.parse(stored) as AgentProfile);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return {
    profile,
    loading,
  };
}
