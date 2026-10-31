import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  getExpensesList,
  createExpenseDebit,
  ExpenseRecord,
  CreateExpensePayload,
} from '@/api/endpoints/expenses';
import { ExpenseSummary } from '../types';
import { logger } from '@/core/logger';

export function useExpenses() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bumping the key reloads the list (pull to refresh); the first load runs on mount.
  const [reloadKey, setReloadKey] = useState(0);
  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    getExpensesList()
      .then((data) => {
        if (!isCancelled) setExpenses(data);
      })
      .catch((err: unknown) => {
        // Offline or failed: keep the records already on screen.
        logger.warn('Failed to fetch expenses list', { error: String(err) });
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [reloadKey]);

  const summary = useMemo<ExpenseSummary>(() => {
    let travel = 0;
    let meals = 0;
    let others = 0;

    for (const exp of expenses) {
      const amt = Number(exp.amount) || 0;
      if (exp.expenseType === 'TRAVEL') {
        travel += amt;
      } else if (exp.expenseType === 'MEAL') {
        meals += amt;
      } else {
        others += amt;
      }
    }

    return {
      total: travel + meals + others,
      travel,
      meals,
      others,
    };
  }, [expenses]);

  const addExpense = useCallback(
    async (payload: CreateExpensePayload): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const created = await createExpenseDebit(payload);
        setExpenses((prev) => [created, ...prev]);
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to submit expense';
        setError(msg);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return {
    expenses,
    summary,
    isLoading,
    isSubmitting,
    error,
    refresh,
    addExpense,
  };
}
