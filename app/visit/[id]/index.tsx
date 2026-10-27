import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { LoadingView } from '@/components/LoadingView';
import { visitsRepo, LocalVisit } from '@/db/repositories/visits.repo';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { colors } from '@/core/theme/colors';

export default function VisitDetailRoute() {
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
        <LoadingView message="Loading visit..." />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Visit Overview" onBack={() => router.back()} />
      <View style={styles.content}>
        <Text style={styles.title}>{visit?.hospital_name || 'Hospital Visit'}</Text>
        <Text style={styles.date}>Date: {visit?.scheduled_date || 'Today'}</Text>
        <Text style={styles.status}>Status: {visit?.status || 'Assigned'}</Text>

        <View style={styles.actions}>
          <Button
            title="Proceed to Check-In"
            onPress={() => router.push(`/visit/${id}/check-in`)}
            style={styles.button}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.screenPadding,
  },
  title: {
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
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  actions: {
    marginTop: spacing.lg,
  },
  button: {
    width: '100%',
  },
});
