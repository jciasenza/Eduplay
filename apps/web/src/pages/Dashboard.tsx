import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorldCard } from '../components/ui/WorldCard';
import { useAuth } from '../hooks/useAuth';
import { useLearningWorlds } from '../hooks/useLearningWorlds';
import { useFamilyProfiles } from '../hooks/useFamilyProfiles';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { worlds, isLoading, error } = useLearningWorlds();
  const { activeChild } = useFamilyProfiles();
  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.display_name ||
    user?.email ||
    'familia EduPlay';

  const worldsWithProgress = useMemo(
    () =>
      worlds.map((world) => {
        const totalLevels = world.games.reduce(
          (total, game) => total + (game.levels?.length ?? 0),
          0,
        );
        const worldProgress = activeChild?.worldProgress?.find(
          (item) => item.worldId === world.sourceId || item.worldSlug === world.sourceSlug,
        );
        const completedLevels = worldProgress?.completedLevels ?? 0;
        const progress = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

        return {
          ...world,
          progress,
          progressLabel: totalLevels > 0 ? `${completedLevels}/${totalLevels} niveles` : 'Sin niveles',
        };
      }),
    [activeChild?.worldProgress, worlds],
  );

  return (
    <section className="dashboard-page">
      <div className="container">
        <div className="dashboard-hero">
          <div>
            <span className="eyebrow">Panel familiar</span>
            <h1>Listos para jugar?</h1>
            <p>Bienvenido, {displayName}.</p>
            <div className="dashboard-hero__actions">
              <button className="btn btn-primary" onClick={() => navigate('/subscribe')}>
                Ver planes premium
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/account')}>
                Administrar cuenta
              </button>
            </div>
          </div>
          <div className="streak-card">
            <span>Racha</span>
            <strong>3 dias</strong>
            <small>Sigue practicando para ganar mas estrellas.</small>
          </div>
        </div>

        {isLoading ? (
          <div className="content-state">Cargando mundos...</div>
        ) : error ? (
          <div className="content-state content-state--error">{error}</div>
        ) : worldsWithProgress.length > 0 ? (
          <div className="dashboard-grid">
            {worldsWithProgress.map((world) => (
              <WorldCard
                key={world.id}
                {...world}
                onAction={() => navigate(`/world/${world.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="content-state">No hay mundos activos en la API.</div>
        )}
      </div>
    </section>
  );
};
