import { Difficulty } from '../types/game';

export const GAME_CATEGORIES = [
  { id: 'math', name: 'Matemáticas', icon: '🔢' },
  { id: 'words', name: 'Palabras', icon: '📝' },
  { id: 'science', name: 'Ciencias', icon: '🔬' },
  { id: 'animals', name: 'Animales', icon: '🐾' },
  { id: 'geography', name: 'Geografía', icon: '🌍' },
] as const;

export const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: {
    label: 'Fácil',
    color: '#4CAF50',
    gridSize: { cols: 3, rows: 2 },
    timeLimit: 90,
    pairs: 3,
  },
  [Difficulty.MEDIUM]: {
    label: 'Medio',
    color: '#FF9800',
    gridSize: { cols: 4, rows: 3 },
    timeLimit: 120,
    pairs: 6,
  },
  [Difficulty.HARD]: {
    label: 'Difícil',
    color: '#F44336',
    gridSize: { cols: 4, rows: 4 },
    timeLimit: 150,
    pairs: 8,
  },
} as const;

export const STAR_THRESHOLDS = {
  3: 0.33, // Complete in top 33% of time/moves
  2: 0.66, // Complete in top 66%
  1: 1.0,  // Just complete it
} as const;

export const AVATARS = [
  { id: 'astronaut', name: 'Astronauta', emoji: '🧑‍🚀' },
  { id: 'scientist', name: 'Científico', emoji: '🧑‍🔬' },
  { id: 'explorer', name: 'Explorador', emoji: '🧭' },
  { id: 'artist', name: 'Artista', emoji: '🎨' },
  { id: 'detective', name: 'Detective', emoji: '🔍' },
  { id: 'robot', name: 'Robot', emoji: '🤖' },
  { id: 'unicorn', name: 'Unicornio', emoji: '🦄' },
  { id: 'dragon', name: 'Dragón', emoji: '🐉' },
] as const;
