import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppError } from '@/api';
import { logger } from '@/core/logger';
import { t } from '@/core/i18n';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useAddContact } from '../hooks/useAddContact';
import { addVisitStyles as s } from './add-visit-styles';

const MIN_PHONE_DIGITS = 7;
const EMPTY = { name: '', phone: '', role: '' };

export interface AddContactModalProps {
  entityId: string;
  visible: boolean;
  onClose: () => void;
}

/** Saves a contact person on a hospital without recording a visit. */
export function AddContactModal({ entityId, visible, onClose }: AddContactModalProps) {
  const addContact = useAddContact();
  const { reset: resetMutation } = addContact;
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);

  // Start from an empty form each time the sheet opens.
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setValues(EMPTY);
      setError(null);
    }
  }
  useEffect(() => {
    if (visible) resetMutation();
  }, [visible, resetMutation]);

  const handleSave = async () => {
    if (!values.name.trim() || !values.phone.trim()) {
      setError(t('visits.addContact.errRequired'));
      return;
    }
    if (values.phone.replace(/\D/g, '').length < MIN_PHONE_DIGITS) {
      setError(t('visits.addContact.errPhone'));
      return;
    }

    setError(null);
    try {
      await addContact.mutateAsync({
        entityId,
        name: values.name,
        contact: values.phone,
        role: values.role,
      });
      onClose();
    } catch (err: unknown) {
      logger.warn('Add contact failed', { code: err instanceof AppError ? err.code : 'UNKNOWN' });
      if (err instanceof AppError && err.code === 'NETWORK_ERROR') {
        setError(t('visits.addContact.errNetwork'));
      } else if (err instanceof AppError && err.code === 'VALIDATION_ERROR' && err.message) {
        setError(err.message);
      } else {
        setError(t('visits.addContact.errFailed'));
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{t('visits.addContact.title')}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t('visits.add.close')}
            >
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={s.input}
            value={values.name}
            onChangeText={(name) => setValues({ ...values, name })}
            placeholder={t('visits.add.newContactName')}
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            accessibilityLabel={t('visits.add.newContactName')}
          />
          <TextInput
            style={[s.input, s.inputSpaced]}
            value={values.phone}
            onChangeText={(phone) => setValues({ ...values, phone })}
            placeholder={t('visits.add.newContactPhone')}
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
            accessibilityLabel={t('visits.add.newContactPhone')}
          />
          <TextInput
            style={[s.input, s.inputSpaced]}
            value={values.role}
            onChangeText={(role) => setValues({ ...values, role })}
            placeholder={t('visits.add.newContactRole')}
            placeholderTextColor={colors.textMuted}
            accessibilityLabel={t('visits.add.newContactRole')}
          />

          {error ? <Text style={[s.errorText, styles.error]}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.submit, addContact.isPending && styles.submitDisabled]}
            onPress={handleSave}
            disabled={addContact.isPending}
            accessibilityRole="button"
            accessibilityLabel={t('visits.addContact.submit')}
          >
            {addContact.isPending ? <ActivityIndicator color={colors.white} /> : null}
            <Text style={styles.submitText}>
              {addContact.isPending ? t('visits.addContact.saving') : t('visits.addContact.submit')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  backdrop: { flex: 1 },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : spacing.xl,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: { marginTop: spacing.md },
  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { marginLeft: spacing.sm, color: colors.white, fontSize: 15, fontWeight: '700' },
});
