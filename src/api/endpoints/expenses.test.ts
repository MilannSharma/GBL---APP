import { extractExpenses, ExpenseRecord } from './expenses';

jest.mock('../client', () => ({ apiClient: {} }));

const expense = { _id: '1', amount: 10, expenseType: 'MEAL', isApproved: false, createdAt: '2026-10-31' } as ExpenseRecord;

describe('extractExpenses', () => {
  it('reads the page from docs, the shape the server returns', () => {
    expect(extractExpenses({ docs: [expense], totalDocs: 1 })).toEqual([expense]);
  });

  it('still accepts a bare array or data', () => {
    expect(extractExpenses([expense])).toEqual([expense]);
    expect(extractExpenses({ data: [expense] })).toEqual([expense]);
  });

  it('returns an empty list for anything else', () => {
    expect(extractExpenses(undefined)).toEqual([]);
    expect(extractExpenses({})).toEqual([]);
  });
});
