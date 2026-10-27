import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useSyncQueue } from '@/features/sync';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export default function SyncRoute() {
  const router = useRouter();
  const { summary, triggerSync } = useSyncQueue();

  return (
    <Screen>
      <Header title="Sync Monitor" onBack={() => router.back()} />
      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.statusTitle}>Offline Outbox Status</Text>
          <Text style={styles.stat}>Pending Mutations: {summary.pendingCount}</Text>
          <Text style={styles.stat}>Failed Mutations: {summary.failedCount}</Text>
          {summary.lastSyncedAt && (
            <Text style={styles.stat}>
              Last Check: {new Date(summary.lastSyncedAt).toLocaleTimeString()}
            </Text>
          )}
        </Card>

        <Button
          title={summary.isSyncing ? 'Syncing...' : 'Sync Now'}
          onPress={triggerSync}
          loading={summary.isSyncing}
          style={styles.syncButton}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
  },
  card: {
    marginBottom: spacing.xl,
  },
  statusTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  stat: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  syncButton: {
    marginTop: spacing.md,
  },
});
