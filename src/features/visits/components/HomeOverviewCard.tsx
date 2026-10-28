import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

export interface HomeOverviewCardProps {
  visitedCount?: number;
  notVisitedCount?: number;
  isDayStarted?: boolean;
}

export function HomeOverviewCard({
  visitedCount = 0,
  notVisitedCount = 0,
  isDayStarted = false,
}: HomeOverviewCardProps) {
  const currentTime = format(new Date(), 'h:mm a');

  return (
    <View style={styles.cardWrapper}>
      {/* Header Row */}
      <View style={styles.cardHeader}>
        <View style={styles.headerTitleGroup}>
          <Ionicons name="location-sharp" size={20} color="#0E70E3" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Today's Overview</Text>
        </View>
        <Text style={styles.headerTime}>As of {currentTime}</Text>
      </View>

      {/* Metric Cards 2-col row */}
      <View style={styles.metricsRow}>
        {/* Metric 1: Visited */}
        <View style={[styles.metricBox, styles.visitedMetricBox]}>
          <View style={styles.metricIconCircleBlue}>
            <Ionicons name="checkmark-circle" size={22} color="#0E70E3" />
          </View>
          <View style={styles.metricTextCol}>
            <Text style={styles.metricNumber}>{visitedCount}</Text>
            <Text style={styles.metricLabel}>Visited</Text>
          </View>
        </View>

        {/* Metric 2: Not Yet Visited */}
        <View style={[styles.metricBox, styles.pendingMetricBox]}>
          <View style={styles.metricIconCircleGray}>
            <Ionicons name="time" size={20} color="#64748B" />
          </View>
          <View style={styles.metricTextCol}>
            <Text style={styles.metricNumber}>{notVisitedCount}</Text>
            <Text style={styles.metricLabel}>Not Yet Visited</Text>
          </View>
        </View>
      </View>

      {/* Bottom Info Notice */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={20} color="#0E70E3" style={styles.infoIcon} />
        <Text style={styles.infoText}>
          {isDayStarted
            ? 'Your day is in progress.\nCheck in at assigned hospitals to log visits.'
            : "Your day hasn't started yet.\nTap 'Start Day' to begin your visits."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 18,
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EDF4FC',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D2646',
  },
  headerTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metricBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  visitedMetricBox: {
    backgroundColor: '#F1F7FE',
    marginRight: 6,
  },
  pendingMetricBox: {
    backgroundColor: '#F8FAFC',
    marginLeft: 6,
  },
  metricIconCircleBlue: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(14, 112, 227, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  metricIconCircleGray: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  metricTextCol: {
    justifyContent: 'center',
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D2646',
    lineHeight: 26,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF7FF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D8ECFE',
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1E64BA',
    lineHeight: 17,
    fontWeight: '500',
  },
});
