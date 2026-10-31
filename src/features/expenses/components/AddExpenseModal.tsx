import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ExpenseType, CreateExpensePayload } from '@/api/endpoints/expenses';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateExpensePayload) => Promise<boolean>;
}

interface CategoryOption {
  type: ExpenseType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CATEGORIES: CategoryOption[] = [
  { type: 'TRAVEL', label: 'Travel', icon: 'airplane' },
  { type: 'MEAL', label: 'Meals', icon: 'restaurant' },
  { type: 'HOTEL', label: 'Hotel / Stay', icon: 'bed' },
  { type: 'OTHER', label: 'Others', icon: 'document-text' },
];

export function AddExpenseModal({ visible, onClose, onSubmit }: AddExpenseModalProps) {
  const [selectedType, setSelectedType] = useState<ExpenseType>('TRAVEL');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setAmount('');
    setDesc('');
    setSelectedPhoto(null);
    setSelectedType('TRAVEL');
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera roll permission is required to upload receipt bills.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setSelectedPhoto(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to capture receipt bills.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setSelectedPhoto(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Failed to capture photo.');
    }
  };

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount.trim());
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid expense amount.');
      return;
    }

    setIsSubmitting(true);
    const photos = selectedPhoto
      ? [
          {
            uri: selectedPhoto,
            name: `receipt_${Date.now()}.jpg`,
            type: 'image/jpeg',
          },
        ]
      : undefined;

    const success = await onSubmit({
      amount: numAmount,
      expenseType: selectedType,
      desc: desc.trim() || undefined,
      photos,
    });

    setIsSubmitting(false);
    if (success) {
      resetForm();
      onClose();
    } else {
      Alert.alert('Submission Failed', 'Could not record expense claim. Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Record Expense Claim</Text>
              <Text style={styles.headerSubtitle}>Submit reimbursement with bill photo</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Feather name="x" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            {/* Expense Type Categories */}
            <Text style={styles.fieldLabel}>Expense Category</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedType === cat.type;
                return (
                  <TouchableOpacity
                    key={cat.type}
                    style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                    onPress={() => setSelectedType(cat.type)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={18}
                      color={isSelected ? '#FFFFFF' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.categoryLabel,
                        isSelected && styles.categoryLabelActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Amount Field */}
            <Text style={styles.fieldLabel}>Amount (₹)</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Description Field */}
            <Text style={styles.fieldLabel}>Description / Purpose</Text>
            <TextInput
              style={styles.descInput}
              placeholder="e.g. Travel to SMS Hospital, client meal, etc."
              placeholderTextColor="#94A3B8"
              value={desc}
              onChangeText={setDesc}
              multiline
              numberOfLines={3}
            />

            {/* Receipt Attachment */}
            <Text style={styles.fieldLabel}>Attach Bill / Receipt (Optional)</Text>
            {selectedPhoto ? (
              <View style={styles.photoPreviewWrapper}>
                <Image source={{ uri: selectedPhoto }} style={styles.photoPreview} />
                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={() => setSelectedPhoto(null)}
                >
                  <Feather name="trash-2" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoActionRow}>
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={handleTakePhoto}
                  activeOpacity={0.7}
                >
                  <Feather name="camera" size={18} color="#0E70E3" />
                  <Text style={styles.uploadBtnText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={handlePickImage}
                  activeOpacity={0.7}
                >
                  <Feather name="image" size={18} color="#0E70E3" />
                  <Text style={styles.uploadBtnText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>Submit Expense Claim</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    marginTop: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#0E70E3',
    borderColor: '#0E70E3',
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0E70E3',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    height: 48,
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  descInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  photoActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0E70E3',
  },
  photoPreviewWrapper: {
    position: 'relative',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0E70E3',
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 22,
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
