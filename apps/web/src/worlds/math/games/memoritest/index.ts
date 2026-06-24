import type { GameConfig } from '../../../../data/worlds';
import { memoritestLevels } from './levels';

export const memoritestGame: GameConfig = {
  id: 'memorittest',
  title: 'Memotest numerico',
  description: 'Busca las parejas y practica numeros en un reto rapido.',
  icon: '🔢',
  route: 'memorittest',
  levels: memoritestLevels,
};
