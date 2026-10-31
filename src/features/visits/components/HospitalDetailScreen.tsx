import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { t } from '@/core/i18n';
import { logger } from '@/core/logger';
import { colors } from '@/core/theme/colors';
import { radii, spacing } from '@/core/theme/spacing';
import { useCurrentAgentId } from '../hooks/useCurrentAgentId';
import { useEntityContacts, useEntityVisits } from '../hooks/useEntityQueries';
import { HospitalEntity, HospitalVisit } from '../types';
import { AddContactModal } from './AddContactModal';
import { OwnVisitExtras } from './OwnVisitExtras';

export interface HospitalDetailScreenProps {
  entity: HospitalEntity;
  onBack: () => void;
}

/** Opens the phone dialer; the number is kept as typed apart from spaces and dashes. */
function dial(phone: string): void {
  const number = phone.replace(/[^\d+]/g, '');
  Linking.openURL(`tel:${number}`).catch((error: unknown) => {
    logger.warn('Could not open the dialer', { error: error instanceof Error ? error.message : String(error) });
  });
}

function SectionState({ isLoading, isError, isEmpty, emptyText, onRetry }: {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  emptyText: string;
  onRetry: () => void;
}) {
  if (isLoading) return <ActivityIndicator color={colors.primary} style={styles.loader} />;
  if (isError) {
    return (
      <TouchableOpacity onPress={onRetry} accessibilityRole="button" accessibilityLabel={t('common.retry')} style={styles.retry}>
        <Text style={styles.errorText}>{t('visits.hospital.loadError')} {t('common.retry')}</Text>
      </TouchableOpacity>
    );
  }
  return isEmpty ? <Text style={styles.emptyText}>{emptyText}</Text> : null;
}

