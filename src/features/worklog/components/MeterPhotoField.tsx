import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/core/theme';
import { t } from '@/core/i18n';
import { shiftStyles, MIN_TOUCH_SIZE } from './shift-modal-styles';

const PREVIEW_HEIGHT = 160;

export interface MeterPhotoFieldProps {
  photoUri: string | null;
  isCapturing: boolean;
  onCapture: () => void;
}

export function MeterPhotoField({ photoUri, isCapturing, onCapture }: MeterPhotoFieldProps) {
  return (
    <View style={shiftStyles.group}>
      <Text style={shiftStyles.label}>{t('worklog.photoLabel')}</Text>
      {photoUri ? (
        <View style={styles.previewWrapper}>
          <Image
            source={{ uri: photoUri }}
            style={styles.preview}
            accessibilityLabel={t('worklog.photoCaptured')}
          />
          <View style={styles.previewFooter}>
            <View style={styles.capturedBadge}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.capturedText}>{t('worklog.photoCaptured')}</Text>
            </View>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={onCapture}
              accessibilityRole="button"
              accessibilityLabel={t('worklog.photoRetake')}
            >
              <Feather name="refresh-cw" size={14} color={colors.primary} />
              <Text style={styles.retakeText}>{t('worklog.photoRetake')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.captureButton}
          onPress={onCapture}
          disabled={isCapturing}
          accessibilityRole="button"
          accessibilityLabel={t('worklog.photoTake')}
          accessibilityState={{ disabled: isCapturing, busy: isCapturing }}
        >
          {isCapturing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={24} color={colors.primary} />
              </View>
              <Text style={styles.captureTitle}>{t('worklog.photoTake')}</Text>
              <Text style={styles.captureHint}>{t('worklog.photoHint')}</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  previewWrapper: { borderRadius: radii.card, overflow: 'hidden', backgroundColor: colors.black },
  preview: { width: '100%', height: PREVIEW_HEIGHT },
  previewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bg,
  },
  capturedBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  capturedText: { ...typography.captionMedium, color: colors.success },
  retakeButton: {
    minHeight: MIN_TOUCH_SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  retakeText: { ...typography.captionMedium, color: colors.primary },
  captureButton: {
    borderWidth: 1.8,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radii.card,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    minHeight: MIN_TOUCH_SIZE,
  },
  cameraBadge: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  captureTitle: { ...typography.captionMedium, color: colors.primary, marginBottom: 2 },
  captureHint: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
});
