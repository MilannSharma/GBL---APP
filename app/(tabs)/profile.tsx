import React from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
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
    <Screen>
      <Header title="My Profile" />
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
    </Screen>
  );
}
