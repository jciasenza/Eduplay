import type { GameConfig } from '../../../../data/worlds';
import { retoMentalLevels } from './levels';

export const retoMentalGame: GameConfig = {
  id: 'reto-mental',
  title: 'Reto mental',
  description: 'Proximamente: juegos de logica y patrones.',
  icon: '🧠',
  route: 'reto-mental',
  levels: retoMentalLevels,
  locked: true,
  status: 'coming-soon',
};
