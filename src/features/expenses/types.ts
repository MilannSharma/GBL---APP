import { ExpenseType, ExpenseRecord } from '@/api/endpoints/expenses';

export type { ExpenseType, ExpenseRecord };

export interface ExpenseSummary {
  total: number;
  travel: number;
  meals: number;
  others: number;
}
