import { useNavigate } from 'react-router-dom';
import { WorldCard } from '../components/ui/WorldCard';
import { useAuth } from '../hooks/useAuth';
import { learningWorlds } from '../data/worlds';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
          </div>
          <div className="streak-card">
            <span>Racha</span>
            <strong>3 dias</strong>
            <small>Sigue practicando para ganar mas estrellas.</small>
          </div>
        </div>

        <div className="dashboard-grid">
          {learningWorlds.map((world) => (
            <WorldCard
              key={world.id}
              {...world}
              onAction={() => navigate(`/world/${world.id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
