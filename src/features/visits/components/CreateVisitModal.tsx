import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '@/core/i18n';
import { colors } from '@/core/theme/colors';
import { radii, spacing } from '@/core/theme/spacing';
import { useCreateVisitForm } from '../hooks/useCreateVisitForm';
import { addVisitStyles as s } from './add-visit-styles';
import { ContactPicker } from './ContactPicker';
import { EntityPicker } from './EntityPicker';

export interface CreateVisitModalProps {
  visible: boolean;
  onClose: () => void;
  /** Hospital name typed in the Visits search; prefilled in the hospital field. */
  initialName?: string;
  onSaved?: (result: { hasSelfie: boolean }) => void;
}

export function CreateVisitModal({ visible, onClose, initialName, onSaved }: CreateVisitModalProps) {
  const form = useCreateVisitForm(visible);
  const { reset } = form;

  useEffect(() => {
    if (visible) reset(initialName);
  }, [visible, initialName, reset]);

  const handleSubmit = async () => {
    const result = await form.submit();
    if (result) {
      onSaved?.(result);
      onClose();
    }
  };

  const gpsLabel = t(
    form.gps.status === 'ready'
      ? 'visits.add.gpsReady'
      : form.gps.status === 'failed'
        ? 'visits.add.gpsFailed'
        : 'visits.add.gpsLocating'
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerSubtitle}>{t('visits.add.subtitle')}</Text>
              <Text style={styles.headerTitle}>{t('visits.add.title')}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t('visits.add.close')}
            >
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
            <View style={s.fieldGroup}>
              <Text style={s.label}>{t('visits.add.hospitalLabel')}</Text>
              <EntityPicker
                name={form.hospitalName}
                onChangeName={form.setHospitalName}
                selected={form.selectedEntity}
                onPick={form.pickEntity}
                city={form.city}
                onChangeCity={form.setCity}
                state={form.state}
                onChangeState={form.setState}
              />
            </View>

            <View style={s.fieldGroup}>
              <Text style={s.label}>{t('visits.add.contactLabel')}</Text>
              <ContactPicker
                entityId={form.selectedEntity?.id}
                values={form.contact}
                onChange={form.setContact}
                selected={form.selectedContact}
                onPick={form.pickContact}
              />
            </View>

            <View style={s.fieldGroup}>
              <Text style={s.label}>{t('visits.add.selfieLabel')}</Text>
              <TouchableOpacity
                style={styles.selfieButton}
                onPress={form.selfie.capture}
                disabled={form.selfie.isCapturing}
                accessibilityRole="button"
                accessibilityLabel={form.selfie.selfieUri ? t('visits.add.selfieRetake') : t('visits.add.selfieTake')}
              >
                {form.selfie.selfieUri ? (
                  <Image source={{ uri: form.selfie.selfieUri }} style={styles.selfiePreview} />
                ) : (
                  <Ionicons name="camera-outline" size={22} color={colors.primary} />
                )}
                <Text style={styles.selfieText}>
                  {form.selfie.selfieUri ? t('visits.add.selfieRetake') : t('visits.add.selfieTake')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={s.fieldGroup}>
              <Text style={s.label}>{t('visits.add.remarkLabel')}</Text>
              <TextInput
                style={[s.input, s.textArea]}
                value={form.remark}
                onChangeText={form.setRemark}
                multiline
                placeholder={t('visits.add.remarkPlaceholder')}
                placeholderTextColor={colors.textMuted}
                accessibilityLabel={t('visits.add.remarkLabel')}
              />
            </View>

            <TouchableOpacity
              style={styles.gpsRow}
              onPress={form.gps.retry}
              disabled={form.gps.status !== 'failed'}
              accessibilityRole={form.gps.status === 'failed' ? 'button' : 'text'}
              accessibilityLabel={gpsLabel}
            >
              {form.gps.status === 'locating' ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons
                  name={form.gps.status === 'ready' ? 'location' : 'location-outline'}
                  size={18}
                  color={form.gps.status === 'failed' ? colors.warningText : colors.primary}
                />
              )}
              <Text style={styles.gpsText}>{gpsLabel}</Text>
            </TouchableOpacity>

            {form.error ? <Text style={s.errorText}>{form.error}</Text> : null}

            <TouchableOpacity
              style={[styles.submit, form.isSubmitting && styles.submitDisabled]}
              onPress={handleSubmit}
              disabled={form.isSubmitting}
              accessibilityRole="button"
              accessibilityLabel={t('visits.add.submit')}
            >
              {form.isSubmitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
              )}
              <Text style={styles.submitText}>
                {form.isSubmitting ? t('visits.add.saving') : t('visits.add.submit')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
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
    paddingHorizontal: spacing.screenPadding + 4,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    maxHeight: '92%',
  },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { paddingBottom: spacing.xl },
  selfieButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    padding: spacing.md,
    borderRadius: radii.card + 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  selfiePreview: { width: 40, height: 40, borderRadius: 20 },
  selfieText: { marginLeft: spacing.md, fontSize: 14, fontWeight: '600', color: colors.primary },
  gpsRow: { flexDirection: 'row', alignItems: 'center', minHeight: 44, marginBottom: spacing.xs },
  gpsText: { marginLeft: spacing.sm, fontSize: 13, color: colors.textMuted, flexShrink: 1 },
  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 16,
    marginTop: spacing.sm,
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { marginLeft: spacing.sm, color: colors.white, fontSize: 15, fontWeight: '700' },
});
