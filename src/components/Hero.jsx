import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-bg">
                {/* Placeholder for video or high-end image */}
                <div className="hero-overlay"></div>
            </div>

            <div className="container hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="hero-subtitle">Photographe &bull; Cameraman</h2>
                </motion.div>

                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Capturer l'Instant.<br />
                    <span className="text-accent">Écrire l'Histoire.</span>
                </motion.h1>

                <motion.p
                    className="hero-desc"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    Une vision unique pour vos projets visuels et narratifs.
                </motion.p>

                <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <Link to="/portfolio" className="btn-primary">
                        Voir le Portfolio
                    </Link>
                    <Link to="/contact" className="btn-outline">
                        Me Contacter
                    </Link>
                </motion.div>
            </div>

            <motion.div
                className="scroll-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <ArrowDown size={32} />
            </motion.div>

            <style>{`
        .hero {
          position: relative;
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, #1a1a1a 0%, #000000 100%);
          z-index: -1;
        }
        
        /* Optional: Abstract shapes or grain could be added here */
        .hero-bg::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
            opacity: 0.4;
        }

        .hero-content {
          text-align: center;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-subtitle {
          font-family: var(--font-main);
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--color-accent);
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .hero-title {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }
        
        .text-accent {
            color: var(--color-accent); /* Optional: different shade or Keep white? actually 'text-accent' usually implies color but design might prefer just white or italic */
            /* Let's keep it white but italic for now, or gold? "Écrire l'Histoire" in Gold looks good */
            color: var(--color-text); /* Override to white for elegance, maybe italic */
            font-style: italic;
        }

        .hero-desc {
          font-size: 1.25rem;
          color: var(--color-text-muted);
          max-width: 600px;
          margin-bottom: 3rem;
        }

        .hero-actions {
          display: flex;
          gap: 1.5rem;
        }

        .btn-outline {
          padding: 0.75rem 1.75rem;
          border: 1px solid rgba(255,255,255,0.2);
          color: var(--color-text);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
        }

        .btn-outline:hover {
          border-color: var(--color-text);
          background: rgba(255,255,255,0.05);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          color: var(--color-text-muted);
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
          60% {transform: translateY(-5px);}
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-desc {
            font-size: 1rem;
          }
          .hero-actions {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
          }
          .btn-primary, .btn-outline {
            text-align: center;
            width: 100%;
          }
        }
      `}</style>
        </section>
    );
};

export default Hero;
