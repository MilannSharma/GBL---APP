import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export interface HomeHeaderProps {
  unreadNotificationCount?: number;
  onNotificationPress?: () => void;
}

export function HomeHeader({
  unreadNotificationCount = 1,
  onNotificationPress,
}: HomeHeaderProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      router.push('/notifications');
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* Hospital Logo */}
      <View style={styles.logoWrapper}>
        <Image
          source={require('../../../../assets/hospital-logo-horizontal.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="GBL Barala Hospital Logo"
        />
      </View>

      {/* Notification Bell with Badge */}
      <TouchableOpacity
        style={styles.bellButton}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        activeOpacity={0.8}
      >
        <Ionicons name="notifications-outline" size={22} color="#0D2646" />
        {unreadNotificationCount > 0 && <View style={styles.badgeDot} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  logoWrapper: {
    justifyContent: 'center',
  },
  logo: {
    width: 175,
    height: 48,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EDF4FC',
  },
  badgeDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
