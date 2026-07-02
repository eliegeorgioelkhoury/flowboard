import type { BoardData } from './types';

/** The seeded public demo board's id (matches supabase/seed.sql). */
export const DEMO_BOARD_ID = '11111111-1111-1111-1111-111111111111';

/**
 * Static board used as a fallback when Supabase isn't configured (e.g. local
 * visual preview). It mirrors the shape of the seeded demo board so the UI
 * renders fully without a backend; realtime + persistence require Supabase.
 */
export const DEMO_BOARD: BoardData = {
  board: { id: DEMO_BOARD_ID, title: 'Product launch', is_demo: true },
  columns: [
    { id: 'col-todo', board_id: DEMO_BOARD_ID, title: 'To do', position: 1000 },
    { id: 'col-doing', board_id: DEMO_BOARD_ID, title: 'In progress', position: 2000 },
    { id: 'col-done', board_id: DEMO_BOARD_ID, title: 'Done', position: 3000 },
  ],
  cards: [
    { id: 'card-1', column_id: 'col-todo', board_id: DEMO_BOARD_ID, title: 'Draft the launch announcement', description: 'Blog post + social copy.', position: 1000, assignee: 'Mira', due_date: '2026-07-10' },
    { id: 'card-2', column_id: 'col-todo', board_id: DEMO_BOARD_ID, title: 'Finalize pricing tiers', description: null, position: 2000, assignee: null, due_date: null },
    { id: 'card-3', column_id: 'col-todo', board_id: DEMO_BOARD_ID, title: 'Record the demo GIF', description: 'Show the drag + live cursors.', position: 3000, assignee: 'Theo', due_date: null },
    { id: 'card-4', column_id: 'col-doing', board_id: DEMO_BOARD_ID, title: 'Wire realtime presence', description: 'Names + per-user colours.', position: 1000, assignee: 'Mira', due_date: '2026-07-05' },
    { id: 'card-5', column_id: 'col-doing', board_id: DEMO_BOARD_ID, title: 'Polish the empty states', description: null, position: 2000, assignee: null, due_date: null },
    { id: 'card-6', column_id: 'col-done', board_id: DEMO_BOARD_ID, title: 'Set up the Supabase schema', description: 'Boards, columns, cards, labels + RLS.', position: 1000, assignee: 'Theo', due_date: null },
  ],
  labels: [
    { id: 'lbl-1', card_id: 'card-1', label: 'marketing', color: 'rose' },
    { id: 'lbl-2', card_id: 'card-4', label: 'engineering', color: 'cyan' },
    { id: 'lbl-3', card_id: 'card-4', label: 'realtime', color: 'violet' },
    { id: 'lbl-4', card_id: 'card-6', label: 'engineering', color: 'cyan' },
  ],
};
