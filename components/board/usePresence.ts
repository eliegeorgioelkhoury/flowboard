'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { accentForIndex, randomName, type Identity } from '@/lib/presence';

export interface RemotePeer extends Identity {
  cursor: { x: number; y: number } | null;
  dragging: boolean;
}

function makeIdentity(): Identity {
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  return { id, name: randomName(), accent: accentForIndex(Math.floor(Math.random() * 4)) };
}

/**
 * Presence + cursors over a Supabase channel: presence tracks who's online (name +
 * accent); broadcast carries high-frequency cursor moves and drag state. Identity is
 * generated after mount to avoid SSR hydration mismatches.
 */
export function usePresence(supabase: SupabaseClient | null, boardId: string) {
  const [me, setMe] = useState<Identity | null>(null);
  const [peers, setPeers] = useState<Record<string, RemotePeer>>({});
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    // Generate a client-only identity after mount so SSR and hydration match (server renders none).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMe(makeIdentity());
  }, []);

  useEffect(() => {
    if (!supabase || !me) return;
    const channel = supabase.channel(`board:${boardId}:presence`, {
      config: { presence: { key: me.id } },
    });
    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<Identity>();
        setPeers((prev) => {
          const next: Record<string, RemotePeer> = {};
          for (const key of Object.keys(state)) {
            if (key === me.id) continue;
            const ident = state[key][0] as unknown as Identity;
            next[key] = { ...ident, cursor: prev[key]?.cursor ?? null, dragging: prev[key]?.dragging ?? false };
          }
          return next;
        });
      })
      .on('broadcast', { event: 'cursor' }, ({ payload }) => {
        const p = payload as { id: string; x: number; y: number };
        if (p.id === me.id) return;
        setPeers((prev) => (prev[p.id] ? { ...prev, [p.id]: { ...prev[p.id], cursor: { x: p.x, y: p.y } } } : prev));
      })
      .on('broadcast', { event: 'drag' }, ({ payload }) => {
        const p = payload as { id: string; dragging: boolean };
        if (p.id === me.id) return;
        setPeers((prev) => (prev[p.id] ? { ...prev, [p.id]: { ...prev[p.id], dragging: p.dragging } } : prev));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ id: me.id, name: me.name, accent: me.accent });
        }
      });

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [supabase, boardId, me]);

  const sendCursor = useCallback(
    (x: number, y: number) => {
      if (!me) return;
      channelRef.current?.send({ type: 'broadcast', event: 'cursor', payload: { id: me.id, x, y } });
    },
    [me],
  );

  const sendDragging = useCallback(
    (dragging: boolean) => {
      if (!me) return;
      channelRef.current?.send({ type: 'broadcast', event: 'drag', payload: { id: me.id, dragging } });
    },
    [me],
  );

  return { me, peers: Object.values(peers), sendCursor, sendDragging };
}
