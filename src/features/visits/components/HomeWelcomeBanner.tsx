import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export interface HomeWelcomeBannerProps {
  userName?: string;
  quote?: string;
}

export function HomeWelcomeBanner({
  userName = 'Sajibur Rahman',
  quote = 'Hope your day brings\nmore good than challenges.',
}: HomeWelcomeBannerProps) {
  return (
    <View style={styles.bannerContainer}>
      {/* Left text column */}
      <View style={styles.textColumn}>
        <Text style={styles.greetingText}>Welcome,</Text>
        <Text style={styles.nameText} numberOfLines={1}>
          {userName}
        </Text>
        {/* Accent green pill underline */}
        <View style={styles.accentUnderline} />
        <Text style={styles.quoteText}>{quote}</Text>
      </View>

      {/* Right doctor illustration */}
      <View style={styles.illustrationWrapper}>
        <Image
          source={require('../../../../assets/doctor-illustration.png')}
          style={styles.doctorImage}
          resizeMode="contain"
          accessibilityLabel="Medical Field Agent"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
    minHeight: 140,
  },
  textColumn: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0D2646',
    letterSpacing: -0.5,
  },
  accentUnderline: {
    width: 44,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#0FB5AE',
    marginTop: 4,
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '400',
  },
  illustrationWrapper: {
    width: 150,
    height: 140,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  doctorImage: {
    width: 150,
    height: 140,
  },
});
