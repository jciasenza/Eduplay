export type WorldAccent = 'blue' | 'green' | 'orange' | 'pink' | 'purple' | 'yellow';

export interface LevelConfig {
  id: string;
  sourceId?: string;
  title: string;
  timeLimit: number;
  gridSize: { cols: number; rows: number };
  isPremium?: boolean;
  difficulty?: string;
  category?: string;
  data?: unknown;
}

export interface GameConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  levels: LevelConfig[];
  locked?: boolean;
  status?: 'available' | 'premium' | 'coming-soon';
}

export interface LearningWorld {
  id: string;
  sourceId?: string;
  sourceSlug?: string;
  title: string;
  description: string;
  icon: string;
  accent: WorldAccent;
  badge: string;
  actionLabel: string;
  locked?: boolean;
  progress: number;
  characterName: string;
  characterRole: string;
  characterImage: string;
  games: GameConfig[];
}
