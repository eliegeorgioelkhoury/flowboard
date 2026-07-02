import { describe, expect, it } from 'vitest';
import { boardReducer, cardsByColumn, labelsForCard, type BoardState } from '@/lib/board-reducer';
import type { Card } from '@/lib/types';

const base = (): BoardState => ({
  columns: [
    { id: 'a', board_id: 'b', title: 'A', position: 1000 },
    { id: 'c', board_id: 'b', title: 'C', position: 2000 },
  ],
  cards: [
    { id: 'x', column_id: 'a', board_id: 'b', title: 'X', description: null, position: 1000, assignee: null, due_date: null },
    { id: 'y', column_id: 'a', board_id: 'b', title: 'Y', description: null, position: 2000, assignee: null, due_date: null },
  ],
  labels: [{ id: 'l1', card_id: 'x', label: 'foo', color: 'violet' }],
});

describe('boardReducer', () => {
  it('moveCard changes column and position', () => {
    const s = boardReducer(base(), { type: 'moveCard', cardId: 'x', toColumnId: 'c', position: 500 });
    const card = s.cards.find((c) => c.id === 'x')!;
    expect(card.column_id).toBe('c');
    expect(card.position).toBe(500);
  });

  it('upsertCard inserts a new card and replaces an existing one', () => {
    const newCard: Card = {
      id: 'z', column_id: 'a', board_id: 'b', title: 'Z', description: null, position: 3000, assignee: null, due_date: null,
    };
    const s1 = boardReducer(base(), { type: 'upsertCard', card: newCard });
    expect(s1.cards).toHaveLength(3);
    const s2 = boardReducer(s1, { type: 'upsertCard', card: { ...newCard, title: 'Z2' } });
    expect(s2.cards).toHaveLength(3);
    expect(s2.cards.find((c) => c.id === 'z')!.title).toBe('Z2');
  });

  it('removeCard also drops the card labels', () => {
    const s = boardReducer(base(), { type: 'removeCard', id: 'x' });
    expect(s.cards.find((c) => c.id === 'x')).toBeUndefined();
    expect(s.labels.find((l) => l.card_id === 'x')).toBeUndefined();
  });

  it('updateCard patches the given fields', () => {
    const s = boardReducer(base(), { type: 'updateCard', id: 'y', fields: { assignee: 'Mira' } });
    expect(s.cards.find((c) => c.id === 'y')!.assignee).toBe('Mira');
  });

  it('removeColumn drops the column and its cards', () => {
    const s = boardReducer(base(), { type: 'removeColumn', id: 'a' });
    expect(s.columns.find((c) => c.id === 'a')).toBeUndefined();
    expect(s.cards.filter((c) => c.column_id === 'a')).toHaveLength(0);
  });

  it('does not mutate the input state (optimistic-safe)', () => {
    const s0 = base();
    boardReducer(s0, { type: 'moveCard', cardId: 'x', toColumnId: 'c', position: 5 });
    expect(s0.cards.find((c) => c.id === 'x')!.column_id).toBe('a');
  });
});

describe('selectors', () => {
  it('cardsByColumn filters and sorts by position', () => {
    const s = base();
    expect(cardsByColumn(s, 'a').map((c) => c.id)).toEqual(['x', 'y']);
    expect(cardsByColumn(s, 'c')).toHaveLength(0);
  });

  it('labelsForCard filters to the card', () => {
    expect(labelsForCard(base(), 'x')).toHaveLength(1);
    expect(labelsForCard(base(), 'y')).toHaveLength(0);
  });
});
