import { apiClient } from '../client';
import { multipartConfig, appendFile, UploadFile } from '../multipart';

export type ExpenseType = 'HOTEL' | 'MEAL' | 'TRAVEL' | 'OTHER';

export interface CreateExpensePayload {
  amount: number | string;
  desc?: string;
  expenseType: ExpenseType;
  photos?: UploadFile[];
}

export interface ExpenseRecord {
  _id: string;
  userId?: string;
  amount: number;
  desc?: string;
  expenseType: ExpenseType;
  isApproved: boolean;
  photos?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface ListExpensesParams {
  userId?: string;
  isApproved?: boolean;
  expenseType?: ExpenseType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ListExpensesResponse {
  /** The server paginates: the page of expenses is `docs` (checked on production, 31 Oct 2026). */
  docs?: ExpenseRecord[];
  data?: ExpenseRecord[];
  total?: number;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export async function createExpenseDebit(payload: CreateExpensePayload): Promise<ExpenseRecord> {
  const form = new FormData();
  form.append('amount', String(payload.amount));
  form.append('expenseType', payload.expenseType);
  if (payload.desc) {
    form.append('desc', payload.desc);
  }

  if (payload.photos && payload.photos.length > 0) {
    payload.photos.forEach((photo, index) => {
      appendFile(form, 'photos', photo, `expense_receipt_${Date.now()}_${index}.jpg`);
    });
  }

  const response = await apiClient.post<ExpenseRecord>(
    '/api/v1/wallet-transaction/debit',
    form,
    multipartConfig
  );
  return response.data;
}

// The server default is 10 per page, which would cut the totals short.
const EXPENSES_PAGE_SIZE = 100;

export async function getExpensesList(params?: ListExpensesParams): Promise<ExpenseRecord[]> {
  const response = await apiClient.get<ListExpensesResponse | ExpenseRecord[]>(
    '/api/v1/wallet-transaction',
    { params: { limit: EXPENSES_PAGE_SIZE, ...params } }
  );
  return extractExpenses(response.data);
}

/** The page of expenses from a list response, whichever shape it has. */
export function extractExpenses(body: ListExpensesResponse | ExpenseRecord[] | null | undefined): ExpenseRecord[] {
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.docs)) return body.docs;
  if (body && Array.isArray(body.data)) return body.data;
  return [];
}

export async function getExpenseById(id: string): Promise<ExpenseRecord> {
  const response = await apiClient.get<ExpenseRecord>('/api/v1/wallet-transaction/profile', {
    params: { id },
  });
  return response.data;
}

export async function deleteExpense(id: string): Promise<void> {
  await apiClient.delete('/api/v1/wallet-transaction', {
    params: { id },
  });
}
