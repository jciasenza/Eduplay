import type { FC } from 'react';
import { useState } from 'react';
import type { PlanType } from '@aventuras/shared';
import { getApiBaseUrl } from '../../lib/api';
import { supabase } from '../../lib/supabase';

interface CheckoutButtonProps {
  planType: PlanType;
  planName: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const CheckoutButton: FC<CheckoutButtonProps> = ({
  planType,
  planName,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtenemos la session de supabase desde el cliente exportado
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const response = await fetch(`${getApiBaseUrl()}/api/payments/mp/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          planType,
          backUrl: `${window.location.origin}/subscription/success`,
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.text();
        try {
          const parsed = JSON.parse(errorPayload) as { message?: string | string[] };
          const message = Array.isArray(parsed.message)
            ? parsed.message.join(', ')
            : parsed.message;
          throw new Error(message || 'Error al crear sesión de pago con Mercado Pago');
        } catch {
          throw new Error(errorPayload || 'Error al crear sesión de pago con Mercado Pago');
        }
      }

      const { checkoutUrl } = await response.json();

      if (!checkoutUrl) {
        throw new Error('No se recibió la URL de pago del servidor');
      }

      window.location.assign(checkoutUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-button-container">
      <button
        className="btn btn-primary"
        onClick={handleCheckout}
        disabled={isLoading}
      >
        {isLoading ? 'Procesando...' : `Suscribirse a ${planName}`}
      </button>
      {error && <p className="alert alert-error" style={{ color: 'var(--color-error)', marginTop: '8px', fontSize: '14px' }}>{error}</p>}
    </div>
  );
};
