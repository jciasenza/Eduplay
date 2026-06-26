import type { GameConfig } from '../../../../data/worlds';
import { tiempoMagicoLevels } from './levels';

export const tiempoMagicoGame: GameConfig = {
  id: 'tiempo-magico',
  title: 'Tiempo magico',
  description: 'Proximamente: descubre historias en forma de juego.',
  icon: '⏳',
  route: 'tiempo-magico',
  levels: tiempoMagicoLevels,
  locked: true,
  status: 'coming-soon',
};
