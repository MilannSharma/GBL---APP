import React from 'react';
import { Badge } from '@/components/Badge';

export interface SyncStatusBadgeProps {
  status: 'draft' | 'pending' | 'synced' | 'failed';
}

export function SyncStatusBadge({ status }: SyncStatusBadgeProps) {
  switch (status) {
    case 'synced':
      return <Badge label="Synced" variant="success" />;
    case 'pending':
      return <Badge label="Syncing..." variant="warning" />;
    case 'failed':
      return <Badge label="Sync Failed" variant="danger" />;
    case 'draft':
      return <Badge label="Draft" variant="muted" />;
  }
}
