import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useVisitForm } from '../hooks/useVisitForm';
import { spacing } from '@/core/theme/spacing';

export interface VisitFormComponentProps {
  visitId: string;
  onSuccess: () => void;
}

export function VisitFormComponent({ visitId, onSuccess }: VisitFormComponentProps) {
  const { saveForm, submitting, error } = useVisitForm(visitId);
  const [doctorMet, setDoctorMet] = useState('');
  const [department, setDepartment] = useState('');
  const [discussionNotes, setDiscussionNotes] = useState('');

  const handleSubmit = async () => {
    if (!doctorMet || !department || !discussionNotes) {
      return;
    }
    const ok = await saveForm({
      doctorMet,
      department,
      discussionNotes,
    });
    if (ok) {
      onSuccess();
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Doctor Met"
        placeholder="e.g. Dr. A. Sharma"
        value={doctorMet}
        onChangeText={setDoctorMet}
      />
      <Input
        label="Department"
        placeholder="e.g. Cardiology"
        value={department}
        onChangeText={setDepartment}
      />
      <Input
        label="Discussion Notes"
        placeholder="Key points discussed during the visit..."
        multiline
        numberOfLines={4}
        value={discussionNotes}
        onChangeText={setDiscussionNotes}
        error={error ?? undefined}
      />
      <Button
        title="Save & Proceed"
        onPress={handleSubmit}
        loading={submitting}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  button: {
    marginTop: spacing.lg,
  },
});
