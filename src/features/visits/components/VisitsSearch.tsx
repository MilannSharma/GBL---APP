import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '@/core/i18n';
import { colors } from '@/core/theme/colors';
import { radii, spacing } from '@/core/theme/spacing';
import { useEntitySearch } from '../hooks/useEntityQueries';
import { HospitalEntity } from '../types';
import { EntityResultRow } from './EntityResultRow';

export interface VisitsSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function VisitsSearchInput({ value, onChange }: VisitsSearchInputProps) {
  return (
    <View style={styles.inputWrap}>
      <Ionicons name="search" size={18} color={colors.textMuted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={t('visits.search.placeholder')}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="words"
        returnKeyType="search"
        accessibilityLabel={t('visits.search.placeholder')}
      />
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={() => onChange('')}
          accessibilityRole="button"
          accessibilityLabel={t('visits.search.clear')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export interface VisitsSearchResultsProps {
  term: string;
  onSelectEntity: (entity: HospitalEntity) => void;
}

/** Hospitals matching the typed text. The single Add Visit button carries the typed name when none match. */
export function VisitsSearchResults({ term, onSelectEntity }: VisitsSearchResultsProps) {
  const search = useEntitySearch(term);
  const trimmed = term.trim();
  const results = search.data ?? [];

  if (search.isPending) {
    return <Text style={styles.status}>{t('visits.search.searching')}</Text>;
  }
  if (search.isError) {
    return <Text style={[styles.status, styles.error]}>{t('visits.search.error')}</Text>;
  }

  return (
    <View style={styles.results}>
      {results.map((entity) => (
        <EntityResultRow key={entity.id} entity={entity} onPress={onSelectEntity} />
      ))}
      {results.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{t('visits.search.emptyTitle')}</Text>
          <Text style={styles.emptyBody}>{t('visits.search.emptyBody').replace('{term}', trimmed)}</Text>
        </View>
      ) : null}
      <Text style={styles.hint}>{t('visits.search.hint')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    marginHorizontal: spacing.screenPadding + 4,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.card + 4,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: { flex: 1, marginLeft: spacing.sm, fontSize: 14, color: colors.text, paddingVertical: spacing.sm },
  results: { paddingHorizontal: spacing.screenPadding + 4 },
  status: { fontSize: 13, color: colors.textMuted, paddingHorizontal: spacing.screenPadding + 4, marginTop: spacing.md },
  error: { color: colors.danger },
  empty: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  emptyBody: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 18 },
  hint: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },
});
