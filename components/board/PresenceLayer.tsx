'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { Identity } from '@/lib/presence';
import type { RemotePeer } from './usePresence';
import styles from './board.module.css';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function PresenceBar({ me, peers }: { me: Identity | null; peers: RemotePeer[] }) {
  const everyone: Identity[] = [me, ...peers].filter(Boolean) as Identity[];
  return (
    <div className={styles.presenceBar} data-testid="presence-bar">
      <span className={styles.online}>
        <span className={styles.onlineDot} />
        {everyone.length} online
      </span>
      <div className={styles.avatars}>
        {everyone.slice(0, 6).map((p, i) => (
          <span
            key={p.id}
            className={styles.presenceAvatar}
            data-accent={p.accent}
            style={{ zIndex: 10 - i }}
            title={me && p.id === me.id ? `${p.name} (you)` : p.name}
          >
            {initials(p.name)}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CursorLayer({ peers, width, height }: { peers: RemotePeer[]; width: number; height: number }) {
  const reduce = useReducedMotion();
  return (
    <div className={styles.cursorLayer} aria-hidden="true">
      {peers
        .filter((p) => p.cursor)
        .map((p) => (
          <motion.div
            key={p.id}
            className={styles.cursor}
            data-accent={p.accent}
            initial={false}
            animate={{ x: p.cursor!.x * width, y: p.cursor!.y * height }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 700, damping: 42, mass: 0.5 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3l5.2 13.5 2.3-5.6L16 8.6 3 3z" fill="currentColor" stroke="#fff" strokeWidth="1.2" />
            </svg>
            <span className={styles.cursorLabel} data-accent={p.accent}>
              {p.name}
              {p.dragging ? ' · dragging' : ''}
            </span>
          </motion.div>
        ))}
    </div>
  );
}
