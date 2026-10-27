import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { LoadingView } from '@/components/LoadingView';
import { visitsRepo, LocalVisit } from '@/db/repositories/visits.repo';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export default function HistoryDetailRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [visit, setVisit] = useState<LocalVisit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const data = await visitsRepo.getVisitById(id);
      setVisit(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <Screen scrollable={false}>
        <LoadingView message="Loading record..." />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Past Visit Record" onBack={() => router.back()} />
      <View style={styles.content}>
        <Card>
          <Text style={styles.hospital}>{visit?.hospital_name}</Text>
          <Text style={styles.date}>Date: {visit?.scheduled_date}</Text>
          <Text style={styles.status}>Status: {visit?.status}</Text>
          {visit?.notes && <Text style={styles.notes}>Notes: {visit.notes}</Text>}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
  },
  hospital: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  status: {
    ...typography.bodyMedium,
    color: colors.success,
    marginBottom: spacing.md,
  },
  notes: {
    ...typography.body,
    color: colors.text,
  },
});
