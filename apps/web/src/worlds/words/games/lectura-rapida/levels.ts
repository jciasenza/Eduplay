import type { LevelConfig } from '../../../../data/worlds';

export const lecturaRapidaLevels: LevelConfig[] = [
  {
    id: 'lectura-1',
    title: 'Nivel 1: Silabas básicas',
    timeLimit: 120,
    gridSize: { cols: 3, rows: 3 },
  },
  {
    id: 'lectura-2',
    title: 'Nivel 2: Palabras simples',
    timeLimit: 100,
    gridSize: { cols: 4, rows: 3 },
  },
];
