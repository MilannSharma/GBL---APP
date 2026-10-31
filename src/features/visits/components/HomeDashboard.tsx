import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { HomeHeader } from './HomeHeader';
import { HomeWelcomeBanner } from './HomeWelcomeBanner';
import { HomeHeroCard } from './HomeHeroCard';
import { TodayActivityTimeline } from './TodayActivityTimeline';
import { HospitalVisit } from '../types';
import { hospitalHref, hospitalOfVisit } from '../navigation';
import { useWorklogDaySync } from '../hooks/useWorklogDaySync';
import { colors, spacing, typography } from '@/core/theme';
import {
  useWorklog,
  StartWorkShiftModal,
  EndWorkShiftModal,
} from '@/features/worklog';

export interface HomeDashboardProps {
  userName?: string;
  visits?: HospitalVisit[];
  visitedCount?: number;
  totalVisits?: number;
  onRefresh?: () => Promise<void> | void;
  isLoading?: boolean;
}

export function HomeDashboard({
  userName = 'Sajibur Rahman',
  visits = [],
  visitedCount = 0,
  totalVisits = 0,
  onRefresh,
  isLoading = false,
}: HomeDashboardProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [endModalVisible, setEndModalVisible] = useState(false);

  const {
    todayWorklog,
    isDayStarted,
    isDayEnded,
    dayStartTime,
    dayEndTime,
    startShift,
    endShift,
    submitting,
    error: worklogError,
    clearError,
    fetchTodayWorklog,
    loadState,
    loadError,
  } = useWorklog();

  useWorklogDaySync({
    hasLoaded: loadState === 'ready',
    isDayStarted,
    isDayEnded,
    dayStartTime,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        onRefresh ? onRefresh() : Promise.resolve(),
        fetchTodayWorklog(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  // Status bar offset
  const topPadding = Platform.OS === 'android' ? Math.max(insets.top, StatusBar.currentHeight || 0) + 12 : insets.top;

  return (
    <View style={styles.screenContainer}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding, paddingBottom: 130 }, // extra space for floating bottom tab bar
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || refreshing}
            onRefresh={handleRefresh}
            tintColor="#0E70E3"
            colors={['#0E70E3']}
          />
        }
      >
        {/* Top Header: Logo & Notification Bell */}
        <HomeHeader unreadNotificationCount={1} />

        {/* Welcome Section with Doctor Illustration */}
        <HomeWelcomeBanner userName={userName} />

        {loadError ? (
          <Text style={styles.loadError} accessibilityRole="alert">
            {loadError}
          </Text>
        ) : null}

        {/* Today's Visit Hero Card */}
        <HomeHeroCard
          visitedCount={visitedCount}
          totalVisits={totalVisits}
          isDayStarted={isDayStarted}
          isDayEnded={isDayEnded}
          isStatusLoading={loadState !== 'ready'}
          dayStartTime={dayStartTime}
          dayEndTime={dayEndTime}
          onPressStartDay={() => {
            clearError();
            setStartModalVisible(true);
          }}
          onPressEndDay={() => {
            clearError();
            setEndModalVisible(true);
          }}
        />

        {/* Today's Activity Timeline Trail */}
        <TodayActivityTimeline
          visits={visits}
          isDayStarted={isDayStarted}
          dayStartTime={dayStartTime}
          onPressVisit={(visit) => {
            const hospital = hospitalOfVisit(visit);
            if (hospital) router.push(hospitalHref(hospital));
          }}
        />
      </ScrollView>

      {/* Start Work Shift Modal */}
      <StartWorkShiftModal
        visible={startModalVisible}
        onClose={() => setStartModalVisible(false)}
        onSubmit={startShift}
        loading={submitting}
        serverError={worklogError}
      />

      {/* End Work Shift Modal */}
      <EndWorkShiftModal
        visible={endModalVisible}
        onClose={() => setEndModalVisible(false)}
        onSubmit={endShift}
        initialReading={todayWorklog?.initialReading}
        loading={submitting}
        serverError={worklogError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FBFE',
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadError: {
    ...typography.captionMedium,
    color: colors.warningText,
    backgroundColor: colors.warningSoft,
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
  },
});
