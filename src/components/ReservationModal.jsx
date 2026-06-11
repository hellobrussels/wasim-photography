import React, { useState } from 'react';
import { X } from 'lucide-react';

const ReservationModal = ({ service, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientRequest: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/reserve-service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceName: service.title,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientRequest: formData.clientRequest,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
      
      // Fermer la modal après 2 secondes
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content reservation-modal">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2>Réserver {service.title}</h2>

        {success ? (
          <div className="success-message">
            <p>✅ Demande de réservation envoyée avec succès!</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#999' }}>
              Wasim vous contactera très bientôt pour confirmer votre réservation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="clientName">Votre nom *</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Jean Dupont"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="clientEmail">Votre email *</label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                placeholder="vous@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="clientRequest">Détails de votre requête *</label>
              <textarea
                id="clientRequest"
                name="clientRequest"
                value={formData.clientRequest}
                onChange={handleChange}
                placeholder="Décrivez votre projet, les dates souhaitées, le style recherché, etc..."
                rows="5"
                required
              ></textarea>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
            </button>
          </form>
        )}

        <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
          }

          .modal-content {
            background: var(--color-bg-light);
            border-radius: 8px;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.1);
            max-height: 90vh;
            overflow-y: auto;
          }

          .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal-close:hover {
            color: var(--color-accent);
          }

          .reservation-modal h2 {
            margin-top: 0;
            margin-bottom: 1.5rem;
            color: var(--color-accent);
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #fff;
          }

          .form-group input,
          .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            color: #fff;
            font-family: inherit;
            font-size: 1rem;
          }

          .form-group input:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: var(--color-accent);
            background: rgba(255, 255, 255, 0.08);
          }

          .form-group textarea {
            resize: vertical;
          }

          .error-message {
            color: #ff6b6b;
            margin-bottom: 1rem;
            padding: 0.75rem;
            background: rgba(255, 107, 107, 0.1);
            border-radius: 4px;
          }

          .success-message {
            padding: 1.5rem;
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
            border-radius: 4px;
            color: #4caf50;
            text-align: center;
          }

          .btn-primary {
            width: 100%;
            padding: 0.75rem 1.5rem;
            background: var(--color-accent);
            color: var(--color-text-dark);
            border: none;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s ease;
          }

          .btn-primary:hover:not(:disabled) {
            background: #e5a91f;
          }

          .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ReservationModal;
