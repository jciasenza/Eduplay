import { useEffect, useState } from 'react';
import type { LearningWorld } from '../data/worlds';
import { getApiBaseUrl } from '../lib/api';

export const useLearningWorlds = () => {
  const [worlds, setWorlds] = useState<LearningWorld[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadWorlds = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${getApiBaseUrl()}/api/games/worlds`);

        if (!response.ok) {
          throw new Error('No se pudieron cargar los mundos desde la API.');
        }

        const apiWorlds = (await response.json()) as LearningWorld[];
        if (isMounted) {
          setWorlds(apiWorlds);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          const message =
            loadError instanceof Error ? loadError.message : 'No se pudieron cargar los mundos.';
          setError(message);
          setWorlds([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadWorlds();

    return () => {
      isMounted = false;
    };
  }, []);

  return { worlds, isLoading, error };
};
