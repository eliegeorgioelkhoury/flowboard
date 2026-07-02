import { describe, expect, it } from 'vitest';
import { POSITION_GAP, positionForIndex, sortByPosition } from '@/lib/ordering';

describe('positionForIndex', () => {
  it('empty column → the default gap', () => {
    expect(positionForIndex([], 0)).toBe(POSITION_GAP);
  });

  it('insert at the start → before the first', () => {
    expect(positionForIndex([{ position: 1000 }, { position: 2000 }], 0)).toBe(1000 - POSITION_GAP);
  });

  it('insert at the end → after the last', () => {
    expect(positionForIndex([{ position: 1000 }, { position: 2000 }], 2)).toBe(2000 + POSITION_GAP);
  });

  it('insert in the middle → the midpoint', () => {
    expect(positionForIndex([{ position: 1000 }, { position: 2000 }], 1)).toBe(1500);
  });

  it('clamps an out-of-range index', () => {
    expect(positionForIndex([{ position: 1000 }], 99)).toBe(2000);
    expect(positionForIndex([{ position: 1000 }], -5)).toBe(0);
  });
});

describe('sortByPosition', () => {
  it('sorts ascending without mutating the input', () => {
    const input = [{ position: 3 }, { position: 1 }, { position: 2 }];
    expect(sortByPosition(input).map((x) => x.position)).toEqual([1, 2, 3]);
    expect(input[0].position).toBe(3);
  });
});
