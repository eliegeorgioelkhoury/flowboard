'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type PointerEvent } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { BoardData, Card } from '@/lib/types';
import {
  boardReducer,
  cardsByColumn,
  labelsForCard,
  sortedColumns,
  type BoardState,
} from '@/lib/board-reducer';
import { positionForIndex } from '@/lib/ordering';
import { getBrowserClient } from '@/lib/supabase/client';
import { Column } from './Column';
import { CardFace } from './CardItem';
import { CardDetailPanel } from './CardDetailPanel';
import { CursorLayer, PresenceBar } from './PresenceLayer';
import { useRealtimeBoard } from './useRealtime';
import { usePresence } from './usePresence';
import styles from './board.module.css';

/** Fire a Supabase write and swallow errors (optimistic UI already updated). */
function persist(query: PromiseLike<unknown> | undefined) {
  void query?.then(
    () => {},
    () => {},
  );
}

export function BoardView({ initial, live }: { initial: BoardData; live: boolean }) {
  const [state, dispatch] = useReducer(boardReducer, {
    columns: initial.columns,
    cards: initial.cards,
    labels: initial.labels,
  } satisfies BoardState);

  const supabase = useMemo<SupabaseClient | null>(() => (live ? getBrowserClient() : null), [live]);
  const boardId = initial.board.id;

  useRealtimeBoard(supabase, boardId, dispatch);
  const { me, peers, sendCursor, sendDragging } = usePresence(supabase, boardId);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const boardAreaRef = useRef<HTMLDivElement>(null);
  // Where the active card sat when the drag began. onDragOver moves it optimistically
  // mid-drag, so onDragEnd must compare against this origin (not the mutated state) to
  // know whether to persist.
  const dragOriginRef = useRef<{ columnId: string; position: number } | null>(null);
  const [size, setSize] = useState({ width: 1, height: 1 });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const columns = sortedColumns(state);
  const activeCard = activeId ? (state.cards.find((c) => c.id === activeId) ?? null) : null;
  const selectedCard = selectedId ? (state.cards.find((c) => c.id === selectedId) ?? null) : null;

  const columnIds = useMemo(() => new Set(state.columns.map((c) => c.id)), [state.columns]);
  const columnOf = useCallback(
    (cardId: string) => state.cards.find((c) => c.id === cardId)?.column_id,
    [state.cards],
  );

  useEffect(() => {
    const el = boardAreaRef.current;
    if (!el) return;
    const measure = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onDragStart = (e: DragStartEvent) => {
    const id = String(e.active.id);
    setActiveId(id);
    const card = state.cards.find((c) => c.id === id);
    dragOriginRef.current = card ? { columnId: card.column_id, position: card.position } : null;
    sendDragging(true);
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const cardId = String(active.id);
    const overId = String(over.id);
    const fromCol = columnOf(cardId);
    if (!fromCol) return;
    const toCol = columnIds.has(overId) ? overId : columnOf(overId);
    if (!toCol || toCol === fromCol) return;
    const dest = cardsByColumn(state, toCol).filter((c) => c.id !== cardId);
    dispatch({ type: 'moveCard', cardId, toColumnId: toCol, position: positionForIndex(dest, dest.length) });
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    sendDragging(false);
    const origin = dragOriginRef.current;
    dragOriginRef.current = null;

    const { active, over } = e;
    const cardId = String(active.id);
    const card = state.cards.find((c) => c.id === cardId);
    if (!card) return;

    // Resolve the destination. onDragOver keeps the card's column live during the drag,
    // so if there's no explicit drop target we finalize wherever it currently rests.
    const overId = over ? String(over.id) : null;
    const overCard = overId ? state.cards.find((c) => c.id === overId) : null;
    const toCol = overId && columnIds.has(overId) ? overId : (overCard?.column_id ?? card.column_id);

    const list = cardsByColumn(state, toCol).filter((c) => c.id !== cardId);
    const overIdx = overCard ? list.findIndex((c) => c.id === overId) : -1;
    const index = overIdx < 0 ? list.length : overIdx;
    const position = positionForIndex(list, index);

    dispatch({ type: 'moveCard', cardId, toColumnId: toCol, position });

    // Persist iff the card actually moved from where THIS drag began. Comparing against
    // current state would miss the move — onDragOver has already applied it optimistically.
    if (!origin || origin.columnId !== toCol || origin.position !== position) {
      persist(supabase?.from('cards').update({ column_id: toCol, position }).eq('id', cardId));
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    const rect = boardAreaRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    sendCursor((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
  };

  const addCard = (columnId: string, title: string) => {
    const list = cardsByColumn(state, columnId);
    const position = list.length ? list[list.length - 1].position + 1000 : 1000;
    const card: Card = {
      id: crypto.randomUUID(),
      column_id: columnId,
      board_id: boardId,
      title,
      description: null,
      position,
      assignee: null,
      due_date: null,
    };
    dispatch({ type: 'upsertCard', card });
    persist(supabase?.from('cards').insert(card));
  };

  const updateCard = (id: string, fields: Partial<Card>) => {
    dispatch({ type: 'updateCard', id, fields });
    persist(supabase?.from('cards').update(fields).eq('id', id));
  };

  const deleteCard = (id: string) => {
    setSelectedId(null);
    dispatch({ type: 'removeCard', id });
    persist(supabase?.from('cards').delete().eq('id', id));
  };

  const addLabel = (cardId: string, label: string, color: string) => {
    const row = { id: crypto.randomUUID(), card_id: cardId, label, color };
    dispatch({ type: 'upsertLabel', label: row });
    persist(supabase?.from('card_labels').insert(row));
  };

  const removeLabel = (id: string) => {
    dispatch({ type: 'removeLabel', id });
    persist(supabase?.from('card_labels').delete().eq('id', id));
  };

  return (
    <div className={styles.app} data-live={live ? 'true' : 'false'} onPointerMove={onPointerMove}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            ▚
          </span>
          <div>
            <h1 className={styles.title}>{initial.board.title}</h1>
            <p className={styles.sub}>
              {live ? 'Live · realtime multiplayer' : 'Static preview · connect Supabase for realtime'}
            </p>
          </div>
        </div>
        <PresenceBar me={me} peers={peers} />
      </header>

      <div className={styles.boardArea} ref={boardAreaRef}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={() => {
            setActiveId(null);
            sendDragging(false);
          }}
        >
          <div className={styles.board} data-testid="board">
            {columns.map((col) => (
              <Column
                key={col.id}
                column={col}
                cards={cardsByColumn(state, col.id)}
                labelsForCard={(cardId) => labelsForCard(state, cardId)}
                onOpenCard={setSelectedId}
                onAddCard={addCard}
              />
            ))}
          </div>
          <DragOverlay>
            {activeCard ? <CardFace card={activeCard} labels={labelsForCard(state, activeCard.id)} lifted /> : null}
          </DragOverlay>
        </DndContext>
        <CursorLayer peers={peers} width={size.width} height={size.height} />
      </div>

      {selectedCard && (
        <CardDetailPanel
          card={selectedCard}
          labels={labelsForCard(state, selectedCard.id)}
          onClose={() => setSelectedId(null)}
          onUpdate={(fields) => updateCard(selectedCard.id, fields)}
          onAddLabel={(label, color) => addLabel(selectedCard.id, label, color)}
          onRemoveLabel={removeLabel}
          onDelete={() => deleteCard(selectedCard.id)}
        />
      )}
    </div>
  );
}
