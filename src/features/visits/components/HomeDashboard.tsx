import React, { useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeHeader } from './HomeHeader';
import { HomeWelcomeBanner } from './HomeWelcomeBanner';
import { HomeHeroCard } from './HomeHeroCard';
import { HomeQuickActions } from './HomeQuickActions';
import { HomeOverviewCard } from './HomeOverviewCard';

export interface HomeDashboardProps {
  userName?: string;
  visitedCount?: number;
  totalVisits?: number;
  onRefresh?: () => Promise<void> | void;
  isLoading?: boolean;
}

export function HomeDashboard({
  userName = 'Sajibur Rahman',
  visitedCount = 0,
  totalVisits = 0,
  onRefresh,
  isLoading = false,
}: HomeDashboardProps) {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [isDayStarted, setIsDayStarted] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  };

  const notVisitedCount = Math.max(0, totalVisits - visitedCount);

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

        {/* Today's Visit Hero Card */}
        <HomeHeroCard
          visitedCount={visitedCount}
          totalVisits={totalVisits}
          isDayStarted={isDayStarted}
          onToggleDay={(started) => setIsDayStarted(started)}
        />

        {/* Quick Actions Shortcuts */}
        <HomeQuickActions />

        {/* Today's Overview Metrics */}
        <HomeOverviewCard
          visitedCount={visitedCount}
          notVisitedCount={notVisitedCount}
          isDayStarted={isDayStarted}
        />
      </ScrollView>
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
});
