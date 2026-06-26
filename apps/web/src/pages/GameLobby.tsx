import { useNavigate, useParams } from 'react-router-dom';
import { useLearningWorlds } from '../hooks/useLearningWorlds';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const GameLobby = () => {
  const navigate = useNavigate();
  const { worldId, gameId } = useParams<{ worldId: string; gameId: string }>();
  const { worlds, isLoading } = useLearningWorlds();
  const activeWorld = worlds.find((world) => world.id === worldId);
  const activeGame = activeWorld?.games.find((game) => game.id === gameId);
  useScrollReveal([activeWorld?.id, activeGame?.id]);

  if (isLoading) {
    return (
      <section className="game-page">
        <div className="container game-page__inner">
          <div className="game-loading">Cargando juego...</div>
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
            <p>{activeGame.description}</p>
          </div>
          <div className="game-actions">
            <button className="btn btn-outline" type="button" onClick={() => navigate(`/world/${worldId}`)}>
              Volver al mundo
            </button>
          </div>
        </div>

        <div className="section-block">
          <div className="section-heading section-heading--small">
            <span className="eyebrow">Niveles</span>
            <h2>Elige un nivel</h2>
          </div>
          <div className="level-list">
            {activeGame.levels.length > 0 ? (
              activeGame.levels.map((level) => (
                <div key={level.id} className="level-card">
                  <div>
                    <strong>{level.title}</strong>
                    <p>Tiempo: {level.timeLimit}s • {level.gridSize.cols}x{level.gridSize.rows}</p>
                  </div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => navigate(`/world/${worldId}/game/${gameId}/level/${level.id}`)}
                  >
                    Jugar
                  </button>
                </div>
              ))
            ) : (
              <div className="level-card level-card--empty">
                <strong>Próximamente</strong>
                <p>Este juego aún no tiene niveles disponibles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
