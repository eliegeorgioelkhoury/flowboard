'use client';

import { useState } from 'react';
import type { Card, Label } from '@/lib/types';
import { PRESENCE_ACCENTS } from '@/lib/types';
import styles from './board.module.css';

export function CardDetailPanel({
  card,
  labels,
  onClose,
  onUpdate,
  onAddLabel,
  onRemoveLabel,
  onDelete,
}: {
  card: Card;
  labels: Label[];
  onClose: () => void;
  onUpdate: (fields: Partial<Card>) => void;
  onAddLabel: (label: string, color: string) => void;
  onRemoveLabel: (id: string) => void;
  onDelete: () => void;
}) {
  const [description, setDescription] = useState(card.description ?? '');
  const [assignee, setAssignee] = useState(card.assignee ?? '');
  const [due, setDue] = useState(card.due_date ?? '');
  const [newLabel, setNewLabel] = useState('');
  const [labelColor, setLabelColor] = useState<string>('violet');

  const addLabel = () => {
    const t = newLabel.trim();
    if (!t) return;
    onAddLabel(t, labelColor);
    setNewLabel('');
  };

  return (
    <>
      <div className={styles.scrim} onClick={onClose} data-testid="scrim" />
      <aside className={styles.panel} role="dialog" aria-modal="true" aria-label="Card details" data-testid="card-panel">
        <header className={styles.panelHead}>
          <h2 className={styles.panelTitle}>{card.title}</h2>
          <button className="btn ghost" onClick={onClose} aria-label="Close details" data-testid="panel-close">
            ✕
          </button>
        </header>

        <label className={styles.fieldLabel} htmlFor="cd-desc">
          Description
        </label>
        <textarea
          id="cd-desc"
          className="textarea"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => onUpdate({ description: description.trim() || null })}
          placeholder="Add a description…"
          data-testid="card-description"
        />

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="cd-assignee">
              Assignee
            </label>
            <input
              id="cd-assignee"
              className="input"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              onBlur={() => onUpdate({ assignee: assignee.trim() || null })}
              placeholder="Unassigned"
              data-testid="card-assignee"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="cd-due">
              Due date
            </label>
            <input
              id="cd-due"
              type="date"
              className="input"
              value={due}
              onChange={(e) => {
                setDue(e.target.value);
                onUpdate({ due_date: e.target.value || null });
              }}
              data-testid="card-due"
            />
          </div>
        </div>

        <span className={styles.fieldLabel}>Labels</span>
        <div className={styles.labelList}>
          {labels.map((l) => (
            <span key={l.id} className={styles.labelChip} data-accent={l.color}>
              {l.label}
              <button
                className={styles.labelRemove}
                onClick={() => onRemoveLabel(l.id)}
                aria-label={`Remove label ${l.label}`}
              >
                ✕
              </button>
            </span>
          ))}
          {labels.length === 0 && <span className={styles.muted}>No labels yet</span>}
        </div>
        <div className={styles.addLabel}>
          <div className={styles.swatches}>
            {PRESENCE_ACCENTS.map((c) => (
              <button
                key={c}
                type="button"
                className={styles.swatch}
                data-accent={c}
                data-selected={labelColor === c || undefined}
                aria-label={`${c} label colour`}
                aria-pressed={labelColor === c}
                onClick={() => setLabelColor(c)}
              />
            ))}
          </div>
          <input
            className="input"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addLabel();
              }
            }}
            placeholder="New label…"
            data-testid="new-label"
          />
          <button className="btn subtle" onClick={addLabel}>
            Add
          </button>
        </div>

        <footer className={styles.panelFoot}>
          <button className={styles.deleteBtn} onClick={onDelete} data-testid="card-delete">
            Delete card
          </button>
        </footer>
      </aside>
    </>
  );
}
