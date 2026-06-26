import type { LearningWorld } from '../../data/worlds';
import { retoMentalGame } from './games/reto-mental';

export const logicWorld: LearningWorld = {
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
  games: [retoMentalGame],
};
