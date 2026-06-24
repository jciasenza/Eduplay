import { mathWorld } from '../worlds/math';

export type WorldAccent = 'blue' | 'green' | 'orange' | 'pink' | 'purple' | 'yellow';

export interface LevelConfig {
  id: string;
  title: string;
  timeLimit: number;
  gridSize: { cols: number; rows: number };
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

export const learningWorlds: LearningWorld[] = [
  mathWorld,
  {
    id: 'words',
    title: 'Palabras',
    description: 'Lectura, silabas y vocabulario nuevo.',
    icon: 'Aa',
    accent: 'pink',
    badge: 'Premium',
    actionLabel: 'Ver mundo',
    locked: true,
    progress: 18,
    characterName: 'Lira',
    characterRole: 'Exploradora de letras',
    characterImage: '/lira.png',
    games: [
      {
        id: 'words-01',
        title: 'Lectura rápida',
        description: 'Practica palabras y silabas en un juego rapido.',
        icon: '📚',
        route: 'lectura-rapida',
        levels: [],
        locked: true,
        status: 'premium',
      },
    ],
  },
  {
    id: 'natural-science',
    title: 'Ciencias Naturales',
    description: 'Plantas, cuerpo humano, planeta y descubrimientos.',
    icon: 'Ci',
    accent: 'green',
    badge: 'Pronto',
    actionLabel: 'Ver mundo',
    locked: true,
    progress: 22,
    characterName: 'Natu',
    characterRole: 'Guia de descubrimientos',
    characterImage: '/natu.png',
    games: [
      {
        id: 'science-01',
        title: 'Explora y descubre',
        description: 'Proximamente: juegos de ciencia y curiosidades.',
        icon: '🧪',
        route: 'explora-y-descubre',
        levels: [],
        locked: true,
        status: 'coming-soon',
      },
    ],
  },
  {
    id: 'history',
    title: 'Historia',
    description: 'Viajes por epocas, culturas y grandes acontecimientos.',
    icon: 'Hi',
    accent: 'orange',
    badge: 'Pronto',
    actionLabel: 'Ver mundo',
    locked: true,
    progress: 12,
    characterName: 'Crono',
    characterRole: 'Viajero del tiempo',
    characterImage: '/crono.png',
    games: [
      {
        id: 'history-01',
        title: 'Tiempo magico',
        description: 'Proximamente: descubre historias en forma de juego.',
        icon: '⏳',
        route: 'tiempo-magico',
        levels: [],
        locked: true,
        status: 'coming-soon',
      },
    ],
  },
  {
    id: 'logic',
    title: 'Logica',
    description: 'Patrones, memoria, estrategia y pensamiento rapido.',
    icon: 'Lo',
    accent: 'purple',
    badge: 'Nuevo',
    actionLabel: 'Ver mundo',
    locked: true,
    progress: 28,
    characterName: 'Pixel',
    characterRole: 'Entrenador mental',
    characterImage: '/pixel.png',
    games: [
      {
        id: 'logic-01',
        title: 'Reto mental',
        description: 'Proximamente: juegos de logica y patrones.',
        icon: '🧠',
        route: 'reto-mental',
        levels: [],
        locked: true,
        status: 'coming-soon',
      },
    ],
  },
];
