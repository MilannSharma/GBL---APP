import { AgentProfile } from '@/types';

export interface ProfileDetailRow {
  label: string;
  value: string;
}

/** "RAJASTHAN" -> "Rajasthan"; the server stores states in capitals. */
function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');
}

/** Assigned states of the agent as one line, or null when none are assigned. */
export function formatTerritory(profile: AgentProfile): string | null {
  const states = (profile.assignedStates ?? []).filter((state) => state.trim() !== '');
  return states.length ? states.map(titleCase).join(', ') : null;
}

/**
 * Rows of the Agent Information sheet, straight from the login account.
 * A field the server did not send is left out instead of being filled with a placeholder.
 */
export function buildProfileRows(profile: AgentProfile): ProfileDetailRow[] {
  const rows: [string, string | null | undefined][] = [
    ['Full Name', profile.name],
    ['Agent Code', profile.code],
    ['Username', profile.username],
    ['Phone Number', profile.contact != null ? String(profile.contact) : null],
    ['Email', profile.email],
    ['Role', profile.isManager ? 'Manager' : 'Field Agent'],
    ['Assigned Territory', formatTerritory(profile)],
  ];
  return rows
    .filter((row): row is [string, string] => typeof row[1] === 'string' && row[1].trim() !== '')
    .map(([label, value]) => ({ label, value }));
}
