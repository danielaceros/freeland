// components/StripePayment.tsx
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

interface StripePaymentProps {
  amount: number; // Amount in dollars (e.g., $10)
  productName: string;
}

const StripePayment: React.FC<StripePaymentProps> = ({ amount, productName }) => {
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, productName }),
      });

      const data = await res.json();

      if (data.id) {
        const stripe = await loadStripe('your_stripe_public_key'); // Replace with your public key
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.id });
        }
      }
    } catch (error) {
      console.error('Error during Stripe checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleStripeCheckout}
      disabled={loading}
      className="rounded-md bg-freeland px-6 py-2 text-white hover:bg-blue-700 focus:outline-none"
    >
      {loading ? 'Cargando...' : 'Contratar'}
    </button>
  );
};

export default StripePayment;
