import type { AgentProfile } from '@/types';
import { buildProfileRows, formatTerritory } from './profile-details';

const profile: AgentProfile = {
  _id: 'abc',
  name: 'Aman',
  code: 'AGT-1',
  username: 'agent.user',
  contact: 9876543210,
  email: 'aman@example.com',
  isManager: false,
  assignedStates: ['RAJASTHAN', 'MADHYA PRADESH'],
};

describe('profile details', () => {
  it('lists the login account fields', () => {
    const rows = Object.fromEntries(buildProfileRows(profile).map((row) => [row.label, row.value]));
    expect(rows).toMatchObject({
      'Full Name': 'Aman',
      'Agent Code': 'AGT-1',
      Username: 'agent.user',
      'Phone Number': '9876543210',
      Email: 'aman@example.com',
      Role: 'Field Agent',
      'Assigned Territory': 'Rajasthan, Madhya Pradesh',
    });
  });

  it('leaves out what the server did not send instead of inventing it', () => {
    const labels = buildProfileRows({ _id: 'abc', name: 'Aman', isManager: true }).map((row) => row.label);
    expect(labels).toEqual(['Full Name', 'Role']);
  });

  it('has no territory without assigned states', () => {
    expect(formatTerritory({ ...profile, assignedStates: [] })).toBeNull();
    expect(formatTerritory({ ...profile, assignedStates: undefined })).toBeNull();
  });
});
