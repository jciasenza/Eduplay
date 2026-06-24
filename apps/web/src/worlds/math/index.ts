import type { LearningWorld } from '../../data/worlds';
import { memoritestGame } from './games/memoritest';

export const mathWorld: LearningWorld = {
  id: 'math',
  title: 'Matematicas',
  description: 'Memotest de numeros, sumas y resultados.',
  icon: '#',
  accent: 'blue',
  badge: 'Gratis',
  actionLabel: 'Explorar mundo',
  progress: 58,
  characterName: 'Numi',
  characterRole: 'Guardian de numeros',
  characterImage: '/numi.png',
  games: [memoritestGame],
};
