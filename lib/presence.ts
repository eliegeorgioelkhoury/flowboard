import { PRESENCE_ACCENTS, type PresenceAccent } from './types';

/** Deterministically map a slot index to one of the four presence accents. */
export function accentForIndex(index: number): PresenceAccent {
  return PRESENCE_ACCENTS[((index % PRESENCE_ACCENTS.length) + PRESENCE_ACCENTS.length) % PRESENCE_ACCENTS.length];
}

const ADJECTIVES = ['Swift', 'Calm', 'Bright', 'Bold', 'Keen', 'Sunny', 'Cosmic', 'Lively', 'Nimble', 'Gentle'];
const ANIMALS = ['Otter', 'Falcon', 'Fox', 'Heron', 'Lynx', 'Sparrow', 'Panda', 'Koala', 'Dolphin', 'Wren'];

/** A friendly anonymous display name, e.g. "Swift Otter". `rand` injectable for tests. */
export function randomName(rand: () => number = Math.random): string {
  const adjective = ADJECTIVES[Math.floor(rand() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(rand() * ANIMALS.length)];
  return `${adjective} ${animal}`;
}

export interface Identity {
  id: string;
  name: string;
  accent: PresenceAccent;
}

export interface CursorState {
  x: number;
  y: number;
}

export type PresencePayload = Identity & { cursor: CursorState | null };
