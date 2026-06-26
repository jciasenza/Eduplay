import { useNavigate, useParams } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CharacterAvatar } from '../components/ui/CharacterAvatar';
import { useLearningWorlds } from '../hooks/useLearningWorlds';

export const WorldLanding = () => {
  const navigate = useNavigate();
  const { worldId } = useParams<{ worldId: string }>();
  const { worlds, isLoading } = useLearningWorlds();
  const activeWorld = worlds.find((world) => world.id === worldId);
  useScrollReveal([activeWorld?.id]);

  if (isLoading) {
    return (
      <section className="game-page">
        <div className="container game-page__inner">
          <div className="game-loading">Cargando mundo...</div>
        </div>
      </section>
    );
  }

  if (!activeWorld) {
    return (
      <section className="game-page">
        <div className="container game-page__inner">
          <div className="game-header">
            <div>
              <span className="eyebrow">Mundo no disponible</span>
              <h1>Este mundo no existe</h1>
              <p>Regresa a la pagina principal para elegir otro mundo.</p>
            </div>
          </div>
          <div className="game-shell game-shell--empty">
            <button className="btn btn-primary" type="button" onClick={() => navigate('/')}>Volver al inicio</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`world-landing-page world-landing--${activeWorld.accent}`}>
      <div className="container world-landing__inner">
        <div className="world-hero reveal fade-up" data-reveal>
          <div className="world-hero__grid">
            <div className="world-hero__meta">
              <span className="eyebrow">MUNDO {activeWorld.title.toUpperCase()}</span>
              <h1>{activeWorld.title}</h1>
              <p>{activeWorld.description}</p>
              <div className="hero-actions">
                <button className="btn btn-primary" type="button" onClick={() => navigate('/dashboard')}>
                  Volver al panel
                </button>
                <button className="btn btn-ghost" type="button" onClick={() => navigate('/')}>Inicio</button>
              </div>
            </div>
            <div className="world-hero__avatar">
              <CharacterAvatar accent={activeWorld.accent} image={activeWorld.characterImage} name={activeWorld.characterName} label={activeWorld.characterName} />
            </div>
          </div>
        </div>

        <div className="section-block reveal fade-up" data-reveal>
          <div className="section-heading">
            <span className="eyebrow">Juegos del mundo</span>
            <h2>Elige el desafio</h2>
          </div>
          <div className="world-games-grid">
            {activeWorld.games.length > 0 ? (
              activeWorld.games.map((game) => (
                <article key={game.id} className={`game-card ${game.locked ? 'game-card--locked' : ''}`}>
                  <div className="game-card__left">
                    <div className="game-card__icon">{game.icon}</div>
                  </div>
                  <div className="game-card__body">
                    <h3>{game.title}</h3>
                    <p>{game.description}</p>
                  </div>
                  <div className="game-card__cta">
                    <button
                      className={game.locked ? 'btn btn-outline' : 'btn btn-primary'}
                      type="button"
                      disabled={game.locked || !game.levels.length}
                      onClick={() => 
                        game.levels.length > 0
                          ? navigate(`/world/${activeWorld.id}/game/${game.id}/level/${game.levels[0].id}`)
                          : null
                      }
                    >
                      {game.status === 'premium'
                        ? 'Premium'
                        : game.status === 'coming-soon'
                        ? 'Próximamente'
                        : 'Jugar'}
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="game-card game-card--empty">
                <h3>Proximamente</h3>
                <p>Este mundo tendra juegos proximamente. Vuelve pronto.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
