// ============================================
// User Types
// ============================================

export const Role = {
  PARENT: 'PARENT',
  CHILD: 'CHILD',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: string;
  supabaseId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface ChildProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  avatarId: string;
  createdAt: string;
}

export interface CreateChildDto {
  name: string;
  age: number;
  avatarId?: string;
}

export interface UpdateChildDto {
  name?: string;
  age?: number;
  avatarId?: string;
}
