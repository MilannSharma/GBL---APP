import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LoginForm, useAuth } from '@/features/auth';

export default function LoginRoute() {
  const router = useRouter();
  const { loginWithCredentials, loading, error } = useAuth();

  const handleLogin = async (identifier: string, pass: string) => {
    const ok = await loginWithCredentials(identifier, pass);
    if (ok) {
      router.replace('/(tabs)');
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/otp');
  };

  const handleSocialSignIn = async () => {
    const ok = await loginWithCredentials('milan.sharma@baralahospital.com', 'demoPass123');
    if (ok) {
      router.replace('/(tabs)');
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <LoginForm
        onLoginSubmit={handleLogin}
        onForgotPassword={handleForgotPassword}
        onGoogleSignIn={handleSocialSignIn}
        onAppleSignIn={handleSocialSignIn}
        loading={loading}
        error={error}
      />
    </>
  );
}
