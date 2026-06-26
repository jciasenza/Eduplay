import { useNavigate } from 'react-router-dom';
import { SUBSCRIPTION_PLANS } from '@aventuras/shared';
import { CheckoutButton } from '../components/payments/CheckoutButton';
import { useAuth } from '../hooks/useAuth';
import { useScrollReveal } from '../hooks/useScrollReveal';

const stripePriceIds = {
  monthly: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || '',
  yearly: import.meta.env.VITE_STRIPE_PRICE_YEARLY || '',
  family: import.meta.env.VITE_STRIPE_PRICE_FAMILY || '',
};

export const Subscribe = () => {
  const navigate = useNavigate();
  const user = useAuth((state) => state.user);
  const userId = user?.id ?? 'guest';
  useScrollReveal();

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
          <p>Acceso ilimitado a todos los mundos y juegos educativos</p>
        </div>

        <div className="plans-grid reveal fade-up" data-reveal>
          {SUBSCRIPTION_PLANS.map((plan) => {
            const priceId = plan.stripePriceId || stripePriceIds[plan.type];
            const intervalLabel = plan.interval === 'year' ? 'anio' : 'mes';

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
                  <span className="plan-card__price">${(plan.price / 100).toFixed(2)}</span>
                  <span className="plan-card__interval">/{intervalLabel}</span>
                </div>

                <ul className="plan-card__features">
                  {plan.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>

                <div className="plan-card__cta">
                  {priceId ? (
                    <CheckoutButton
                      priceId={priceId}
                      planName={plan.name}
                      userId={userId}
                      onSuccess={handleSuccess}
                      onError={handleError}
                    />
                  ) : (
                    <>
                      <button className="btn btn-outline" disabled>
                        Configurar Stripe
                      </button>
                      <p className="plan-card__setup-note">
                        Falta el Price ID de este plan.
                      </p>
                    </>
                  )}
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
