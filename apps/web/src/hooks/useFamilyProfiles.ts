import { useEffect, useMemo, useState } from 'react';
import { getApiBaseUrl } from '../lib/api';
import { useAuth } from './useAuth';
import type { FamilyChildProfile } from '../lib/familyProfiles';
import {
  FAMILY_PROFILES_CHANGE_EVENT,
  readStoredActiveChildId,
  readStoredChildren,
  syncFamilyProfiles,
} from '../lib/familyProfiles';

interface FamilyAccountResponse {
  subscription: {
    familyPackEnabled: boolean;
  } | null;
}

export const useFamilyProfiles = () => {
  const { session } = useAuth();
  const accessToken = session?.access_token;
  const [children, setChildren] = useState<FamilyChildProfile[]>(() => readStoredChildren());
  const [familyPackEnabled, setFamilyPackEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChildId, setActiveChildIdState] = useState<string | null>(() => readStoredActiveChildId());

  useEffect(() => {
    const refreshFromStorage = () => {
      setChildren(readStoredChildren());
      setActiveChildIdState(readStoredActiveChildId());
    };

    const handleProfilesChange = () => {
      refreshFromStorage();
    };

    window.addEventListener(FAMILY_PROFILES_CHANGE_EVENT, handleProfilesChange);
    return () => {
      window.removeEventListener(FAMILY_PROFILES_CHANGE_EVENT, handleProfilesChange);
    };
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setFamilyPackEnabled(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const loadFamilyProfiles = async () => {
      try {
        setIsLoading(true);

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        try {
          const meResponse = await fetch(`${getApiBaseUrl()}/api/users/me`, { headers });
          if (meResponse.ok) {
            const meData = (await meResponse.json()) as FamilyAccountResponse;
            if (isMounted) {
              setFamilyPackEnabled(Boolean(meData.subscription?.familyPackEnabled));
            }
          }
        } catch {
          if (isMounted) {
            setFamilyPackEnabled(false);
          }
        }

        const response = await fetch(`${getApiBaseUrl()}/api/users/me/children`, { headers });

        if (!response.ok) {
          throw new Error('No se pudieron cargar los perfiles familiares.');
        }

        const data = (await response.json()) as FamilyChildProfile[];
        if (!isMounted) return;

        setChildren(data);
        setError(null);

        const storedActiveChildId = readStoredActiveChildId();
        const activeChildExists = data.some((child) => child.id === storedActiveChildId);
        const nextActiveChildId = activeChildExists ? storedActiveChildId : data[0]?.id ?? null;
        const nextActiveChildProfile = nextActiveChildId
          ? data.find((child) => child.id === nextActiveChildId) ?? null
          : null;

        syncFamilyProfiles({
          children: data,
          activeChildId: nextActiveChildId,
          activeChildProfile: nextActiveChildProfile,
        });
        setActiveChildIdState(nextActiveChildId);
      } catch (loadError) {
        if (!isMounted) return;

        const message =
          loadError instanceof Error
            ? loadError.message
            : 'No se pudieron cargar los perfiles familiares.';
        setError(message);
        setChildren([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadFamilyProfiles();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const activeChild = useMemo(
    () =>
      children.find((child) => child.id === activeChildId) ??
      children[0] ??
      null,
    [activeChildId, children],
  );

  const setActiveChildId = (childId: string | null) => {
    setActiveChildIdState(childId);

    if (!childId) {
      syncFamilyProfiles({ activeChildId: null, activeChildProfile: null });
      return;
    }

    const nextActiveChild = children.find((child) => child.id === childId) ?? null;
    syncFamilyProfiles({
      activeChildId: childId,
      activeChildProfile: nextActiveChild,
    });
  };

  return {
    activeChild,
    activeChildId,
    children,
    error,
    familyPackEnabled,
    isLoading,
    setActiveChildId,
  };
};
