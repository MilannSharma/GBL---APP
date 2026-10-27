import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppNotification } from '../types';
import { colors } from '@/core/theme/colors';
import { spacing, radii } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export interface NotificationItemProps {
  item: AppNotification;
  onPress: () => void;
}

export function NotificationItem({ item, onPress }: NotificationItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, !item.read && styles.unread]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, !item.read && styles.boldTitle]}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.date}>{item.createdAt}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unread: {
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  boldTitle: {
    fontWeight: '600',
    color: colors.primary,
  },
  body: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
});
