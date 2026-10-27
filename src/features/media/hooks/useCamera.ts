import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { CapturedPhoto } from '../types';
import { permissions } from '@/core/permissions';

export function useCamera() {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [loading, setLoading] = useState(false);

  const takePhoto = async (): Promise<CapturedPhoto | null> => {
    const hasPermission = await permissions.requestCameraPermission();
    if (!hasPermission) return null;

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newPhoto: CapturedPhoto = {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
        };
        setPhotos((prev) => [...prev, newPhoto]);
        return newPhoto;
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = (uri: string) => {
    setPhotos((prev) => prev.filter((p) => p.uri !== uri));
  };

  return {
    photos,
    takePhoto,
    removePhoto,
    loading,
  };
}
