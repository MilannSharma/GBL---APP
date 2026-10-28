import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NotificationItem, useNotifications, AppNotification } from '@/features/notifications';

type FilterCategory = 'all' | 'unread' | 'visits' | 'reminders' | 'system';

interface FilterOption {
  key: FilterCategory;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'visits', label: 'Visits' },
  { key: 'reminders', label: 'Reminders' },
  { key: 'system', label: 'System' },
];

export default function NotificationsRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useNotifications();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Filter items
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (selectedFilter === 'unread') return !item.read;
      if (selectedFilter === 'visits') return item.type === 'visit_assigned';
      if (selectedFilter === 'reminders') return item.type === 'reminder';
      if (selectedFilter === 'system') return item.type === 'system';
      return true;
    });
  }, [notifications, selectedFilter]);

  const handleNotificationPress = (item: AppNotification) => {
    markAsRead(item.id);
    if (item.visitId) {
      router.push(`/visit/${item.visitId}`);
    }
  };

  const topPadding = Platform.OS === 'android' ? Math.max(insets.top, StatusBar.currentHeight || 0) + 10 : insets.top + 6;

  return (
    <View style={styles.screenContainer}>
      {/* Top Header Bar */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={22} color="#0D2646" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadPill}>
                <Text style={styles.unreadPillText}>{unreadCount} new</Text>
              </View>
            )}
          </View>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={() => markAllAsRead()}
            accessibilityRole="button"
            accessibilityLabel="Mark all as read"
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-done" size={16} color="#0E70E3" style={styles.markAllIcon} />
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Category Tabs */}
      <View style={styles.filterBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_OPTIONS}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isActive = selectedFilter === item.key;
            return (
              <TouchableOpacity
                onPress={() => setSelectedFilter(item.key)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Filter ${item.label}`}
              >
                <Text
                  style={[styles.filterChipText, isActive && styles.filterChipTextActive]}
                >
                  {item.label}
                  {item.key === 'unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Notification List or Empty State */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            item={item}
            onPress={() => handleNotificationPress(item)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          filteredNotifications.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || refreshing}
            onRefresh={handleRefresh}
            tintColor="#0E70E3"
            colors={['#0E70E3']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name={selectedFilter === 'unread' ? 'checkmark-circle-outline' : 'notifications-off-outline'}
                size={44}
                color="#94A3B8"
              />
            </View>
            <Text style={styles.emptyTitle}>
              {selectedFilter === 'unread' ? 'All Caught Up!' : 'No Notifications'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'unread'
                ? 'You have reviewed all incoming alerts.'
                : 'There are no notifications in this category right now.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FBFE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D2646',
  },
  unreadPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  unreadPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0E70E3',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  markAllIcon: {
    marginRight: 4,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0E70E3',
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#0E70E3',
    borderColor: '#0E70E3',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 32,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D2646',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
