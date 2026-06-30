export interface FamilyChildProfile {
  id: string;
  name: string;
  age: number;
  avatarId: string;
}

export const FAMILY_PROFILES_CHANGE_EVENT = 'eduplay-family-profiles-change';
export const ACTIVE_CHILD_ID_KEY = 'eduplay-active-child-id';
export const ACTIVE_CHILD_PROFILE_KEY = 'eduplay-active-child-profile';
export const FAMILY_CHILDREN_KEY = 'eduplay-family-children';

export const avatarImageById: Record<string, string> = {
  numi: '/numi.png',
  lira: '/lira.png',
  natu: '/natu.png',
  crono: '/crono.png',
  pixel: '/pixel.png',
  default: '/eduplay.png',
};

export const getAvatarSrc = (avatarId?: string | null) =>
  avatarImageById[avatarId ?? 'default'] ?? avatarImageById.default;

const isBrowser = typeof window !== 'undefined';

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const readStoredChildren = () => {
  if (!isBrowser) return [] as FamilyChildProfile[];
  return safeParse<FamilyChildProfile[]>(window.localStorage.getItem(FAMILY_CHILDREN_KEY), []);
};

export const writeStoredChildren = (children: FamilyChildProfile[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(FAMILY_CHILDREN_KEY, JSON.stringify(children));
};

export const readStoredActiveChildId = () => {
  if (!isBrowser) return null;
  return window.localStorage.getItem(ACTIVE_CHILD_ID_KEY);
};

export const writeStoredActiveChildId = (childId: string | null) => {
  if (!isBrowser) return;
  if (!childId) {
    window.localStorage.removeItem(ACTIVE_CHILD_ID_KEY);
    return;
  }
  window.localStorage.setItem(ACTIVE_CHILD_ID_KEY, childId);
};

export const readStoredActiveChildProfile = () => {
  if (!isBrowser) return null as FamilyChildProfile | null;
  return safeParse<FamilyChildProfile | null>(window.localStorage.getItem(ACTIVE_CHILD_PROFILE_KEY), null);
};

export const writeStoredActiveChildProfile = (profile: FamilyChildProfile | null) => {
  if (!isBrowser) return;
  if (!profile) {
    window.localStorage.removeItem(ACTIVE_CHILD_PROFILE_KEY);
    return;
  }
  window.localStorage.setItem(ACTIVE_CHILD_PROFILE_KEY, JSON.stringify(profile));
};

export const syncFamilyProfiles = (params: {
  children?: FamilyChildProfile[];
  activeChildId?: string | null;
  activeChildProfile?: FamilyChildProfile | null;
}) => {
  if (!isBrowser) return;

  if (params.children) {
    writeStoredChildren(params.children);
  }

  if (params.activeChildId !== undefined) {
    writeStoredActiveChildId(params.activeChildId);
  }

  if (params.activeChildProfile !== undefined) {
    writeStoredActiveChildProfile(params.activeChildProfile);
  }

  window.dispatchEvent(new Event(FAMILY_PROFILES_CHANGE_EVENT));
};
