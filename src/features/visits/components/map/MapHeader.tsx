import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { colors, spacing } from '@/core';
import { t } from '@/core/i18n';

export interface MapHeaderProps {
  stopCount: number;
  onBack: () => void;
  onOpenNotifications: () => void;
}

export function MapHeader({ stopCount, onBack, onOpenNotifications }: MapHeaderProps) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.titleRow}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={t('visits.map.back')}
        >
          <Feather name="arrow-left" size={22} color={colors.primaryDark} />
        </TouchableOpacity>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{t('visits.map.title')}</Text>
          <Text style={styles.subtitle}>{t('visits.map.subtitle')}</Text>
        </View>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={onOpenNotifications}
          accessibilityRole="button"
          accessibilityLabel={t('visits.map.notifications')}
        >
          <Feather name="bell" size={20} color={colors.primaryDark} />
        </TouchableOpacity>
      </View>

      <View style={styles.pillRow}>
        <View style={styles.timelinePill}>
          <Ionicons name="git-commit-outline" size={16} color={colors.primary} />
          <Text style={styles.timelineText}>
            {t(stopCount === 1 ? 'visits.map.timelineStop' : 'visits.map.timelineStops').replace(
              '{count}',
              String(stopCount)
            )}
          </Text>
        </View>
        <View style={styles.datePill}>
          <Feather name="calendar" size={14} color={colors.primary} />
          <Text style={styles.dateText}>
            {t('visits.map.today')}, {format(new Date(), 'dd MMM yyyy')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.sm },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  titleCol: { flex: 1, paddingTop: 2 },
  title: { fontSize: 24, fontWeight: '800', color: colors.primaryDark },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  timelinePill: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    elevation: 3,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  timelineText: { fontSize: 13, fontWeight: '700', color: colors.primary, flexShrink: 1 },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    elevation: 3,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  dateText: { fontSize: 13, fontWeight: '700', color: colors.primaryDark },
});
