export interface Card {
  id: string;
  column_id: string;
  board_id: string;
  title: string;
  description: string | null;
  position: number;
  assignee: string | null;
  due_date: string | null;
}

export interface Column {
  id: string;
  board_id: string;
  title: string;
  position: number;
}

export interface Label {
  id: string;
  card_id: string;
  label: string;
  color: string;
}

export interface Board {
  id: string;
  title: string;
  is_demo: boolean;
}

export interface BoardData {
  board: Board;
  columns: Column[];
  cards: Card[];
  labels: Label[];
}

/** Accent palette used to colour each present collaborator (cursors, avatars). */
export const PRESENCE_ACCENTS = ['violet', 'cyan', 'rose', 'amber'] as const;
export type PresenceAccent = (typeof PRESENCE_ACCENTS)[number];
