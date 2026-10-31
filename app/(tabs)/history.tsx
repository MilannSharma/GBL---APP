import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import {
  useExpenses,
  ExpenseCard,
  AddExpenseModal,
} from '@/features/expenses';

export default function ExpensesRoute() {
  const router = useRouter();
  const { expenses, summary, isLoading, refresh, addExpense } = useExpenses();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'This Month' | 'Today' | 'All'>('This Month');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} colors={['#0E70E3']} />}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Expenses</Text>
            <Text style={styles.headerSubtitle}>Track and manage your expenses</Text>
          </View>
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

        {/* Hero Card: Total Expenses */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.walletIconBox}>
              <Ionicons name="wallet-outline" size={26} color="#0E70E3" />
            </View>

            <TouchableOpacity
              style={styles.periodPill}
              onPress={() => {
                setSelectedPeriod((prev) =>
                  prev === 'This Month' ? 'Today' : prev === 'Today' ? 'All' : 'This Month'
                );
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.periodText}>{selectedPeriod}</Text>
              <Feather name="chevron-down" size={14} color="#0E70E3" />
            </TouchableOpacity>
          </View>

          <Text style={styles.heroSub}>Total Expenses</Text>
          <Text style={styles.heroTotal}>
            ₹ {summary.total.toLocaleString('en-IN')}
          </Text>

          {/* Breakdown Columns */}
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownCol}>
              <View style={styles.breakdownIndicatorBlue} />
              <View>
                <Text style={styles.breakdownAmt}>
                  ₹ {summary.travel.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.breakdownLabel}>Travel</Text>
              </View>
            </View>

            <View style={styles.columnDivider} />

            <View style={styles.breakdownCol}>
              <View style={styles.breakdownIndicatorGreen} />
              <View>
                <Text style={styles.breakdownAmt}>
                  ₹ {summary.meals.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.breakdownLabel}>Meals</Text>
              </View>
            </View>

            <View style={styles.columnDivider} />

            <View style={styles.breakdownCol}>
              <View style={styles.breakdownIndicatorAmber} />
              <View>
                <Text style={styles.breakdownAmt}>
                  ₹ {summary.others.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.breakdownLabel}>Others</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Button: + Add Expense */}
        <TouchableOpacity
          style={styles.addExpenseBtn}
          onPress={() => setIsAddModalOpen(true)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Add Expense"
        >
          <Feather name="plus" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.addExpenseBtnText}>Add Expense</Text>
        </TouchableOpacity>

        {/* Recent Expenses Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All &gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Expenses List */}
        {expenses.length === 0 && !isLoading ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="receipt-outline" size={32} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>No Expenses Recorded</Text>
            <Text style={styles.emptyDesc}>
              Tap the &quot;Add Expense&quot; button above to record your travel, meal, or other field expenses.
            </Text>
          </View>
        ) : (
          expenses.map((item) => (
            <ExpenseCard key={item._id} expense={item} />
          ))
        )}
      </ScrollView>

      {/* Add Expense Bottom Sheet Modal */}
      <AddExpenseModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addExpense}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FBFE',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FBFE',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110, // Account for floating bottom tab bar
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
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
  heroCard: {
    backgroundColor: '#EDF5FD',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#DCEBFA',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  walletIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#DDEEFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCEBFA',
  },
  periodText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0E70E3',
  },
  heroSub: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  heroTotal: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 18,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#DBEAFE',
  },
  breakdownCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breakdownIndicatorBlue: {
    width: 3,
    height: 24,
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  breakdownIndicatorGreen: {
    width: 3,
    height: 24,
    backgroundColor: '#059669',
    borderRadius: 2,
  },
  breakdownIndicatorAmber: {
    width: 3,
    height: 24,
    backgroundColor: '#D97706',
    borderRadius: 2,
  },
  breakdownAmt: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  columnDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#CBD5E1',
    opacity: 0.5,
  },
  addExpenseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E70E3',
    paddingVertical: 15,
    borderRadius: 18,
    marginBottom: 24,
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  addExpenseBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0E70E3',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
