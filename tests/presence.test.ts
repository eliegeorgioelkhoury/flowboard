import { describe, expect, it } from 'vitest';
import { accentForIndex, randomName } from '@/lib/presence';
import { PRESENCE_ACCENTS } from '@/lib/types';

describe('accentForIndex', () => {
  it('cycles through the four accents', () => {
    expect(accentForIndex(0)).toBe('violet');
    expect(accentForIndex(1)).toBe('cyan');
    expect(accentForIndex(2)).toBe('rose');
    expect(accentForIndex(3)).toBe('amber');
    expect(accentForIndex(4)).toBe('violet');
  });

  it('handles negative indices', () => {
    expect(PRESENCE_ACCENTS).toContain(accentForIndex(-1));
  });
});

describe('randomName', () => {
  it('is deterministic given a seeded rand', () => {
    expect(randomName(() => 0)).toBe('Swift Otter');
  });

  it('produces "Adjective Animal"', () => {
    expect(randomName(() => 0.5)).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
  });
});
