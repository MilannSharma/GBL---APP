import React from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { LoginForm, useAuth } from '@/features/auth';

export default function LoginRoute() {
  const router = useRouter();
  const { requestOtp, loading, error } = useAuth();

  const handlePhoneSubmit = async (phone: string) => {
    const ok = await requestOtp(phone);
    if (ok) {
      router.push({
        pathname: '/(auth)/otp',
        params: { phone },
      });
    }
  };

  return (
    <Screen>
      <LoginForm
        onSubmitPhone={handlePhoneSubmit}
        loading={loading}
        error={error}
      />
    </Screen>
  );
}
