import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '@/core/i18n';
import { colors } from '@/core/theme/colors';
import { useEntitySearch } from '../hooks/useEntityQueries';
import { HospitalEntity } from '../types';
import { addVisitStyles as s } from './add-visit-styles';
import { EntityResultRow } from './EntityResultRow';
import { StatePicker } from './StatePicker';

export interface EntityPickerProps {
  name: string;
  onChangeName: (value: string) => void;
  selected: HospitalEntity | null;
  onPick: (entity: HospitalEntity) => void;
  city: string;
  onChangeCity: (value: string) => void;
  state: string;
  onChangeState: (value: string) => void;
}

/**
 * Hospital fields. The name is a plain text field; similar existing hospitals show
 * below while typing and tapping one links it. City/state are only asked for a new hospital.
 */
export function EntityPicker({
  name,
  onChangeName,
  selected,
  onPick,
  city,
  onChangeCity,
  state,
  onChangeState,
}: EntityPickerProps) {
  const search = useEntitySearch(selected ? '' : name);
  const suggestions = search.data?.slice(0, 5) ?? [];

  return (
    <View>
      <TextInput
        style={s.input}
        value={name}
        onChangeText={onChangeName}
        placeholder={t('visits.add.hospitalPlaceholder')}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="words"
        accessibilityLabel={t('visits.add.hospitalLabel')}
      />

      {selected ? (
        <View style={[s.row, s.rowAction]}>
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={s.rowIcon} />
          <Text style={[s.rowSubtitle, s.rowBody]} numberOfLines={1}>
            {[t('visits.add.existingHospital'), selected.city, selected.state].filter(Boolean).join(' • ')}
          </Text>
        </View>
      ) : (
        <>
          {suggestions.length > 0 ? <Text style={s.sectionTitle}>{t('visits.add.similarTitle')}</Text> : null}
          {suggestions.map((entity) => (
            <EntityResultRow key={entity.id} entity={entity} onPress={onPick} />
          ))}
          <TextInput
            style={[s.input, s.inputSpaced]}
            value={city}
            onChangeText={onChangeCity}
            placeholder={t('visits.add.cityLabel')}
            placeholderTextColor={colors.textMuted}
            accessibilityLabel={t('visits.add.cityLabel')}
          />
          <StatePicker value={state} onChange={onChangeState} />
        </>
      )}
    </View>
  );
}
