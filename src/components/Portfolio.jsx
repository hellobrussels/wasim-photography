import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Film, FileText, ExternalLink } from 'lucide-react';
import { useMedia } from '../context/MediaContext';

const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'photo', label: 'Photographie' },
    { id: 'video', label: 'Vidéo' },
    { id: 'script', label: 'Scénario' },
];

const defaultItems = [
    {
        id: 1,
        title: 'Lumière et Ombre',
        category: 'photo',
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1600',
        desc: 'Série de portraits en studio.'
    },
    {
        id: 2,
        title: 'Le Dernier Souffle',
        category: 'video',
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1600',
        desc: 'Court-métrage dramatique primé.'
    },
    {
        id: 3,
        title: 'Échos du Passé',
        category: 'script',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1600',
        desc: 'Scénario de long-métrage (Thriller).'
    },
];

const Portfolio = () => {
    const [filter, setFilter] = useState('all');
    const { getMediaBySection } = useMedia();
    
    let portfolioItems = getMediaBySection('portfolio');
    
    // Fallback if no media in database
    if (portfolioItems.length === 0) {
        portfolioItems = defaultItems.map(item => ({...item, url: item.image, type: item.category === 'photo' ? 'photo' : 'video'}));
    }

    const filteredItems = filter === 'all'
        ? portfolioItems
        : portfolioItems.filter(item => item.category === filter);

    return (
        <section className="section-padding">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Portfolio</h2>
                    <div className="filter-buttons">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                                onClick={() => setFilter(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div layout className="portfolio-grid">
                    <AnimatePresence>
                        {filteredItems.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                key={item.id}
                                className="portfolio-item group"
                            >
                                <div className="item-image-wrapper">
                                    {item.type === 'photo' || item.category === 'photo' ? (
                                        <img src={item.url || item.image} alt={item.title} className="item-image" />
                                    ) : (
                                        <div className="item-image" style={{background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <Film size={64} color="var(--color-text-muted)" />
                                        </div>
                                    )}
                                    <div className="item-overlay">
                                        <div className="overlay-content">
                                            <div className="cat-icon-wrapper">
                                                {item.category === 'photo' && <Image size={24} />}
                                                {item.category === 'video' && <Film size={24} />}
                                                {item.category === 'script' && <FileText size={24} />}
                                            </div>
                                            <h3>{item.title}</h3>
                                            <p>{item.description || item.desc}</p>
                                            <button className="view-btn">
                                                <ExternalLink size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            <style>{`
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: var(--color-text);
        }

        .filter-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          background: transparent;
          color: var(--color-text-muted);
          padding: 0.5rem 1.5rem;
          border-bottom: 2px solid transparent;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .filter-btn:hover,
        .filter-btn.active {
          color: var(--color-accent);
          border-bottom-color: var(--color-accent);
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .portfolio-item {
          border-radius: 4px;
          overflow: hidden;
          background: var(--color-bg-light);
        }

        .item-image-wrapper {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
        }

        .item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .portfolio-item:hover .item-image {
          transform: scale(1.05);
        }

        .item-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.7);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .portfolio-item:hover .item-overlay {
          opacity: 1;
        }

        .overlay-content {
          text-align: center;
          transform: translateY(20px);
          transition: transform 0.3s ease;
          padding: 1rem;
        }

        .portfolio-item:hover .overlay-content {
          transform: translateY(0);
        }

        .cat-icon-wrapper {
          color: var(--color-accent);
          margin-bottom: 0.5rem;
        }

        .overlay-content h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .overlay-content p {
          color: var(--color-text-muted);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .view-btn {
          background: transparent;
          border: 1px solid var(--color-accent);
          color: var(--color-accent);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .view-btn:hover {
          background: var(--color-accent);
          color: #000;
        }
      `}</style>
        </section>
    );
};

export default Portfolio;
