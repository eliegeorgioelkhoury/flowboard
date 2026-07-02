'use client';

import { useSortable } from '@dnd-kit/sortable';
import { motion, useReducedMotion } from 'framer-motion';
import type { Card, Label } from '@/lib/types';
import styles from './board.module.css';

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Presentational card face, shared by the in-list card and the drag overlay. */
export function CardFace({ card, labels, lifted }: { card: Card; labels: Label[]; lifted?: boolean }) {
  return (
    <div className={styles.card} data-lifted={lifted || undefined}>
      {labels.length > 0 && (
        <div className={styles.labels}>
          {labels.map((l) => (
            <span key={l.id} className={styles.label} data-accent={l.color}>
              {l.label}
            </span>
          ))}
        </div>
      )}
      <div className={styles.cardTitle}>{card.title}</div>
      {(card.due_date || card.assignee) && (
        <div className={styles.cardMeta}>
          {card.due_date && <span className={styles.due}>{card.due_date}</span>}
          {card.assignee && (
            <span className={styles.avatar} title={card.assignee} aria-label={`Assigned to ${card.assignee}`}>
              {initials(card.assignee)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/** Sortable card. Framer `layout` owns movement (spring); dnd-kit handles the drag,
 *  and the actively-dragged card is shown via <DragOverlay> (this one dims to a slot). */
export function CardItem({ card, labels, onOpen }: { card: Card; labels: Label[]; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const { listeners, setNodeRef, isDragging } = useSortable({
    id: card.id,
    data: { type: 'card', columnId: card.column_id },
  });

  return (
    <motion.div
      ref={setNodeRef}
      layout={reduce ? false : 'position'}
      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 560, damping: 40, mass: 0.7 }}
      style={{ opacity: isDragging ? 0.35 : 1 }}
      className={styles.cardWrap}
      data-testid="card"
      data-card-id={card.id}
      data-column={card.column_id}
      role="button"
      tabIndex={0}
      aria-label={`Open card: ${card.title}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      {...listeners}
    >
      <CardFace card={card} labels={labels} />
    </motion.div>
  );
}
