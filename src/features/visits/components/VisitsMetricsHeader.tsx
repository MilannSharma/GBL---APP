import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeBack } from '@/hooks/useSafeBack';

export interface VisitsMetricsHeaderProps {
  visitedCount: number;
  totalVisits: number;
}

export function VisitsMetricsHeader({
  visitedCount,
  totalVisits,
}: VisitsMetricsHeaderProps) {
  const router = useRouter();
  const goBack = useSafeBack('/(tabs)');
  const insets = useSafeAreaInsets();

  const topPadding = Platform.OS === 'android' ? Math.max(insets.top, StatusBar.currentHeight || 0) + 8 : insets.top + 6;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#0D2646" />
        </TouchableOpacity>

        <View style={styles.titleColumn}>
          <Text style={styles.titleText}>Visits</Text>
          <Text style={styles.subtitleText}>
            Record and manage your hospital visits in the field.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.bellButton}
          onPress={() => router.push('/notifications')}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={22} color="#0D2646" />
          <View style={styles.unreadBadgeDot} />
        </TouchableOpacity>
      </View>

      {/* Metrics Row (2 Cards) */}
      <View style={styles.metricsRow}>
        {/* Visited Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricIconCircleBlue}>
            <Ionicons name="checkmark-done" size={18} color="#0E70E3" />
          </View>
          <View style={styles.metricTextWrapper}>
            <Text style={styles.metricNumber}>{visitedCount}</Text>
            <Text style={[styles.metricLabel, styles.metricLabelBlue]}>Visited</Text>
          </View>
        </View>

        {/* Total Added Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricIconCirclePurple}>
            <Ionicons name="business-outline" size={18} color="#6366F1" />
          </View>
          <View style={styles.metricTextWrapper}>
            <Text style={styles.metricNumber}>{totalVisits}</Text>
            <Text style={styles.metricLabel}>Total Added</Text>
          </View>
        </View>
      </View>

      {/* Section Header: Hospital Visits */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Hospital Visits</Text>
          {totalVisits > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{totalVisits}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#F8FBFE',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  titleColumn: {
    flex: 1,
    paddingRight: 8,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0D2646',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  metricIconCircleBlue: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  metricIconCirclePurple: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  metricTextWrapper: {
    justifyContent: 'center',
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D2646',
    lineHeight: 24,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  metricLabelBlue: {
    color: '#0E70E3',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0D2646',
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  countBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0E70E3',
  },
  addSmallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addSmallButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0E70E3',
  },
});
