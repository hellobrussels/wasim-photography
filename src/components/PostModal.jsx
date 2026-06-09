import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ModalWrapper from './ModalWrapper';

const PostModal = ({ open, onClose, post, media = [] }) => {
  const [index, setIndex] = useState(0);

  if (!open) return null;

  const current = media[index] || {};

  const prev = () => setIndex((i) => (i - 1 + media.length) % media.length);
  const next = () => setIndex((i) => (i + 1) % media.length);

  return (
    <ModalWrapper open={open} onClose={onClose} title={post?.title} size="lg">
      <div className="pm-body">
          <div className="pm-gallery">
            <button className="pm-nav left" onClick={prev}><ChevronLeft size={28} /></button>
            <div className="pm-media">
              {current.type === 'video' ? (
                <video src={current.url} controls style={{ maxWidth: '100%', maxHeight: '70vh' }} />
              ) : (
                <img src={current.url} alt={current.title || post?.title} onError={(e)=> e.target.style.display='none'} />
              )}
            </div>
            <button className="pm-nav right" onClick={next}><ChevronRight size={28} /></button>
          </div>

          <div className="pm-info">
            <h2>{post?.title}</h2>
            <p className="pm-desc">{post?.description}</p>

            <div className="pm-thumbs" role="list">
              {media.map((m, idx) => (
                <button key={m.id || idx} className={`thumb ${idx === index ? 'active' : ''}`} onClick={() => setIndex(idx)} aria-label={`Afficher média ${idx+1} de ${media.length}`}>
                  {m.type === 'video' ? (
                    <div className="thumb-video" aria-hidden>VID</div>
                  ) : (
                    <img src={m.url} alt={m.title || `thumb-${idx}`} onError={(e)=> e.target.style.display='none'} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

      <style>{`
        .pm-body{display:flex;gap:1rem;align-items:flex-start}
        .pm-gallery{flex:2;display:flex;align-items:center;justify-content:center;position:relative}
        .pm-media{max-width:100%;max-height:70vh;display:flex;align-items:center;justify-content:center}
        .pm-media img{max-width:100%;max-height:70vh;object-fit:contain}
        .pm-nav{position:relative;background:rgba(0,0,0,0.4);border:none;color:var(--color-text);cursor:pointer;padding:0.25rem 0.5rem;border-radius:6px}
        .pm-info{flex:1;max-width:360px}
        .pm-desc{color:var(--color-text-muted)}
        .pm-thumbs{display:flex;gap:0.5rem;margin-top:1rem;flex-wrap:wrap}
        .thumb{width:64px;height:48px;padding:0;border:0;background:transparent;cursor:pointer;border-radius:4px;overflow:hidden;transition:transform 160ms ease, box-shadow 160ms ease}
        .thumb img{width:100%;height:100%;object-fit:cover;animation:thumb-in 240ms ease}
        .thumb:focus{outline:2px solid rgba(212,175,55,0.18)}
        .thumb:hover{transform:translateY(-4px);box-shadow:0 6px 18px rgba(0,0,0,0.45)}
        .thumb.active{outline:2px solid var(--color-accent)}
        @keyframes thumb-in{0%{opacity:0;transform:scale(0.96)}100%{opacity:1;transform:scale(1)}}
        .thumb-video{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#111;color:var(--color-text-muted)}
      `}</style>
    </ModalWrapper>
  );
};

export default PostModal;
