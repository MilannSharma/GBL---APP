import { useEffect, useState } from 'react';
import { storage } from '@/core/storage';

/** Id of the logged-in agent, read from the profile stored at login (null until loaded or if absent). */
export function useCurrentAgentId(): string | null {
  const [agentId, setAgentId] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    void storage.getItem(storage.keys.USER_PROFILE).then((raw) => {
      if (!isActive || !raw) return;
      try {
        const profile: unknown = JSON.parse(raw);
        const id = (profile as { _id?: unknown } | null)?._id;
        if (typeof id === 'string') setAgentId(id);
      } catch {
        // A corrupt stored profile just means "unknown agent"; names are shown as-is.
      }
    });
    return () => {
      isActive = false;
    };
  }, []);

  return agentId;
}
