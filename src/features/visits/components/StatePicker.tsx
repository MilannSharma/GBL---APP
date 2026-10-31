import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '@/core/i18n';
import { colors } from '@/core/theme/colors';
import { INDIAN_STATES } from '../constants/indian-states';
import { addVisitStyles as s } from './add-visit-styles';

const MAX_VISIBLE = 6;

export interface StatePickerProps {
  value: string;
  onChange: (state: string) => void;
}

/** Select-only state field: tap to open, type to narrow the list, tap a state to choose it. */
export function StatePicker({ value, onChange }: StatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const matches = useMemo(() => {
    const needle = filter.trim().toUpperCase();
    return INDIAN_STATES.filter((state) => state.includes(needle)).slice(0, MAX_VISIBLE);
  }, [filter]);

  const handlePick = (state: string) => {
    onChange(state);
    setFilter('');
    setIsOpen(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[s.input, s.inputSpaced, s.selectField]}
        onPress={() => setIsOpen((open) => !open)}
        accessibilityRole="button"
        accessibilityLabel={value ? `${t('visits.add.stateLabel')}: ${value}` : t('visits.add.statePlaceholder')}
        accessibilityState={{ expanded: isOpen }}
      >
        <Text style={[s.selectText, !value && s.selectPlaceholder]} numberOfLines={1}>
          {value || t('visits.add.statePlaceholder')}
        </Text>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
      </TouchableOpacity>

      {isOpen ? (
        <View>
          <TextInput
            style={[s.input, s.inputSpaced]}
            value={filter}
            onChangeText={(text) => setFilter(text.toUpperCase())}
            placeholder={t('visits.add.stateFilter')}
            placeholderTextColor={colors.textMuted}
            autoCapitalize="characters"
            autoFocus
            accessibilityLabel={t('visits.add.stateFilter')}
          />
          {matches.length === 0 ? <Text style={s.statusText}>{t('visits.add.stateNoMatch')}</Text> : null}
          {matches.map((state) => (
            <TouchableOpacity
              key={state}
              style={[s.row, state === value && s.rowAction]}
              onPress={() => handlePick(state)}
              accessibilityRole="button"
              accessibilityLabel={state}
            >
              <Text style={[s.rowTitle, s.rowBody]} numberOfLines={1}>{state}</Text>
              {state === value ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}
