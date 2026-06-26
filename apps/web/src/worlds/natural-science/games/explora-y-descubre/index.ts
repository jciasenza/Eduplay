import type { GameConfig } from '../../../../data/worlds';
import { exploraYDescubreLevels } from './levels';

export const exploraYDescubreGame: GameConfig = {
  id: 'explora-y-descubre',
  title: 'Explora y descubre',
  description: 'Proximamente: juegos de ciencia y curiosidades.',
  icon: '🧪',
  route: 'explora-y-descubre',
  levels: exploraYDescubreLevels,
  locked: true,
  status: 'coming-soon',
};
