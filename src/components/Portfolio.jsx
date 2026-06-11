import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Film, FileText } from 'lucide-react';
import PostModal from './PostModal';
import { useMedia } from '../context/MediaContext';

const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'photo', label: 'Photographie' },
  { id: 'video', label: 'Vidéo' },
  { id: 'cinema', label: 'Cinéma' },
  { id: 'reportage-documentaire', label: 'Reportage / Documentaire' },
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
    
];

const Portfolio = () => {
    const [filter, setFilter] = useState('all');
    const { getMediaBySection, posts, getMediaByPost } = useMedia();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPost, setModalPost] = useState(null);
  const [modalMedia, setModalMedia] = useState([]);
    
    // Build portfolio items from posts that have associated media.
    // Only include posts with at least one media attached. Use the first media as thumbnail.
    let portfolioItems = posts
      .map((post) => {
        const medias = getMediaByPost(post.id) || [];
        if (medias.length === 0) return null;
        const primary = medias[0];
        return {
          id: post.id,
          title: post.title,
          description: post.description,
          category: post.category || primary.category || 'photo',
          url: primary.url,
          type: primary.type || 'photo',
          post_id: post.id,
        };
      })
      .filter(Boolean);

    // Fallback if no posts with media in database
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
                                  {item.category === 'cinema' && <Film size={24} />}
                                  {item.category === 'reportage-documentaire' && <FileText size={24} />}
                                  {item.category === 'script' && <FileText size={24} />}
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.description || item.desc}</p>

                                <div className="center-action" role="button" tabIndex={0} onClick={() => {
                                  // open modal showing all media for the post if present
                                  if (item.post_id) {
                                  const post = posts.find(p => p.id === item.post_id) || { title: 'Série', description: '' };
                                  const medias = getMediaByPost(item.post_id);
                                  setModalPost(post);
                                  setModalMedia(medias.length ? medias : [item]);
                                  } else {
                                  setModalPost({ title: item.title, description: item.description || item.desc });
                                  setModalMedia([item]);
                                  }
                                  setModalOpen(true);
                                }}>
                                  <div className="pulse-icon">Voir la série</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                </motion.div>
                  {modalOpen && (
                    <PostModal open={modalOpen} onClose={() => setModalOpen(false)} post={modalPost} media={modalMedia} />
                  )}
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
        .center-action{display:flex;align-items:center;justify-content:center}
        .center-action .pulse-icon{background:rgba(0,0,0,0.6);border:2px solid rgba(255,255,255,0.06);color:var(--color-text);padding:0.75rem 1rem;border-radius:999px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,0.6);font-weight:600;display:inline-block;position:relative;z-index:1}
        .center-action .pulse-icon:hover{transform:translateY(-3px)}
        .center-action .pulse-icon{animation:pop 1.8s infinite}
        @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.06)}100%{transform:scale(1)}}
        .center-action .pulse-icon::after{content:'';position:absolute;left:50%;top:50%;width:140px;height:140px;border-radius:50%;background:rgba(255,255,255,0.02);transform:translate(-50%,-50%) scale(0.7);animation:rad 1.8s infinite;z-index:0;pointer-events:none}
        @keyframes rad{0%{transform:translate(-50%,-50%) scale(0.7);opacity:0.6}100%{transform:translate(-50%,-50%) scale(1.6);opacity:0}}
      `}</style>
        </section>
    );
};

export default Portfolio;
