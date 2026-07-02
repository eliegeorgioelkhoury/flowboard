import type { Card, Column, Label } from './types';
import { sortByPosition } from './ordering';

export interface BoardState {
  columns: Column[];
  cards: Card[];
  labels: Label[];
}

export type BoardAction =
  | { type: 'moveCard'; cardId: string; toColumnId: string; position: number }
  | { type: 'upsertCard'; card: Card }
  | { type: 'removeCard'; id: string }
  | { type: 'updateCard'; id: string; fields: Partial<Card> }
  | { type: 'upsertColumn'; column: Column }
  | { type: 'removeColumn'; id: string }
  | { type: 'upsertLabel'; label: Label }
  | { type: 'removeLabel'; id: string }
  | { type: 'reset'; state: BoardState };

function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx === -1) return [...list, item];
  const next = list.slice();
  next[idx] = item;
  return next;
}

/** Pure board state transitions — shared by optimistic local edits and realtime events. */
export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'moveCard':
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.cardId ? { ...c, column_id: action.toColumnId, position: action.position } : c,
        ),
      };
    case 'upsertCard':
      return { ...state, cards: upsert(state.cards, action.card) };
    case 'removeCard':
      return {
        ...state,
        cards: state.cards.filter((c) => c.id !== action.id),
        labels: state.labels.filter((l) => l.card_id !== action.id),
      };
    case 'updateCard':
      return {
        ...state,
        cards: state.cards.map((c) => (c.id === action.id ? { ...c, ...action.fields } : c)),
      };
    case 'upsertColumn':
      return { ...state, columns: upsert(state.columns, action.column) };
    case 'removeColumn':
      return {
        ...state,
        columns: state.columns.filter((c) => c.id !== action.id),
        cards: state.cards.filter((c) => c.column_id !== action.id),
      };
    case 'upsertLabel':
      return { ...state, labels: upsert(state.labels, action.label) };
    case 'removeLabel':
      return { ...state, labels: state.labels.filter((l) => l.id !== action.id) };
    case 'reset':
      return action.state;
    default:
      return state;
  }
}

export function sortedColumns(state: BoardState): Column[] {
  return sortByPosition(state.columns);
}

export function cardsByColumn(state: BoardState, columnId: string): Card[] {
  return sortByPosition(state.cards.filter((c) => c.column_id === columnId));
}

export function labelsForCard(state: BoardState, cardId: string): Label[] {
  return state.labels.filter((l) => l.card_id === cardId);
}
