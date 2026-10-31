import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useDaySessionStore } from '../store/useDaySessionStore';

export interface HomeHeroCardProps {
  visitedCount?: number;
  totalVisits?: number;
  isDayStarted?: boolean;
  isDayEnded?: boolean;
  /** True until the server shift status is known; blocks Start/End so a stale state cannot be acted on. */
  isStatusLoading?: boolean;
  dayStartTime?: string;
  dayEndTime?: string;
  onPressStartDay?: () => void;
  onPressEndDay?: () => void;
  onToggleDay?: (started: boolean) => void;
  onPressCard?: () => void;
}

export function HomeHeroCard({
  visitedCount = 0,
  totalVisits = 0,
  isDayStarted: propIsDayStarted,
  isDayEnded = false,
  isStatusLoading = false,
  dayStartTime: propDayStartTime,
  dayEndTime,
  onPressStartDay,
  onPressEndDay,
  onToggleDay,
  onPressCard,
}: HomeHeroCardProps) {
  const router = useRouter();
  const sessionStore = useDaySessionStore();

  const isDayStarted = propIsDayStarted !== undefined ? propIsDayStarted : sessionStore.isDayStarted;
  const dayStartTime = propDayStartTime !== undefined ? propDayStartTime : sessionStore.dayStartTime;

  const handleActionPress = () => {
    if (isDayEnded || isStatusLoading) {
      return;
    }
    if (isDayStarted) {
      if (onPressEndDay) {
        onPressEndDay();
      } else if (onToggleDay) {
        onToggleDay(false);
      } else {
        sessionStore.endDay();
      }
    } else {
      if (onPressStartDay) {
        onPressStartDay();
      } else if (onToggleDay) {
        onToggleDay(true);
      } else {
        sessionStore.startDay();
      }
    }
  };

  const handleCardPress = () => {
    if (onPressCard) {
      onPressCard();
    } else {
      router.push('/(tabs)/visits');
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Decorative background curve overlay */}
      <View style={styles.waveOverlay} />

      {/* Top row: Visit info & chevron */}
      <TouchableOpacity
        style={styles.topSection}
        onPress={handleCardPress}
        accessibilityRole="button"
        accessibilityLabel="View Today's visits"
        activeOpacity={0.9}
      >
        <View style={styles.visitLeftCol}>
          {/* Calendar badge */}
          <View style={styles.calendarIconBadge}>
            <Feather name="calendar" size={20} color="#FFFFFF" />
          </View>

          <View style={styles.visitTextGroup}>
            <Text style={styles.todayVisitLabel}>Today&apos;s Visit</Text>
            <View style={styles.countRow}>
              <Text style={styles.countNumber}>{visitedCount}</Text>
              <Text style={styles.visitedLabel}> visited</Text>
            </View>
          </View>
        </View>

        {/* Right chevron */}
        <View style={styles.chevronWrapper}>
          <Feather name="chevron-right" size={24} color="rgba(255, 255, 255, 0.7)" />
        </View>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom row: Day status & Start/End Day button */}
      <View style={styles.bottomSection}>
        <View style={styles.statusLeft}>
          <Feather
            name={isDayEnded ? 'check-circle' : isDayStarted ? 'clock' : 'moon'}
            size={16}
            color="rgba(255, 255, 255, 0.9)"
          />
          <Text style={styles.statusText}>
            {isDayEnded
              ? dayEndTime
                ? `Shift completed (${dayEndTime})`
                : 'Shift completed for today'
              : isDayStarted
              ? dayStartTime
                ? `Day in progress (${dayStartTime})`
                : 'Day in progress'
              : 'Day not started yet'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.startDayButton,
            isDayEnded && styles.dayEndedButton,
            isStatusLoading && !isDayEnded && styles.statusLoadingButton,
          ]}
          onPress={handleActionPress}
          disabled={isDayEnded || isStatusLoading}
          accessibilityRole="button"
          accessibilityState={{ disabled: isDayEnded || isStatusLoading }}
          accessibilityLabel={isDayEnded ? 'Shift Completed' : isDayStarted ? 'End Day' : 'Start Day'}
          activeOpacity={0.85}
        >
          <View
            style={[
              styles.playCircle,
              isDayEnded
                ? styles.endedCircle
                : isDayStarted
                ? styles.stopCircle
                : styles.startCircle,
            ]}
          >
            <Ionicons
              name={isDayEnded ? 'checkmark' : isDayStarted ? 'stop' : 'play'}
              size={12}
              color="#FFFFFF"
              style={{ marginLeft: !isDayEnded && !isDayStarted ? 2 : 0 }}
            />
          </View>
          <Text
            style={[
              styles.startDayText,
              isDayEnded && styles.dayEndedText,
              isDayStarted && !isDayEnded && styles.endDayText,
            ]}
          >
            {isDayEnded ? 'Shift Ended' : isDayStarted ? 'End Day' : 'Start Day'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 24,
    backgroundColor: '#0E70E3',
    padding: 20,
    overflow: 'hidden',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  waveOverlay: {
    position: 'absolute',
    right: -40,
    bottom: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#1E80F0',
    opacity: 0.5,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  visitLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  visitTextGroup: {
    justifyContent: 'center',
  },
  todayVisitLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  countNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  visitedLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  chevronWrapper: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginVertical: 16,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 8,
  },
  statusLoadingButton: {
    opacity: 0.6,
  },
  startDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayEndedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    opacity: 0.8,
  },
  playCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  startCircle: {
    backgroundColor: '#0E70E3',
  },
  stopCircle: {
    backgroundColor: '#EF4444',
  },
  endedCircle: {
    backgroundColor: '#10B981',
  },
  startDayText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0E70E3',
  },
  endDayText: {
    color: '#DC2626',
  },
  dayEndedText: {
    color: '#059669',
  },
});
