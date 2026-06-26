import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  useScrollReveal();

  useEffect(() => {
    window.localStorage.setItem('eduplay-subscription-status', 'active');
    const timer = setTimeout(() => {
      navigate('/account');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <section className="subscription-status-page">
      <div className="container">
        <div className="status-card status-card--success reveal fade-up" data-reveal>
          <div className="status-icon">✓</div>
          <h1>¡Suscripción activada!</h1>
          <p>Bienvenido a EduPlay Premium. Ahora tienes acceso a todos los mundos.</p>
          <p className="text-sm">Te redirigiremos a tu cuenta familiar en unos momentos...</p>
          <button className="btn btn-primary" onClick={() => navigate('/account')}>
            Administrar cuenta
          </button>
        </div>
      </div>
    </section>
  );
};
