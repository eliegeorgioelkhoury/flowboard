import 'server-only';
import type { BoardData, Card, Column, Label } from './types';
import { DEMO_BOARD, DEMO_BOARD_ID } from './demo-data';
import { isSupabaseConfigured } from './supabase/config';
import { createServerSupabase } from './supabase/server';

export interface LoadResult {
  data: BoardData;
  live: boolean; // true when served from Supabase (realtime available)
}

/** Load the public demo board server-side; fall back to static seed data if Supabase is absent. */
export async function loadDemoBoard(): Promise<LoadResult> {
  if (!isSupabaseConfigured()) {
    return { data: DEMO_BOARD, live: false };
  }

  try {
    const supabase = await createServerSupabase();
    const [{ data: board }, { data: columns }, { data: cards }] = await Promise.all([
      supabase.from('boards').select('id,title,is_demo').eq('id', DEMO_BOARD_ID).single(),
      supabase.from('columns').select('*').eq('board_id', DEMO_BOARD_ID).order('position'),
      supabase.from('cards').select('*').eq('board_id', DEMO_BOARD_ID).order('position'),
    ]);

    if (!board) {
      return { data: DEMO_BOARD, live: false };
    }

    const cardRows = (cards ?? []) as Card[];
    const cardIds = cardRows.map((c) => c.id);
    const { data: labels } = cardIds.length
      ? await supabase.from('card_labels').select('*').in('card_id', cardIds)
      : { data: [] as Label[] };

    return {
      data: {
        board: board as BoardData['board'],
        columns: (columns ?? []) as Column[],
        cards: cardRows,
        labels: (labels ?? []) as Label[],
      },
      live: true,
    };
  } catch {
    return { data: DEMO_BOARD, live: false };
  }
}
