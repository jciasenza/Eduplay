// ============================================
// Game Types — Data-driven level structure
// ============================================

export const Difficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export interface World {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  isPremium: boolean;
  order: number;
  isActive: boolean;
  levels?: Level[];
}

export interface Level {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  worldId: string;
  order: number;
  isPremium: boolean;
  isActive: boolean;
  dataJson: LevelData;
}

/**
 * The core data-driven level format.
 * Levels are loaded from the database, never hardcoded.
 * New levels can be added from the admin panel.
 */
export interface LevelData {
  gridSize: { cols: number; rows: number };
  timeLimit: number; // seconds
  pairs: number;
  theme: string;
  cards: CardData[];
  background: string;
  music?: string;
  starThresholds: {
    '3stars': { maxTime: number; maxMoves: number };
    '2stars': { maxTime: number; maxMoves: number };
    '1star': { maxTime: number; maxMoves: number };
  };
}

export interface CardData {
  id: string;
  image: string;
  label?: string;  // Text shown below the card (for educational content)
  sound?: string;
  value?: string | number; // For math cards: the answer
}

export interface GameProgress {
  id: string;
  childId: string;
  levelId: string;
  stars: number;
  bestTime: number | null;
  completed: boolean;
  attempts: number;
}

export interface GameSession {
  id: string;
  childId: string;
  levelId: string;
  startedAt: string;
  endedAt: string | null;
  score: number;
  moves: number;
  timeSpent: number;
  completed: boolean;
}

export interface SaveProgressDto {
  childId: string;
  levelId: string;
  stars: number;
  score: number;
  time: number;
  moves: number;
  completed: boolean;
}

export interface StartSessionDto {
  childId: string;
  levelId: string;
}

export interface EndSessionDto {
  score: number;
  moves: number;
  timeSpent: number;
  completed: boolean;
}
