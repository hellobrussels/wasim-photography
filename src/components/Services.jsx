import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Video, PenTool, Check } from 'lucide-react';

const services = [
  {
    icon: <Camera size={40} />,
    title: 'Photographie',
    price: 'À partir de 300€',
    features: ['Shooting Studio/Extérieur', 'Retouche HD', 'Galerie Privée', '15 Photos Numériques']
  },
  {
    icon: <Video size={40} />,
    title: 'Vidéo',
    price: 'À partir de 600€',
    isPopular: true,
    features: ['Tournage 4K', 'Montage Dynamique', 'Colorimétrie', 'Sound Design']
  },
  {
    icon: <PenTool size={40} />,
    title: 'Scénario',
    price: 'Sur Devis',
    features: ['Script Doctoring', 'Écriture Complète', 'Structure Dramatique', 'Dialogues']
  }
];

const Services = () => {
  const navigate = useNavigate();

  const handleReserve = (service) => {
    navigate('/checkout', { state: { service: { title: service.title, price: service.price } } });
  };

  return (
    <section className="section-padding services-section">
      <div className="container">
        <h2 className="section-title text-center">Mes Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className={`service-card ${service.isPopular ? 'popular' : ''}`}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p className="price">{service.price}</p>
              <ul className="features-list">
                {service.features.map((feat, i) => (
                  <li key={i}><Check size={16} className="check-icon" /> {feat}</li>
                ))}
              </ul>
              <button
                className={`btn-service ${service.isPopular ? 'btn-primary' : 'btn-outline-dark'}`}
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
    </section>
  );
};

export default Services;
