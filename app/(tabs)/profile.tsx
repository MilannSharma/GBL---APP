import React from 'react';
import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LoadingView } from '@/components/LoadingView';
import { EmptyState } from '@/components/EmptyState';
import { ProfileDetails, useProfile } from '@/features/profile';
import { useAuth } from '@/features/auth';

export default function ProfileRoute() {
  const router = useRouter();
  const { profile, loading } = useProfile();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {loading ? (
        <LoadingView message="Loading profile..." />
      ) : profile ? (
        <ProfileDetails profile={profile} onLogout={handleLogout} />
      ) : (
        <EmptyState
          title="No Profile Loaded"
          description="Please re-login to retrieve your account."
          actionTitle="Login"
          onAction={() => router.replace('/(auth)/login')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FBFE',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
