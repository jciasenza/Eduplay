import type { LearningWorld } from '../../data/worlds';
import { lecturaRapidaGame } from './games/lectura-rapida';

export const wordsWorld: LearningWorld = {
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
  games: [lecturaRapidaGame],
};
