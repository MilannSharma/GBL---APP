import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ExpenseRecord, ExpenseType } from '@/api/endpoints/expenses';

interface ExpenseCardProps {
  expense: ExpenseRecord;
  onPress?: () => void;
}

interface CategoryVisual {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  bgColor: string;
  iconColor: string;
}

const CATEGORY_MAP: Record<ExpenseType, CategoryVisual> = {
  TRAVEL: {
    icon: 'airplane',
    label: 'Travel',
    bgColor: '#EFF6FF',
    iconColor: '#2563EB',
  },
  MEAL: {
    icon: 'restaurant',
    label: 'Meals',
    bgColor: '#ECFDF5',
    iconColor: '#059669',
  },
  HOTEL: {
    icon: 'bed',
    label: 'Hotel / Stay',
    bgColor: '#F5F3FF',
    iconColor: '#7C3AED',
  },
  OTHER: {
    icon: 'document-text',
    label: 'Others',
    bgColor: '#FFFBEB',
    iconColor: '#D97706',
  },
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function ExpenseCard({ expense, onPress }: ExpenseCardProps) {
  const visual = CATEGORY_MAP[expense.expenseType] || CATEGORY_MAP.OTHER;
  const title = expense.desc?.trim() || `${visual.label} Expense`;
  const dateFormatted = formatDate(expense.createdAt);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${title}, Amount: ₹${expense.amount}`}
    >
      <View style={[styles.iconCircle, { backgroundColor: visual.bgColor }]}>
        <Ionicons name={visual.icon} size={22} color={visual.iconColor} />
      </View>

      <View style={styles.detailsCol}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.categorySub}>{visual.label}</Text>
        <View style={styles.dateRow}>
          <Feather name="calendar" size={12} color="#94A3B8" />
          <Text style={styles.dateText}>{dateFormatted}</Text>
        </View>
      </View>

      <View style={styles.amountCol}>
        <Text style={styles.amountText}>₹ {Number(expense.amount).toLocaleString('en-IN')}</Text>
        <View
          style={[
            styles.statusPill,
            expense.isApproved ? styles.approvedPill : styles.pendingPill,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              expense.isApproved ? styles.approvedText : styles.pendingText,
            ]}
          >
            {expense.isApproved ? 'Approved' : 'Pending'}
          </Text>
        </View>
      </View>

      <Feather name="chevron-right" size={18} color="#CBD5E1" style={styles.chevron} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  detailsCol: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  categorySub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  amountCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 6,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  approvedPill: {
    backgroundColor: '#DCFCE7',
  },
  pendingPill: {
    backgroundColor: '#E0F2FE',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  approvedText: {
    color: '#15803D',
  },
  pendingText: {
    color: '#0284C7',
  },
  chevron: {
    marginLeft: 4,
  },
});
