// ============================================
// Subscription Types
// ============================================

export const SubscriptionStatus = {
  FREE: 'FREE',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  PAST_DUE: 'PAST_DUE',
  EXPIRED: 'EXPIRED',
} as const;

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const PlanType = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  FAMILY: 'family',
} as const;

export type PlanType = (typeof PlanType)[keyof typeof PlanType];

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: SubscriptionStatus;
  plan: PlanType | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface SubscriptionPlan {
  type: PlanType;
  name: string;
  description: string;
  price: number; // USD cents
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  popular?: boolean;
}
