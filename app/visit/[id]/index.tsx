import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { LoadingView } from '@/components/LoadingView';
import { visitsRepo, LocalVisit } from '@/db/repositories/visits.repo';
import { useDaySessionStore, StartDayGuardModal } from '@/features/visits';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { colors } from '@/core/theme/colors';

export default function VisitDetailRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [visit, setVisit] = useState<LocalVisit | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGuardModal, setShowGuardModal] = useState(false);

  const { isDayStarted, dayStartTime, startDay } = useDaySessionStore();

  useEffect(() => {
    async function load() {
      if (!id) return;
      const data = await visitsRepo.getVisitById(id);
      setVisit(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleCheckInPress = () => {
    if (!isDayStarted) {
      setShowGuardModal(true);
      return;
    }
    router.push(`/visit/${id}/check-in`);
  };

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
        {/* Day Status Notice */}
        <View style={[styles.dayBanner, isDayStarted ? styles.dayBannerActive : styles.dayBannerInactive]}>
          <Text style={[styles.dayBannerText, isDayStarted ? styles.dayBannerTextActive : styles.dayBannerTextInactive]}>
            {isDayStarted
              ? `Shift active since ${dayStartTime || '09:00 AM'}`
              : 'Daily shift not started. Start day before check-in.'}
          </Text>
        </View>

        <Text style={styles.title}>{visit?.hospital_name || 'Hospital Visit'}</Text>
        <Text style={styles.date}>Date: {visit?.scheduled_date || 'Today'}</Text>
        <Text style={styles.status}>Status: {visit?.status || 'Assigned'}</Text>

        <View style={styles.actions}>
          <Button
            title="Proceed to Check-In"
            onPress={handleCheckInPress}
            style={styles.button}
          />
        </View>

        {/* Day Start Guard Modal */}
        <StartDayGuardModal
          visible={showGuardModal}
          actionAttempted="perform hospital check-in"
          onClose={() => setShowGuardModal(false)}
          onStartDay={() => {
            startDay();
            router.push(`/visit/${id}/check-in`);
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.screenPadding,
  },
  dayBanner: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
  },
  dayBannerActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  dayBannerInactive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  dayBannerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dayBannerTextActive: {
    color: '#10B981',
  },
  dayBannerTextInactive: {
    color: '#0E70E3',
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
