import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  Linking,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AgentProfile } from '@/types';
import { useDaySessionStore } from '@/features/visits/store/useDaySessionStore';
import { storage } from '@/core/storage';
import { buildProfileRows, formatTerritory } from '../profile-details';

const AVATAR_STORAGE_KEY = 'user_custom_avatar_uri';

export interface ProfileDetailsProps {
  profile: AgentProfile;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  action: () => void;
}

export function ProfileDetails({ profile, onLogout }: ProfileDetailsProps) {
  const router = useRouter();
  const { isDayStarted, isDayEnded } = useDaySessionStore();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineSyncEnabled, setOfflineSyncEnabled] = useState(true);

  // Load custom avatar from persistent local storage
  useEffect(() => {
    let isMounted = true;
    async function loadAvatar() {
      try {
        const saved = await storage.getItem(AVATAR_STORAGE_KEY);
        if (saved && isMounted) {
          setAvatarUri(saved);
        }
      } catch {
        // Fallback to default claymorphism avatar
      }
    }
    loadAvatar();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Photo Picker (Camera / Gallery / Reset)
  const handlePickAvatar = () => {
    Alert.alert(
      'Profile Picture',
      'Update your profile photo or reset to default avatar:',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            try {
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission Required', 'Camera permission is needed to take a profile photo.');
                return;
              }
              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.85,
              });
              if (!result.canceled && result.assets[0]?.uri) {
                const uri = result.assets[0].uri;
                setAvatarUri(uri);
                await storage.setItem(AVATAR_STORAGE_KEY, uri);
              }
            } catch {
              Alert.alert('Error', 'Failed to capture photo.');
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            try {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission Required', 'Photo library permission is needed.');
                return;
              }
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.85,
              });
              if (!result.canceled && result.assets[0]?.uri) {
                const uri = result.assets[0].uri;
                setAvatarUri(uri);
                await storage.setItem(AVATAR_STORAGE_KEY, uri);
              }
            } catch {
              Alert.alert('Error', 'Failed to pick image from gallery.');
            }
          },
        },
        ...(avatarUri
          ? [
              {
                text: 'Reset to Claymorphism Avatar',
                style: 'destructive' as const,
                onPress: async () => {
                  setAvatarUri(null);
                  await storage.removeItem(AVATAR_STORAGE_KEY);
                },
              },
            ]
          : []),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Dynamic Shift Status Badge
  const territory = formatTerritory(profile);
  const detailRows = buildProfileRows(profile);
  const statusConfig = isDayStarted && !isDayEnded
    ? { label: 'Active', dotColor: '#22C55E', bgColor: '#DCFCE7', textColor: '#15803D' }
    : isDayEnded
    ? { label: 'Shift Ended', dotColor: '#94A3B8', bgColor: '#F1F5F9', textColor: '#64748B' }
    : { label: 'Not Started', dotColor: '#0E70E3', bgColor: '#EFF6FF', textColor: '#0E70E3' };

  const handleLogoutConfirm = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out of your field agent account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };

  // Clean menu list: only distinct operational features, NO duplicate profile options
  const menuItems: MenuItem[] = [
    {
      id: 'visits',
      title: 'Visits',
      subtitle: 'Track your hospital visits',
      icon: 'calendar-outline',
      iconBg: '#ECFDF5',
      iconColor: '#059669',
      action: () => router.push('/(tabs)/visits'),
    },
    {
      id: 'map',
      title: 'Visits Map',
      subtitle: 'View visited hospitals on live route',
      icon: 'map-outline',
      iconBg: '#EFF6FF',
      iconColor: '#0E70E3',
      action: () => router.push('/map'),
    },
    {
      id: 'expenses',
      title: 'Expenses',
      subtitle: 'Manage your travel & other expenses',
      icon: 'wallet-outline',
      iconBg: '#F5F3FF',
      iconColor: '#7C3AED',
      action: () => router.push('/(tabs)/history'),
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences and offline sync',
      icon: 'settings-outline',
      iconBg: '#F1F5F9',
      iconColor: '#475569',
      action: () => setIsSettingsModalOpen(true),
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: '24x7 Support & Hospital Helpline',
      icon: 'headset-outline',
      iconBg: '#ECFDF5',
      iconColor: '#0D9488',
      action: () => setIsHelpModalOpen(true),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header Row with Hospital Logo & Notifications */}
      <View style={styles.topHeader}>
        <Image
          source={require('@/../assets/hospital-logo-horizontal.png')}
          style={styles.hospitalLogo}
        />
        <TouchableOpacity
          style={styles.bellBtn}
          onPress={() => router.push('/notifications')}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          activeOpacity={0.7}
        >
          <Feather name="bell" size={20} color="#1E293B" />
          <View style={styles.bellBadge} />
        </TouchableOpacity>
      </View>

      {/* Unified Single Profile Card */}
      <TouchableOpacity
        style={styles.agentCard}
        onPress={() => setIsDetailsModalOpen(true)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`Agent ${profile.name}, tap for full details`}
      >
        {/* Avatar with Camera Edit Badge */}
        <View style={styles.avatarWrapper}>
          <TouchableOpacity
            style={styles.agentAvatarContainer}
            onPress={handlePickAvatar}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Edit profile picture"
          >
            <Image
              source={
                avatarUri
                  ? { uri: avatarUri }
                  : require('@/../assets/default-clay-avatar.png')
              }
              style={styles.agentAvatar}
            />
          </TouchableOpacity>
          {/* Camera Edit Badge */}
          <TouchableOpacity
            style={styles.cameraBadge}
            onPress={handlePickAvatar}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Camera edit button"
          >
            <Feather name="camera" size={12} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.agentInfoCol}>
          <Text style={styles.agentName} numberOfLines={1}>
            {profile.name}
          </Text>

          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <View style={[styles.statusDot, { backgroundColor: statusConfig.dotColor }]} />
            <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
              {statusConfig.label}
            </Text>
          </View>

          <Text style={styles.agentRole}>{profile.isManager ? 'Manager' : 'Field Agent'}</Text>

          {territory ? (
            <View style={styles.agentLocationRow}>
              <Feather name="map-pin" size={12} color="#64748B" />
              <Text style={styles.agentLocationText}>{territory}</Text>
            </View>
          ) : null}
        </View>

        <Feather name="chevron-right" size={20} color="#CBD5E1" />
      </TouchableOpacity>

      {/* Distinct Operational Menu Items List */}
      <View style={styles.menuList}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuRow}
            onPress={item.action}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}: ${item.subtitle}`}
          >
            <View style={[styles.menuIconBox, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.icon} size={22} color={item.iconColor} />
            </View>

            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>

            <Feather name="chevron-right" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Action */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogoutConfirm}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Log out of application"
      >
        <Feather name="log-out" size={18} color="#EF4444" style={{ marginRight: 8 }} />
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>

      {/* Security & Version Footer */}
      <View style={styles.footerContainer}>
        <View style={styles.footerDivider} />
        <View style={styles.securityRow}>
          <Ionicons name="shield-checkmark" size={16} color="#10B981" />
          <Text style={styles.securityText}>100% Encrypted &amp; Secure • GBL Barala Hospital</Text>
        </View>
        <Text style={styles.versionText}>App Version v1.0.0 (Build 1)</Text>
      </View>

      {/* --- MODAL 1: Profile Details --- */}
      <Modal
        visible={isDetailsModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsDetailsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agent Information</Text>
              <TouchableOpacity
                onPress={() => setIsDetailsModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {detailRows.map((row) => (
                <View key={row.label} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{row.value}</Text>
                </View>
              ))}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Shift Status</Text>
                <Text style={[styles.infoValue, { color: statusConfig.textColor, fontWeight: '800' }]}>
                  {statusConfig.label}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL 2: Settings --- */}
      <Modal
        visible={isSettingsModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsSettingsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>App Settings</Text>
              <TouchableOpacity
                onPress={() => setIsSettingsModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.settingToggleRow}>
                <View>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingSub}>Receive daily visit alerts and task reminders</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                  thumbColor={notificationsEnabled ? '#0E70E3' : '#F1F5F9'}
                />
              </View>

              <View style={styles.settingToggleRow}>
                <View>
                  <Text style={styles.settingLabel}>Offline Auto-Sync</Text>
                  <Text style={styles.settingSub}>Sync queued outbox data every 60 seconds</Text>
                </View>
                <Switch
                  value={offlineSyncEnabled}
                  onValueChange={setOfflineSyncEnabled}
                  trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                  thumbColor={offlineSyncEnabled ? '#0E70E3' : '#F1F5F9'}
                />
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Language</Text>
                <Text style={styles.infoValue}>English (India)</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Database Storage</Text>
                <Text style={styles.infoValue}>SQLite Encrypted (Local)</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>App Build</Text>
                <Text style={styles.infoValue}>v1.0.0 (Production)</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL 3: Help & Support --- */}
      <Modal
        visible={isHelpModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsHelpModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Help &amp; Support</Text>
              <TouchableOpacity
                onPress={() => setIsHelpModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.helpIntro}>
                Need assistance with field visits, expense claims, or app features? Reach out to GBL Barala Hospital Field Operations:
              </Text>

              <TouchableOpacity
                style={styles.supportActionBtn}
                onPress={() => Linking.openURL('tel:1800123456')}
                activeOpacity={0.8}
              >
                <View style={styles.supportIconBox}>
                  <Ionicons name="call" size={20} color="#0E70E3" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.supportActionTitle}>24x7 Agent Helpline</Text>
                  <Text style={styles.supportActionSub}>Toll-Free: 1800-123-456</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.supportActionBtn}
                onPress={() => Linking.openURL('https://wa.me/919876543210')}
                activeOpacity={0.8}
              >
                <View style={[styles.supportIconBox, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="logo-whatsapp" size={20} color="#15803D" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.supportActionTitle}>WhatsApp Support</Text>
                  <Text style={styles.supportActionSub}>Live chat with Operations Desk</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.supportActionBtn}
                onPress={() => Linking.openURL('mailto:support@baralahospital.com')}
                activeOpacity={0.8}
              >
                <View style={[styles.supportIconBox, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="mail" size={20} color="#7C3AED" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.supportActionTitle}>Email Support</Text>
                  <Text style={styles.supportActionSub}>support@baralahospital.com</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFE',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110, // Account for floating bottom tab bar
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hospitalLogo: {
    width: 140,
    height: 40,
    resizeMode: 'contain',
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDF4FC',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EDF4FC',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  agentAvatarContainer: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#BAE6FD',
  },
  agentAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
    resizeMode: 'cover',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0E70E3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  agentInfoCol: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  agentRole: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  agentLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  agentLocationText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  menuList: {
    gap: 10,
    marginBottom: 20,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 18,
    paddingVertical: 14,
    marginBottom: 24,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
  footerContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  versionText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    gap: 14,
  },
  infoRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  settingToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  settingSub: {
    fontSize: 11,
    color: '#64748B',
    maxWidth: 240,
  },
  helpIntro: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 8,
  },
  supportActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  supportIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  supportActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  supportActionSub: {
    fontSize: 11,
    color: '#64748B',
  },
});
