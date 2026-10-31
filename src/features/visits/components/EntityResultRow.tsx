import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { radii, spacing } from '@/core/theme/spacing';
import { HospitalEntity } from '../types';

export interface EntityResultRowProps {
  entity: HospitalEntity;
  onPress: (entity: HospitalEntity) => void;
}

/** One hospital in a search result list (Visits search and the Add Visit picker). */
export const EntityResultRow = memo(function EntityResultRow({ entity, onPress }: EntityResultRowProps) {
  const subtitle = [entity.city, entity.state].filter(Boolean).join(', ');

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress(entity)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${entity.name}, ${subtitle}` : entity.name}
    >
      <Ionicons name="business-outline" size={20} color={colors.primary} style={styles.icon} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {entity.name}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginTop: spacing.sm,
  },
  icon: {
    marginRight: spacing.md,
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
});
