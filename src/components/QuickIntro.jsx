import React from 'react';

const QuickIntro = () => {
  return (
    <section className="quick-intro section-padding">
      <div className="container">
        <h4 className="section-subtitle">Présentation rapide</h4>
        <h2 className="quick-title">Capturer les moments qui comptent</h2>
        <p className="quick-text">Je suis Wasim, photographe spécialisé dans les portraits, événements et reportages. Mon objectif est de raconter des histoires authentiques à travers des images naturelles et intemporelles.</p>
      </div>

      <style>{`
        .quick-intro {
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 100%);
          color: var(--color-text);
        }

        .section-subtitle {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-accent);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .quick-title {
          font-size: 2rem;
          margin: 0.25rem 0 1rem 0;
          line-height: 1.2;
          color: var(--color-text);
        }

        .quick-text {
          max-width: 720px;
          color: var(--color-text-muted);
          font-size: 1.05rem;
        }

        @media (max-width: 768px) {
          .quick-title { font-size: 1.5rem; }
          .quick-text { font-size: 1rem; }
        }
      `}</style>
    </section>
  );
};

export default QuickIntro;
