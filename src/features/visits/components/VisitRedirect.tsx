import React, { useEffect } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { t } from '@/core/i18n';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { hospitalHref, hospitalOfVisit } from '../navigation';
import { useVisitDetail } from '../hooks/useEntityQueries';

export interface VisitRedirectProps {
  visitId: string;
  onOpenHospital: (href: ReturnType<typeof hospitalHref>) => void;
  onBack: () => void;
}

/**
 * Links to a single visit (a notification, an old bookmark) land on the hospital page, which
 * holds all visit information in one place. Resolves the visit's hospital, then forwards.
 */
export function VisitRedirect({ visitId, onOpenHospital, onBack }: VisitRedirectProps) {
  const { data: visit, isError, refetch } = useVisitDetail(visitId);
  const hospital = visit ? hospitalOfVisit(visit) : null;

  useEffect(() => {
    if (hospital) onOpenHospital(hospitalHref(hospital));
  }, [hospital, onOpenHospital]);

  if (isError || (visit && !hospital)) {
    return (
      <Screen scrollable={false}>
        <View style={styles.center}>
          <Text style={styles.error}>{t('visits.detail.loadError')}</Text>
          <TouchableOpacity onPress={() => void refetch()} style={styles.button} accessibilityRole="button" accessibilityLabel={t('common.retry')}>
            <Text style={styles.buttonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onBack} style={styles.button} accessibilityRole="button" accessibilityLabel={t('visits.detail.close')}>
            <Text style={styles.buttonText}>{t('visits.detail.close')}</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable={false}>
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  error: { fontSize: 14, color: colors.danger, marginBottom: spacing.md, textAlign: 'center' },
  button: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.lg },
  buttonText: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
