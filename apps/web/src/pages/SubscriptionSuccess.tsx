import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { supabase } from '../lib/supabase';

export const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  useScrollReveal();
  const [message, setMessage] = useState('Procesando el pago...');

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const syncPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const paymentId = params.get('payment_id') || params.get('collection_id');
      let confirmed = !paymentId;

      if (paymentId) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        const baseUrl =
          import.meta.env.VITE_API_BASE_URL ||
          import.meta.env.VITE_API_URL ||
          'http://localhost:3000';

        if (accessToken) {
          const response = await fetch(`${baseUrl}/api/payments/mp/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ paymentId }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Sync payment error:', errorText);
          } else {
            confirmed = true;
          }
        } else {
          console.warn('No session disponible para confirmar el pago en el backend.');
        }
      }

      if (mounted) {
        if (confirmed) {
          window.localStorage.setItem('eduplay-subscription-status', 'active');
          setMessage('Pago confirmado. Te redirigimos a tu cuenta...');
        } else {
          setMessage('No pudimos confirmar el pago todavía. Te redirigimos a tu cuenta igual.');
        }
      }

      timer = setTimeout(() => {
        navigate('/account');
      }, 2500);
    };

    void syncPayment();

    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <section className="subscription-status-page">
      <div className="container">
        <div className="status-card status-card--success reveal fade-up" data-reveal>
          <div className="status-icon">✓</div>
          <h1>¡Suscripción activada!</h1>
          <p>Bienvenido a EduPlay Premium. Ahora tienes acceso a todos los mundos.</p>
          <p className="text-sm">{message}</p>
          <button className="btn btn-primary" onClick={() => navigate('/account')}>
            Administrar cuenta
          </button>
        </div>
      </div>
    </section>
  );
};
