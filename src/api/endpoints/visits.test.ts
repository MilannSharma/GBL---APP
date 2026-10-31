import { buildCreateVisitForm, CreateVisitRequest } from './visits';

jest.mock('../client', () => ({ apiClient: {} }));

const base = { latitude: '26.86', longitude: '75.72', selfie: { uri: 'file:///selfie.jpg' } };
const build = (extra: Record<string, unknown>) => buildCreateVisitForm({ ...base, ...extra } as CreateVisitRequest);

describe('buildCreateVisitForm', () => {
  it('needs exactly one of entityId or entity', () => {
    expect(() => build({ entityContactId: 'c' })).toThrow();
    expect(() => build({ entityId: 'e', entity: { name: 'X' }, entityContactId: 'c' })).toThrow();
  });

  it('needs exactly one of entityContactId or entityContact', () => {
    expect(() => build({ entityId: 'e' })).toThrow();
  });

  it('sends the location as one JSON text field', () => {
    const form = build({ entityId: 'e', entityContactId: 'c', accuracy: '10' });
    expect(form.get('entityId')).toBe('e');
    expect(JSON.parse(String(form.get('location')))).toEqual({
      latitude: '26.86',
      longitude: '75.72',
      accuracy: '10',
    });
  });
});
