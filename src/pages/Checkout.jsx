import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import { ShieldCheck } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const location = useLocation();
  const service = location.state?.service;

  // Redirect if no service was selected
  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <section className="checkout-page section-padding">
      <div className="container">
        <div className="checkout-header">
          <div className="checkout-badge">
            <ShieldCheck size={18} />
            <span>Paiement Sécurisé</span>
          </div>
          <h1 className="checkout-title">Finaliser votre réservation</h1>
          <p className="checkout-subtitle">
            Complétez votre paiement pour réserver le service <strong>{service.title}</strong>.
          </p>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm service={service} />
        </Elements>
      </div>

      <style>{`
        .checkout-page {
          min-height: calc(100vh - var(--header-height));
          display: flex;
          align-items: flex-start;
          padding-top: calc(var(--header-height) + 3rem);
          background-color: var(--color-bg);
        }

        .checkout-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .checkout-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.25);
          color: var(--color-accent);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 1.25rem;
        }

        .checkout-title {
          font-size: 2.25rem;
          margin-bottom: 0.75rem;
          background: linear-gradient(135deg, var(--color-text), var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .checkout-subtitle {
          color: var(--color-text-muted);
          font-size: 1.05rem;
          max-width: 480px;
          margin: 0 auto;
        }
        .checkout-subtitle strong {
          color: var(--color-accent);
        }
      `}</style>
    </section>
  );
};

export default Checkout;
