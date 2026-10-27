import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export interface QuickActionItem {
  id: string;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  bgColor: string;
  route: string;
}

const DEFAULT_ACTIONS: QuickActionItem[] = [
  {
    id: 'profile',
    title: 'My\nProfile',
    icon: 'user',
    iconColor: '#0E70E3',
    bgColor: '#EEF6FF',
    route: '/(tabs)/profile',
  },
  {
    id: 'schedule',
    title: 'Schedule\n',
    icon: 'calendar',
    iconColor: '#7C3AED',
    bgColor: '#F4F0FF',
    route: '/(tabs)/visits',
  },
  {
    id: 'reports',
    title: 'Reports\n',
    icon: 'file-text',
    iconColor: '#059669',
    bgColor: '#EDFAF5',
    route: '/(tabs)/history',
  },
  {
    id: 'settings',
    title: 'Settings\n',
    icon: 'settings',
    iconColor: '#D97706',
    bgColor: '#FFF5EB',
    route: '/settings',
  },
];

export function HomeQuickActions() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/visits')}
          accessibilityRole="button"
          accessibilityLabel="View all quick actions"
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>View All &gt;</Text>
        </TouchableOpacity>
      </View>

      {/* 4 Cards Grid */}
      <View style={styles.actionsGrid}>
        {DEFAULT_ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.actionCard, { backgroundColor: item.bgColor }]}
            onPress={() => router.push(item.route as any)}
            accessibilityRole="button"
            accessibilityLabel={item.title.replace('\n', ' ')}
            activeOpacity={0.8}
          >
            <View style={styles.iconCircle}>
              <Feather name={item.icon} size={22} color={item.iconColor} />
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D2646',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0E70E3',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 96,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 15,
  },
});
