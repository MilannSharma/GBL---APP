import React, { useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '@/core/i18n';
import { colors } from '@/core/theme/colors';
import { useEntityContacts } from '../hooks/useEntityQueries';
import { ContactFields } from '../hooks/useCreateVisitForm';
import { HospitalContact } from '../types';
import { addVisitStyles as s } from './add-visit-styles';

const MAX_SUGGESTIONS = 4;

export interface ContactPickerProps {
  /** Set only when an existing hospital is chosen; a new hospital has no saved contacts. */
  entityId?: string;
  values: ContactFields;
  onChange: (values: ContactFields) => void;
  selected: HospitalContact | null;
  onPick: (contact: HospitalContact) => void;
}

/**
 * Contact fields (name, phone, role). For an existing hospital, its saved contacts
 * show as suggestions while typing; tapping one fills all three fields.
 */
export function ContactPicker({ entityId, values, onChange, selected, onPick }: ContactPickerProps) {
  const contacts = useEntityContacts(entityId);

  const suggestions = useMemo(() => {
    if (selected) return [];
    const needle = values.name.trim().toLowerCase();
    const phone = values.phone.trim();
    return (contacts.data ?? [])
      .filter(
        (c) =>
          (!needle || c.name.toLowerCase().includes(needle)) && (!phone || (c.phone ?? '').includes(phone))
      )
      .slice(0, MAX_SUGGESTIONS);
  }, [contacts.data, selected, values.name, values.phone]);

  return (
    <View>
      <TextInput
        style={s.input}
        value={values.name}
        onChangeText={(name) => onChange({ ...values, name })}
        placeholder={t('visits.add.newContactName')}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="words"
        accessibilityLabel={t('visits.add.newContactName')}
      />

      {suggestions.length > 0 ? <Text style={s.sectionTitle}>{t('visits.add.contactsTitle')}</Text> : null}
      {suggestions.map((contact) => (
        <TouchableOpacity
          key={contact.id}
          style={s.row}
          onPress={() => onPick(contact)}
          accessibilityRole="button"
          accessibilityLabel={`${contact.name} ${contact.phone ?? ''}`}
        >
          <Ionicons name="person-outline" size={20} color={colors.primary} style={s.rowIcon} />
          <View style={s.rowBody}>
            <Text style={s.rowTitle} numberOfLines={1}>{contact.name}</Text>
            <Text style={s.rowSubtitle} numberOfLines={1}>
              {[contact.phone, contact.role].filter(Boolean).join(' • ')}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <TextInput
        style={[s.input, s.inputSpaced]}
        value={values.phone}
        onChangeText={(phone) => onChange({ ...values, phone })}
        placeholder={t('visits.add.newContactPhone')}
        placeholderTextColor={colors.textMuted}
        keyboardType="phone-pad"
        accessibilityLabel={t('visits.add.newContactPhone')}
      />
      <TextInput
        style={[s.input, s.inputSpaced]}
        value={values.role}
        onChangeText={(role) => onChange({ ...values, role })}
        placeholder={t('visits.add.newContactRole')}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={t('visits.add.newContactRole')}
      />

      {selected ? (
        <Text style={s.hint}>{t('visits.add.existingContact')}</Text>
      ) : null}
    </View>
  );
}
