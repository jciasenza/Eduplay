import type { LearningWorld } from '../../data/worlds';
import { exploraYDescubreGame } from './games/explora-y-descubre';

export const naturalScienceWorld: LearningWorld = {
  id: 'natural-science',
  title: 'Ciencias Naturales',
  description: 'Plantas, cuerpo humano, planeta y descubrimientos.',
  icon: 'Ci',
  accent: 'green',
  badge: 'Pronto',
  actionLabel: 'Ver mundo',
  locked: true,
  progress: 22,
  characterName: 'Natu',
  characterRole: 'Guia de descubrimientos',
  characterImage: '/natu.png',
  games: [exploraYDescubreGame],
};
