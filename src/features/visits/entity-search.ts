import { HospitalEntity } from './types';

const MAX_RESULTS = 20;

/**
 * Case-insensitive "contains" match on the hospital name: every typed word must appear somewhere
 * in the name (start, middle or end). Names that start with the text come first.
 */
export function matchEntities(entities: HospitalEntity[], term: string): HospitalEntity[] {
  const words = term.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const scored: Array<{ entity: HospitalEntity; startsWith: boolean }> = [];
  for (const entity of entities) {
    const name = entity.name.toLowerCase();
    if (words.every((word) => name.includes(word))) {
      scored.push({ entity, startsWith: name.startsWith(words[0]) });
    }
  }
  scored.sort((a, b) => Number(b.startsWith) - Number(a.startsWith) || a.entity.name.localeCompare(b.entity.name));
  return scored.slice(0, MAX_RESULTS).map((item) => item.entity);
}
