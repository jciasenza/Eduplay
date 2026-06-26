import type { FC } from 'react';
import { useState } from 'react';

interface CheckoutButtonProps {
  priceId: string;
  planName: string;
  userId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const CheckoutButton: FC<CheckoutButtonProps> = ({
  priceId,
  planName,
  userId,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate priceId
      if (!priceId) {
        throw new Error('Price ID not configured. Please contact support.');
      }

      const baseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        import.meta.env.VITE_API_URL ||
        'http://localhost:3000';

      // Create checkout session with backend
      const response = await fetch(`${baseUrl}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription/cancel`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { checkoutUrl } = await response.json();

      if (!checkoutUrl) {
        throw new Error('No checkout URL received from server');
      }

      window.location.assign(checkoutUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
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
        disabled={isLoading || !priceId}
        title={!priceId ? 'Plan not available' : undefined}
      >
        {isLoading ? 'Procesando...' : `Suscribirse a ${planName}`}
      </button>
      {error && <p className="alert alert-error">{error}</p>}
    </div>
  );
};
