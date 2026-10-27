import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from '@/components/Button';
import { useCamera } from '../hooks/useCamera';
import { spacing, radii } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { colors } from '@/core/theme/colors';

export interface PhotoCaptureProps {
  onPhotosChange?: (photosCount: number) => void;
}

export function PhotoCapture({ onPhotosChange }: PhotoCaptureProps) {
  const { photos, takePhoto, removePhoto, loading } = useCamera();

  const handleCapture = async () => {
    const photo = await takePhoto();
    if (photo && onPhotosChange) {
      onPhotosChange(photos.length + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visit Photos</Text>
      <Text style={styles.subtitle}>Take photos of the department, clinic board, or collateral</Text>

      {photos.length > 0 && (
        <ScrollView horizontal style={styles.previewScroll} showsHorizontalScrollIndicator={false}>
          {photos.map((item) => (
            <View key={item.uri} style={styles.thumbnailContainer}>
              <Image source={{ uri: item.uri }} style={styles.thumbnail} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removePhoto(item.uri)}
              >
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <Button
        title="Capture Photo"
        variant="secondary"
        onPress={handleCapture}
        loading={loading}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  previewScroll: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: spacing.sm,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: radii.input,
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.danger,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  button: {
    marginTop: spacing.sm,
  },
});
