'use client';

import { useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { BoardAction } from '@/lib/board-reducer';
import type { Card, Column, Label } from '@/lib/types';

/** Subscribe to Postgres row changes for the board and feed them into the reducer. */
export function useRealtimeBoard(
  supabase: SupabaseClient | null,
  boardId: string,
  dispatch: (action: BoardAction) => void,
) {
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel(`board:${boardId}:rows`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cards', filter: `board_id=eq.${boardId}` },
        (payload) => {
          if (payload.eventType === 'DELETE') dispatch({ type: 'removeCard', id: (payload.old as Card).id });
          else dispatch({ type: 'upsertCard', card: payload.new as Card });
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'columns', filter: `board_id=eq.${boardId}` },
        (payload) => {
          if (payload.eventType === 'DELETE') dispatch({ type: 'removeColumn', id: (payload.old as Column).id });
          else dispatch({ type: 'upsertColumn', column: payload.new as Column });
        },
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'card_labels' }, (payload) => {
        if (payload.eventType === 'DELETE') dispatch({ type: 'removeLabel', id: (payload.old as Label).id });
        else dispatch({ type: 'upsertLabel', label: payload.new as Label });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, boardId, dispatch]);
}
