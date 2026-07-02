import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLearningWorlds } from '../hooks/useLearningWorlds';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useFamilyProfiles } from '../hooks/useFamilyProfiles';

export const GameLobby = () => {
  const navigate = useNavigate();
  const { worldId, gameId } = useParams<{ worldId: string; gameId: string }>();
  const { worlds, isLoading } = useLearningWorlds();
  const { activeChild, isLoading: isFamilyLoading } = useFamilyProfiles();
  const activeWorld = worlds.find((world) => world.id === worldId);
  const activeGame = activeWorld?.games.find((game) => game.id === gameId);
  useScrollReveal([activeWorld?.id, activeGame?.id]);

  const resumeLevel = useMemo(() => {
    if (!activeWorld || !activeGame) return null;

    const worldSourceId = activeWorld.sourceId ?? activeWorld.id;
    const completedIndices = (activeChild?.progress ?? [])
      .filter((progress) => progress.completed && progress.level?.worldId === worldSourceId)
      .map((progress) =>
        activeGame.levels.findIndex(
          (level) => level.sourceId === progress.levelId || level.id === progress.levelId,
        ),
      )
      .filter((index) => index >= 0);

    if (completedIndices.length === 0) {
      return activeGame.levels[0] ?? null;
    }

    const nextIndex = Math.min(
      Math.max(...completedIndices) + 1,
      activeGame.levels.length - 1,
    );
    return activeGame.levels[nextIndex] ?? activeGame.levels[0] ?? null;
  }, [activeChild?.progress, activeGame, activeWorld]);

  useEffect(() => {
    if (isLoading || isFamilyLoading || !activeWorld || !activeGame || !resumeLevel) return;

    navigate(`/world/${worldId}/game/${gameId}/level/${resumeLevel.id}`, { replace: true });
  }, [activeGame, activeWorld, gameId, isFamilyLoading, isLoading, navigate, resumeLevel, worldId]);

  if (isLoading || isFamilyLoading) {
    return (
      <section className="game-page">
        <div className="container game-page__inner">
          <div className="game-loading">Cargando partida...</div>
        </div>
      </section>
    );
  }

  if (!activeWorld || !activeGame) {
    return (
      <section className="game-page">
        <div className="container game-page__inner">
          <div className="game-header">
            <div>
              <span className="eyebrow">Juego no disponible</span>
              <h1>No se encontro este juego</h1>
              <p>Selecciona otro juego desde la pagina del mundo.</p>
            </div>
          </div>
          <div className="game-shell game-shell--empty">
            <button className="btn btn-primary" type="button" onClick={() => navigate(`/world/${worldId}`)}>
              Volver al mundo
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`game-page game-page--${activeWorld.accent}`}>
      <div className="container game-page__inner">
        <div className="game-header">
          <div>
            <span className="eyebrow">{activeWorld.title}</span>
            <h1>{activeGame.title}</h1>
            <p>Abriendo el ultimo nivel jugado...</p>
          </div>
        </div>
      </div>
    </section>
  );
};
