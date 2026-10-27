import React from 'react';
import { Stack } from 'expo-router';

export default function VisitLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="check-in" />
      <Stack.Screen name="form" />
      <Stack.Screen name="photos" />
      <Stack.Screen name="signature" />
      <Stack.Screen name="review" />
      <Stack.Screen name="done" />
    </Stack>
  );
}
