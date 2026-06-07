import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ArrowLeft, Lock, CreditCard, CheckCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#f3f4f6',
            fontFamily: "'Inter', sans-serif",
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#6b7280',
            },
        },
        invalid: {
            color: '#ef4444',
            iconColor: '#ef4444',
        },
    },
};

const CheckoutForm = ({ service }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [status, setStatus] = useState('idle'); // idle | processing | success | error
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setStatus('processing');
        setErrorMessage('');

        const cardElement = elements.getElement(CardElement);

        // Create a payment method to validate the card
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setErrorMessage(error.message);
            setStatus('error');
        } else {
            // In production, you would send paymentMethod.id to your server
            // to create a PaymentIntent and confirm the payment.
            console.log('[PaymentMethod]', paymentMethod);

            // Simulate a successful payment after a brief delay
            setTimeout(() => {
                setStatus('success');
            }, 1500);
        }
    };

    if (status === 'success') {
        return (
            <div className="checkout-success">
                <div className="success-icon-wrapper">
                    <CheckCircle size={64} />
                </div>
                <h2>Paiement Réussi !</h2>
                <p>Merci pour votre réservation de <strong>{service?.title}</strong>.</p>
                <p className="success-subtitle">Vous recevrez un e-mail de confirmation sous peu.</p>
                <button className="btn-primary" onClick={() => navigate('/')}>
                    Retour à l'accueil
                </button>

                <style>{`
          .checkout-success {
            text-align: center;
            padding: 3rem 2rem;
            animation: fadeInUp 0.6s ease;
          }
          .success-icon-wrapper {
            color: #22c55e;
            margin-bottom: 1.5rem;
            animation: scaleIn 0.4s ease;
          }
          .checkout-success h2 {
            font-size: 2rem;
            margin-bottom: 0.75rem;
            color: var(--color-text);
          }
          .checkout-success p {
            color: var(--color-text-muted);
            font-size: 1.05rem;
            margin-bottom: 0.5rem;
          }
          .success-subtitle {
            margin-bottom: 2rem !important;
          }
          @keyframes scaleIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-header">
                <button type="button" className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    <span>Retour</span>
                </button>
            </div>

            {/* Service Summary */}
            <div className="order-summary">
                <h3 className="order-title">Récapitulatif</h3>
                <div className="order-row">
                    <span>{service?.title || 'Service'}</span>
                    <span className="order-price">{service?.price || '—'}</span>
                </div>
                <div className="order-divider" />
                <div className="order-row order-total">
                    <span>Total</span>
                    <span className="order-price">{service?.price || '—'}</span>
                </div>
            </div>

            {/* Card Input */}
            <div className="card-input-section">
                <label className="card-label">
                    <CreditCard size={18} />
                    <span>Informations de paiement</span>
                </label>
                <div className="card-element-wrapper">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
            </div>

            {errorMessage && (
                <div className="error-message">{errorMessage}</div>
            )}

            <button
                type="submit"
                className="pay-btn"
                disabled={!stripe || status === 'processing'}
            >
                {status === 'processing' ? (
                    <>
                        <Loader size={18} className="spin" />
                        <span>Traitement en cours…</span>
                    </>
                ) : (
                    <>
                        <Lock size={16} />
                        <span>Payer {service?.price || ''}</span>
                    </>
                )}
            </button>

            <p className="secure-note">
                <Lock size={14} />
                <span>Paiement sécurisé via Stripe</span>
            </p>

            <style>{`
        .checkout-form {
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
        }

        .form-header {
          margin-bottom: 2rem;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: var(--color-text-muted);
          font-size: 0.9rem;
          padding: 0.5rem 0;
          transition: color 0.3s ease;
        }
        .back-btn:hover {
          color: var(--color-accent);
        }

        /* Order Summary */
        .order-summary {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .order-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
          margin-bottom: 1rem;
          font-family: var(--font-main);
          font-weight: 600;
        }
        .order-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          color: var(--color-text);
          font-size: 0.95rem;
        }
        .order-price {
          font-weight: 600;
          color: var(--color-accent);
        }
        .order-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 0.75rem 0;
        }
        .order-total {
          font-weight: 700;
          font-size: 1.1rem;
        }

        /* Card Element */
        .card-input-section {
          margin-bottom: 1.5rem;
        }
        .card-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        .card-element-wrapper {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 1rem 1.25rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .card-element-wrapper:focus-within {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
        }

        /* Error */
        .error-message {
          color: #ef4444;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 6px;
        }

        /* Pay Button */
        .pay-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, var(--color-accent), #c9a227);
          color: #0a0a0a;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .pay-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.35);
        }
        .pay-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Secure Note */
        .secure-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          margin-top: 1.25rem;
          color: var(--color-text-muted);
          font-size: 0.8rem;
          opacity: 0.7;
        }
      `}</style>
        </form>
    );
};

export default CheckoutForm;
