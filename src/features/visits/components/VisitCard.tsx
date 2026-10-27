import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/Card';
import { Badge, BadgeVariant } from '@/components/Badge';
import { LocalVisit } from '@/db/repositories/visits.repo';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export interface VisitCardProps {
  visit: LocalVisit;
  onPress: () => void;
}

function getStatusBadge(status: LocalVisit['status']): { label: string; variant: BadgeVariant } {
  switch (status) {
    case 'assigned':
      return { label: 'Assigned', variant: 'info' };
    case 'in_progress':
      return { label: 'In Progress', variant: 'warning' };
    case 'completed':
      return { label: 'Completed', variant: 'success' };
    case 'cancelled':
      return { label: 'Cancelled', variant: 'muted' };
  }
}

function getSyncBadge(status: LocalVisit['sync_status']): { label: string; variant: BadgeVariant } | null {
  if (status === 'synced') return null;
  if (status === 'pending') return { label: 'Syncing', variant: 'warning' };
  if (status === 'failed') return { label: 'Sync Failed', variant: 'danger' };
  return { label: 'Draft', variant: 'muted' };
}

export function VisitCard({ visit, onPress }: VisitCardProps) {
  const statusBadge = getStatusBadge(visit.status);
  const syncBadge = getSyncBadge(visit.sync_status);

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.hospitalName} numberOfLines={1}>
          {visit.hospital_name}
        </Text>
        <Badge label={statusBadge.label} variant={statusBadge.variant} />
      </View>

      <Text style={styles.date}>Scheduled: {visit.scheduled_date}</Text>

      {visit.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {visit.notes}
        </Text>
      )}

      {syncBadge && (
        <View style={styles.footer}>
          <Badge label={syncBadge.label} variant={syncBadge.variant} />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  hospitalName: {
    ...typography.h2,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  date: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  notes: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
