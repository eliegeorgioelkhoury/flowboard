'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Card, Column as Col, Label } from '@/lib/types';
import { CardItem } from './CardItem';
import styles from './board.module.css';

export function Column({
  column,
  cards,
  labelsForCard,
  onOpenCard,
  onAddCard,
}: {
  column: Col;
  cards: Card[];
  labelsForCard: (cardId: string) => Label[];
  onOpenCard: (id: string) => void;
  onAddCard: (columnId: string, title: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { type: 'column' } });

  return (
    <section className={styles.column} data-testid="column" data-column-id={column.id}>
      <header className={styles.columnHead}>
        <h2 className={styles.columnTitle}>{column.title}</h2>
        <span className={styles.count} aria-label={`${cards.length} cards`}>
          {cards.length}
        </span>
      </header>
      <div ref={setNodeRef} className={styles.cardList} data-over={isOver || undefined}>
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((c) => (
            <CardItem key={c.id} card={c} labels={labelsForCard(c.id)} onOpen={() => onOpenCard(c.id)} />
          ))}
        </SortableContext>
        {cards.length === 0 && <p className={styles.empty}>Drop cards here</p>}
      </div>
      <AddCard onAdd={(title) => onAddCard(column.id, title)} />
    </section>
  );
}

function AddCard({ onAdd }: { onAdd: (title: string) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const submit = () => {
    const t = title.trim();
    if (t) onAdd(t);
    setTitle('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button className={styles.addCard} onClick={() => setOpen(true)} data-testid="add-card">
        + Add card
      </button>
    );
  }

  return (
    <div className={styles.addForm}>
      <textarea
        className="textarea"
        autoFocus
        rows={2}
        placeholder="Card title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
          if (e.key === 'Escape') {
            setOpen(false);
            setTitle('');
          }
        }}
        data-testid="add-card-input"
      />
      <div className={styles.addActions}>
        <button className="btn" onClick={submit}>
          Add
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setOpen(false);
            setTitle('');
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
