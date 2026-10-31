import React from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { t } from '@/core/i18n';
import { LoginForm, useAuth } from '@/features/auth';

export default function LoginRoute() {
  const router = useRouter();
  const { loginWithCredentials, loading, error, clearError } = useAuth();

  const handleLogin = async (identifier: string, pass: string) => {
    const ok = await loginWithCredentials(identifier, pass);
    if (ok) {
      router.replace('/(tabs)');
    }
  };

  // Passwords are reset by the backend team, there is no self-service reset in the app.
  const handleForgotPassword = () => {
    Alert.alert(t('auth.forgotPasswordTitle'), t('auth.forgotPasswordBody'));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LoginForm
        onLoginSubmit={handleLogin}
        onForgotPassword={handleForgotPassword}
        onClearError={clearError}
        loading={loading}
        error={error}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
