import type { GameConfig } from '../../../../data/worlds';
import { lecturaRapidaLevels } from './levels';

export const lecturaRapidaGame: GameConfig = {
  id: 'lectura-rapida',
  title: 'Lectura rápida',
  description: 'Practica palabras y silabas en un juego rapido.',
  icon: '📚',
  route: 'lectura-rapida',
  levels: lecturaRapidaLevels,
  locked: true,
  status: 'premium',
};
