import { useNavigate } from 'react-router-dom';
import { WorldCard } from '../components/ui/WorldCard';
import { useAuth } from '../hooks/useAuth';
import { useLearningWorlds } from '../hooks/useLearningWorlds';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { worlds, isLoading, error } = useLearningWorlds();
  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.display_name ||
    user?.email ||
    'familia EduPlay';

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
        ) : worlds.length > 0 ? (
          <div className="dashboard-grid">
            {worlds.map((world) => (
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
