import { useNavigate } from 'react-router-dom';
import { SUBSCRIPTION_PLANS } from '@aventuras/shared';
import { CheckoutButton } from '../components/payments/CheckoutButton';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const Subscribe = () => {
  const navigate = useNavigate();
  useScrollReveal();
  const currencyId = import.meta.env.VITE_MP_CURRENCY_ID || 'ARS';
  const formatPrice = (priceInCents: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currencyId,
      maximumFractionDigits: 2,
    }).format(priceInCents / 100);

  const handleSuccess = () => {
    navigate('/subscription/success');
  };

  const handleError = (error: string) => {
    console.error('Subscription error:', error);
  };

  return (
    <section className="subscribe-page">
      <div className="container">
        <div className="subscribe-header reveal fade-up" data-reveal>
          <h1>Elige tu plan</h1>
          <p>Acceso ilimitado a todos los mundos y juegos educativos con pago por Mercado Pago.</p>
        </div>

        <div className="plans-grid reveal fade-up" data-reveal>
          {SUBSCRIPTION_PLANS.map((plan) => {
            const intervalLabel = plan.interval === 'year' ? 'año' : 'mes';

            return (
              <article
                key={plan.type}
                className={`plan-card ${plan.popular ? 'plan-card--popular' : ''}`}
              >
                <div className="plan-card__header">
                  <h3>{plan.name}</h3>
                  <p className="plan-card__description">{plan.description}</p>
                </div>

                <div className="plan-card__pricing">
                  <span className="plan-card__price">{formatPrice(plan.price)}</span>
                  <span className="plan-card__interval">/{intervalLabel}</span>
                </div>

                <ul className="plan-card__features">
                  {plan.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>

                <div className="plan-card__cta">
                  <CheckoutButton
                    planType={plan.type}
                    planName={plan.name}
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </div>
              </article>
            );
          })}
        </div>

        <div className="subscribe-footer">
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
            Volver al panel
          </button>
        </div>
      </div>
    </section>
  );
};
