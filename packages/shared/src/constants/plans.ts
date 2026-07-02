import { PlanType } from '../types/subscription.js';
import type { SubscriptionPlan } from '../types/subscription.js';

/**
 * Subscription plan definitions.
 * External payment identifiers can be configured later if needed.
 */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    type: PlanType.MONTHLY,
    name: 'Explorador',
    description: 'Acceso completo a todos los mundos y niveles',
    price: 4999,
    interval: 'month',
    externalPlanId: '',
    features: [
      'Todos los mundos desbloqueados',
      'Niveles ilimitados',
      'Sin publicidad',
      'Logros especiales',
      'Contenido nuevo semanal',
      'Progreso guardado en la nube',
    ],
  },
  {
    type: PlanType.YEARLY,
    name: 'Explorador Anual',
    description: 'Ahorrá 40% con el plan anual',
    price: 35999,
    interval: 'year',
    externalPlanId: '',
    popular: true,
    features: [
      'Todo lo del plan mensual',
      '40% de ahorro',
      'Acceso anticipado a nuevos mundos',
      'Badge exclusivo "Explorador Estrella"',
    ],
  },
  {
    type: PlanType.FAMILY,
    name: 'Familia',
    description: 'Hasta 4 perfiles de niños',
    price: 6999,
    interval: 'month',
    externalPlanId: '',
    features: [
      'Todo lo del plan Explorador',
      'Hasta 4 perfiles de niños',
      'Dashboard para padres',
      'Reportes de progreso',
    ],
  },
];

export const FREE_LEVEL_LIMIT = 10;
export const FREE_CHILDREN_LIMIT = 1;
export const FAMILY_CHILDREN_LIMIT = 4;
export const DEFAULT_CHILDREN_LIMIT = 2;
