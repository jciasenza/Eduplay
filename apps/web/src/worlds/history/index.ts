import type { LearningWorld } from '../../data/worlds';
import { tiempoMagicoGame } from './games/tiempo-magico';

export const historyWorld: LearningWorld = {
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
  games: [tiempoMagicoGame],
};
