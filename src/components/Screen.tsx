import React, { ReactNode } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { useNetwork } from '@/hooks/useNetwork';

export interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}

export function Screen({ children, scrollable = true, style }: ScreenProps) {
  const { isConnected } = useNetwork();

  return (
    <SafeAreaView style={styles.safeArea}>
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            Offline Mode • Changes will sync automatically when reconnected
          </Text>
        </View>
      )}
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, style]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  offlineBanner: {
    backgroundColor: colors.warning,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    ...typography.captionMedium,
    color: colors.white,
  },
  scrollContent: {
    padding: spacing.screenPadding,
    flexGrow: 1,
  },
  content: {
    padding: spacing.screenPadding,
    flex: 1,
  },
});