function VisitEntry({ visit, currentAgentId }: { visit: HospitalVisit; currentAgentId: string | null }) {
  const isMine = Boolean(currentAgentId) && visit.agentId === currentAgentId;
  const met = [visit.contactName, visit.contactPhone, visit.contactRole].filter(Boolean).join(' • ');

  return (
    <View style={styles.visitCard}>
      {/* Top Row: Agent Badge & Timestamp */}
      <View style={styles.visitTopRow}>
        <View style={[styles.visitAgentBadge, isMine && styles.visitAgentBadgeMine]}>
          <Ionicons
            name={isMine ? 'checkmark-circle' : 'person-circle'}
            size={14}
            color={isMine ? colors.success : colors.primary}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.visitAgentText, isMine && styles.visitAgentMine]} numberOfLines={1}>
            {isMine ? t('visits.hospital.you') : visit.agentName ?? '-'}
          </Text>
        </View>
        <View style={styles.visitTimeRow}>
          <Ionicons name="time-outline" size={13} color={colors.textMuted} style={{ marginRight: 4 }} />
          <Text style={styles.visitDateText}>{visit.date}, {visit.time}</Text>
        </View>
      </View>

      {/* Met With Details Block */}
      {met ? (
        <View style={styles.metContainer}>
          <Ionicons name="people-outline" size={14} color={colors.primary} style={styles.metIcon} />
          <View style={styles.metBody}>
            <Text style={styles.metLabel}>{t('visits.hospital.metWith')}:</Text>
            <Text style={styles.metValue}>{met}</Text>
            {visit.contactRoleDesc ? (
              <Text style={styles.visitMuted}>{visit.contactRoleDesc}</Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {/* Remark Bubble */}
      <View style={styles.remarkContainer}>
        <Ionicons name="chatbubble-ellipses-outline" size={13} color={colors.textMuted} style={styles.remarkIcon} />
        <View style={styles.remarkBody}>
          <Text style={styles.remarkLabel}>{t('visits.detail.remark')}:</Text>
          <Text style={styles.remarkText}>
            {visit.remark || t('visits.detail.noRemark')}
          </Text>
        </View>
      </View>

      {isMine ? <OwnVisitExtras visitId={visit.id} /> : null}
    </View>
  );
}

/** The single place for a hospital: its info, every saved contact, and each agent visit with the details. */
export function HospitalDetailScreen({ entity, onBack }: HospitalDetailScreenProps) {
  const contacts = useEntityContacts(entity.id);
  const visits = useEntityVisits(entity.id);
  const currentAgentId = useCurrentAgentId();
  const [isAddingContact, setIsAddingContact] = useState(false);

  const locationSubtitle = [entity.city, entity.state].filter(Boolean).join(', ');

  return (
    <Screen scrollable={false} style={styles.screen}>
      {/* Custom Polished Header with Floating Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>{t('visits.hospital.title')}</Text>
          {locationSubtitle ? (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {locationSubtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hospital Card */}
        <View style={styles.hospitalCard}>
          <View style={styles.hospitalIconWrap}>
            <Image
              source={require('../../../../assets/hospital-building.png')}
              style={styles.hospitalIcon}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </View>
          <View style={styles.hospitalBody}>
            <Text style={styles.hospitalName} numberOfLines={2}>{entity.name}</Text>
            {entity.hospitalType ? (
              <View style={styles.typeBadge}>
                <Ionicons name="medical" size={11} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.typeBadgeText}>{entity.hospitalType}</Text>
              </View>
            ) : null}
            {entity.address ? (
              <View style={styles.addressRow}>
                <Ionicons name="location-sharp" size={13} color={colors.textMuted} style={styles.addressIcon} />
                <Text style={styles.addressText} numberOfLines={2}>{entity.address}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Contacts Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIconWrap}>
              <Ionicons name="people" size={15} color={colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>{t('visits.hospital.contactsTitle')}</Text>
            {contacts.data && contacts.data.length > 0 ? (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{contacts.data.length}</Text>
              </View>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() => setIsAddingContact(true)}
            style={styles.addContactBtn}
            accessibilityRole="button"
            accessibilityLabel={t('visits.hospital.addContact')}
            activeOpacity={0.7}
          >
            <Ionicons name="person-add" size={13} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.addContactBtnText}>{t('visits.hospital.addContact')}</Text>
          </TouchableOpacity>
        </View>

        <SectionState
          isLoading={contacts.isLoading}
          isError={contacts.isError}
          isEmpty={contacts.data?.length === 0}
          emptyText={t('visits.hospital.contactsEmpty')}
          onRetry={() => void contacts.refetch()}
        />

        {/* Contacts List Cards */}
        {contacts.data?.map((contact) => (
          <View key={contact.id} style={styles.contactCard}>
            <View style={styles.contactAvatar}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
            <View style={styles.contactBody}>
              <View style={styles.contactNameRow}>
                <Text style={styles.contactName} numberOfLines={1}>{contact.name}</Text>
                {contact.role ? (
                  <View style={styles.roleChip}>
                    <Text style={styles.roleChipText} numberOfLines={1}>{contact.role}</Text>
                  </View>
                ) : null}
              </View>
              {contact.phone ? (
                <View style={styles.contactPhoneRow}>
                  <Ionicons name="call-outline" size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
                  <Text style={styles.contactPhoneText}>{contact.phone}</Text>
                </View>
              ) : null}
              {contact.email ? (
                <View style={styles.contactPhoneRow}>
                  <Ionicons name="mail-outline" size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
                  <Text style={styles.contactEmailText} numberOfLines={1}>{contact.email}</Text>
                </View>
              ) : null}
            </View>
            {contact.phone ? (
              <TouchableOpacity
                style={styles.callActionButton}
                onPress={() => dial(contact.phone as string)}
                accessibilityRole="button"
                accessibilityLabel={`${t('visits.hospital.call')} ${contact.name}`}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={18} color={colors.white} />
              </TouchableOpacity>
            ) : null}
          </View>
        ))}

        {/* Visits History Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionIconWrap, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="footsteps" size={15} color={colors.success} />
            </View>
            <Text style={styles.sectionTitle}>{t('visits.hospital.visitsTitle')}</Text>
            {visits.data && visits.data.length > 0 ? (
              <View style={[styles.countBadge, { backgroundColor: '#F0FDF4' }]}>
                <Text style={[styles.countBadgeText, { color: colors.success }]}>{visits.data.length}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <SectionState
          isLoading={visits.isLoading}
          isError={visits.isError}
          isEmpty={visits.data?.length === 0}
          emptyText={t('visits.hospital.visitsEmpty')}
          onRetry={() => void visits.refetch()}
        />

        {/* Visits History List */}
        {visits.data?.map((visit) => (
          <VisitEntry key={visit.id} visit={visit} currentAgentId={currentAgentId} />
        ))}
      </ScrollView>

      <AddContactModal entityId={entity.id} visible={isAddingContact} onClose={() => setIsAddingContact(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 0,
    backgroundColor: '#F8FBFE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF4FC',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDF4FC',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginRight: 12,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 1,
  },
  content: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxl + 20,
  },
  hospitalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E8F1FC',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  hospitalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  hospitalIcon: {
    width: 48,
    height: 48,
  },
  hospitalBody: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
    marginBottom: 5,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 5,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    marginRight: 4,
    marginTop: 2,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
    paddingHorizontal: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  countBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radii.chip,
    marginLeft: 6,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  addContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.chip,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  addContactBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    marginTop: spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDF4FC',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  contactBody: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  contactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  roleChip: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  contactPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  contactPhoneText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  contactEmailText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  callActionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 3,
    marginLeft: 6,
  },
  visitCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: '#EDF4FC',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  visitTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  visitAgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  visitAgentBadgeMine: {
    backgroundColor: '#F0FDF4',
  },
  visitAgentText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  visitAgentMine: {
    color: colors.success,
  },
  visitTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visitDateText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  metContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: spacing.sm,
    borderRadius: 10,
    marginBottom: spacing.xs,
  },
  metIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  metBody: {
    flex: 1,
  },
  metLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  metValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    lineHeight: 18,
  },
  visitMuted: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  remarkContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: spacing.sm,
    borderRadius: 10,
  },
  remarkIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  remarkBody: {
    flex: 1,
  },
  remarkLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  remarkText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  loader: {
    marginVertical: spacing.md,
  },
  retry: {
    minHeight: 44,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 13,
    color: colors.danger,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});
