import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const SubscriptionCancel = () => {
  const navigate = useNavigate();
  useScrollReveal();

  return (
    <section className="subscription-status-page">
      <div className="container">
        <div className="status-card status-card--error reveal fade-up" data-reveal>
          <div className="status-icon">✕</div>
          <h1>Suscripción cancelada</h1>
          <p>El proceso de pago fue cancelado.</p>
          <p className="text-sm">Puedes intentar de nuevo en cualquier momento.</p>
          <button className="btn btn-primary" onClick={() => navigate('/subscribe')}>
            Volver a intentar
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => navigate('/dashboard')}
            style={{ marginTop: '12px' }}
          >
            Ir al panel
          </button>
        </div>
      </div>
    </section>
  );
};
