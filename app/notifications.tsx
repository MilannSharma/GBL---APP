import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { LoadingView } from '@/components/LoadingView';
import { EmptyState } from '@/components/EmptyState';
import { NotificationItem, useNotifications } from '@/features/notifications';
import { spacing } from '@/core/theme/spacing';

export default function NotificationsRoute() {
  const router = useRouter();
  const { notifications, isLoading, markAsRead } = useNotifications();

  return (
    <Screen scrollable={false}>
      <Header title="Notifications" onBack={() => router.back()} />
      {isLoading ? (
        <LoadingView message="Loading alerts..." />
      ) : notifications.length === 0 ? (
        <EmptyState title="No Notifications" description="You're all caught up!" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onPress={() => markAsRead(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: spacing.sm,
  },
});
