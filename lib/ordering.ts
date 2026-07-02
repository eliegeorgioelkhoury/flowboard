/** Fractional positioning for drag-and-drop reordering (insert between neighbours, no renumber). */

export const POSITION_GAP = 1000;

export function sortByPosition<T extends { position: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.position - b.position);
}

/**
 * Position for placing an item at `index` within `sorted` (the moving item excluded,
 * items sorted ascending by position). `index` ranges over [0, sorted.length].
 */
export function positionForIndex(sorted: { position: number }[], index: number): number {
  const clamped = Math.max(0, Math.min(index, sorted.length));
  const before = clamped > 0 ? sorted[clamped - 1].position : undefined;
  const after = clamped < sorted.length ? sorted[clamped].position : undefined;

  if (before === undefined && after === undefined) return POSITION_GAP;
  if (before === undefined) return after! - POSITION_GAP;
  if (after === undefined) return before + POSITION_GAP;
  return (before + after) / 2;
}
