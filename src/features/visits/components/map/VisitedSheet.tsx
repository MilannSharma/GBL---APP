import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, Image, PanResponder, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/core';
import { t } from '@/core/i18n';
import { MapStop } from '../../hooks/useVisitsMap';

export interface VisitedSheetProps {
  stops: MapStop[];
  isCollapsed: boolean;
  /** Called with the wanted state: true to collapse, false to expand. */
  onSetCollapsed: (isCollapsed: boolean) => void;
  onPressStop: (stop: MapStop) => void;
}

const keyExtractor = (stop: MapStop) => stop.visit.id;

const VisitRow = memo(function VisitRow({ stop, onPressStop }: { stop: MapStop; onPressStop: (stop: MapStop) => void }) {
  const { visit, order } = stop;
  const place = [visit.city ?? visit.address].filter(Boolean).join(', ');
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPressStop(stop)}
      accessibilityRole="button"
      accessibilityLabel={`${visit.hospitalName}, stop ${order}, ${visit.time}`}
    >
      <View style={styles.thumbWrap}>
        <Image source={require('@/../assets/hospital-building.png')} style={styles.thumb} />
        <View style={styles.orderBadge}>
          <Text style={styles.orderText}>{order}</Text>
        </View>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={2}>
          {visit.hospitalName}
        </Text>
        {place ? (
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={12} color={colors.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {place}
            </Text>
          </View>
        ) : null}
        {!stop.coordinate ? <Text style={styles.noLocation}>{t('visits.map.noLocation')}</Text> : null}
      </View>
      <View style={styles.rowTime}>
        <View style={styles.metaRow}>
          <Feather name="clock" size={12} color={colors.textMuted} />
          <Text style={styles.metaText}>{visit.time}</Text>
        </View>
        <View style={styles.metaRow}>
          <Feather name="calendar" size={12} color={colors.textMuted} />
          <Text style={styles.metaText}>{visit.date}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
});

export function VisitedSheet({ stops, isCollapsed, onSetCollapsed, onPressStop }: VisitedSheetProps) {
  const renderItem = useCallback(
    ({ item }: { item: MapStop }) => <VisitRow stop={item} onPressStop={onPressStop} />,
    [onPressStop]
  );

  // A percentage height would resolve against an auto-height parent and collapse to the header.
  const { height: windowHeight } = useWindowDimensions();

  // Swipe up on the handle or header opens the list, swipe down closes it.
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 8 && Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderRelease: (_, g) => {
          if (g.dy < -30) onSetCollapsed(false);
          else if (g.dy > 30) onSetCollapsed(true);
        },
      }),
    [onSetCollapsed]
  );

  return (
    <View style={[styles.sheet, isCollapsed ? styles.sheetCollapsed : { height: windowHeight * 0.42 }]}>
      <View {...panResponder.panHandlers}>
        <TouchableOpacity
          style={styles.handleTouch}
          onPress={() => onSetCollapsed(!isCollapsed)}
          accessibilityRole="button"
          accessibilityLabel={t('visits.map.sheetToggle')}
        >
          <View style={styles.handle} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="business" size={22} color={colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{t('visits.map.sheetTitle')}</Text>
            {!isCollapsed ? <Text style={styles.subtitle}>{t('visits.map.sheetSubtitle')}</Text> : null}
          </View>
          <View style={styles.countChip}>
            <Text style={styles.countText}>{stops.length}</Text>
            <Text style={styles.countLabel}>{t('visits.map.visitedCount')}</Text>
          </View>
        </View>
      </View>

      {!isCollapsed ? (
        <FlatList
          data={stops}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    elevation: 10,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
  },
  sheetCollapsed: { height: undefined, paddingBottom: spacing.md },
  handleTouch: { minHeight: 28, alignItems: 'center', justifyContent: 'center' },
  handle: { width: 56, height: 5, borderRadius: 3, backgroundColor: colors.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  title: { fontSize: 18, fontWeight: '800', color: colors.primaryDark },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  countChip: {
    minWidth: 64,
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  countText: { fontSize: 17, fontWeight: '800', color: colors.primaryDark },
  countLabel: { fontSize: 11, color: colors.textMuted },
  list: { paddingBottom: spacing.xl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 64,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  thumbWrap: { width: 52, height: 52 },
  thumb: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primarySoft },
  orderBadge: {
    position: 'absolute',
    top: -2,
    left: -2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: { fontSize: 10, fontWeight: '800', color: colors.white },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 14, fontWeight: '800', color: colors.primaryDark },
  rowTime: { gap: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  metaText: { fontSize: 11, color: colors.textMuted, flexShrink: 1 },
  noLocation: { fontSize: 10, color: colors.warning, marginTop: 2 },
});
