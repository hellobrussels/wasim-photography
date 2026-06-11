import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Video, PenTool, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReservationModal from './ReservationModal';

const iconMap = {
  camera: <Camera size={40} />,
  video: <Video size={40} />,
  penTool: <PenTool size={40} />
};

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('position', { ascending: true });

        if (error) throw error;
        setServices(data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des services:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleReserve = (service) => {
    setSelectedService(service);
    setShowReservationModal(true);
  };

  if (loading) {
    return (
      <section className="section-padding services-section">
        <div className="container">
          <h2 className="section-title text-center">Mes Services</h2>
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>Chargement...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding services-section">
        <div className="container">
          <h2 className="section-title text-center">Mes Services</h2>
          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>Erreur: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding services-section">
      <div className="container">
        <h2 className="section-title text-center">Mes Services</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className={`service-card ${service.is_popular ? 'popular' : ''}`}>
              <div className="service-icon">{iconMap[service.icon]}</div>
              <h3>{service.title}</h3>
              <p className="price">{service.price}</p>
              <ul className="features-list">
                {service.features && service.features.map((feat, i) => (
                  <li key={i}><Check size={16} className="check-icon" /> {feat}</li>
                ))}
              </ul>
              <button
                className="btn-service"
                onClick={() => handleReserve(service)}
              >
                Réserver
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .services-section {
          background-color: var(--color-bg);
        }
        
        .text-center { text-align: center; }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .service-card {
          background: var(--color-bg-light);
          padding: 3rem 2rem;
          border-radius: 4px;
          text-align: center;
          transition: transform 0.3s ease;
          border: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .service-card:hover {
          transform: translateY(-10px);
          border-color: var(--color-accent);
        }

        .service-card.popular {
          border: 1px solid var(--color-accent);
          position: relative;
        }
        
        .service-icon {
          color: var(--color-accent);
          margin-bottom: 1.5rem;
        }

        .service-card h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .price {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text-muted);
          margin-bottom: 2rem;
        }

        .features-list {
          text-align: left;
          width: 100%;
          margin-bottom: 2rem;
        }

        .features-list li {
          margin-bottom: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-muted);
        }

        .check-icon {
          color: var(--color-accent);
        }
        
        .btn-service {
          padding: 0.75rem 1.75rem;
          background: var(--color-accent);
          color: white;
          border: none;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-service:hover {
          background: #d4a837;
          color: black;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
        }
        
        .btn-outline-dark {
             padding: 0.75rem 1.75rem;
             border: 1px solid rgba(255,255,255,0.2);
             color: var(--color-text);
             background: transparent;
             text-transform: uppercase;
             font-weight: 600;
             transition: 0.3s;
        }
        .btn-outline-dark:hover {
            border-color: var(--color-accent);
            color: var(--color-accent);
        }
      `}</style>

      {showReservationModal && selectedService && (
        <ReservationModal 
          service={selectedService}
          onClose={() => setShowReservationModal(false)}
          onSuccess={() => {
            // Réinitialiser la modal après succès
            setSelectedService(null);
          }}
        />
      )}
    </section>
  );
};

export default Services;
