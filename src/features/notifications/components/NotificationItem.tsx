import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppNotification } from '../types';

export interface NotificationItemProps {
  item: AppNotification;
  onPress: () => void;
}

export function NotificationItem({ item, onPress }: NotificationItemProps) {
  // Determine icon and color based on notification type
  const getIconConfig = () => {
    switch (item.type) {
      case 'visit_assigned':
        return {
          icon: 'calendar-outline' as const,
          color: '#0E70E3',
          bgColor: '#EFF6FF',
          label: 'Visit',
        };
      case 'reminder':
        return {
          icon: 'time-outline' as const,
          color: '#D97706',
          bgColor: '#FFFBEB',
          label: 'Reminder',
        };
      case 'system':
      default:
        return {
          icon: 'shield-checkmark-outline' as const,
          color: '#0FB5AE',
          bgColor: '#F0FDFA',
          label: 'System',
        };
    }
  };

  const config = getIconConfig();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[styles.card, !item.read && styles.unreadCard]}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.body}`}
    >
      {/* Icon Pill */}
      <View style={[styles.iconWrapper, { backgroundColor: config.bgColor }]}>
        <Ionicons name={config.icon} size={20} color={config.color} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.title, !item.read && styles.unreadTitle]} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.body} numberOfLines={2}>
          {item.body}
        </Text>

        <View style={styles.footerRow}>
          <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
            <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
          </View>
          <Text style={styles.timestamp}>{item.timeAgo || item.createdAt}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#F8FBFE',
    borderColor: '#BFDBFE',
    shadowOpacity: 0.08,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D2646',
    flex: 1,
    marginRight: 6,
  },
  unreadTitle: {
    color: '#0E70E3',
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0E70E3',
  },
  body: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
