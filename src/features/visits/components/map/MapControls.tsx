import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/core';
import { t } from '@/core/i18n';

export interface MapControlsProps {
  onLocate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function MapControls({ onLocate, onZoomIn, onZoomOut }: MapControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.locate}
        onPress={onLocate}
        accessibilityRole="button"
        accessibilityLabel={t('visits.map.locate')}
      >
        <Ionicons name="locate" size={22} color={colors.primary} />
      </TouchableOpacity>
      <View style={styles.zoomGroup}>
        <TouchableOpacity
          style={styles.zoomBtn}
          onPress={onZoomIn}
          accessibilityRole="button"
          accessibilityLabel={t('visits.map.zoomIn')}
        >
          <Feather name="plus" size={22} color={colors.primaryDark} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.zoomBtn}
          onPress={onZoomOut}
          accessibilityRole="button"
          accessibilityLabel={t('visits.map.zoomOut')}
        >
          <Feather name="minus" size={22} color={colors.primaryDark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const shadow = {
  elevation: 4,
  shadowColor: colors.primaryDark,
  shadowOpacity: 0.15,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
} as const;

const styles = StyleSheet.create({
  container: { alignSelf: 'flex-end', marginRight: spacing.lg, gap: spacing.md },
  locate: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  zoomGroup: { width: 48, borderRadius: 24, backgroundColor: colors.surface, ...shadow },
  zoomBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, marginHorizontal: spacing.md, backgroundColor: colors.border },
});
