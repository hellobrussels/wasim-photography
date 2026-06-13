import React from 'react';
import { Pencil, Trash2, Image as ImageIcon, Film, Calendar } from 'lucide-react';

const MediaCard = ({ media, onEdit, onDelete }) => {
  const date = new Date(media.created_at).toLocaleDateString('fr-FR');

  return (
    <div className="media-card">
      <div className="media-thumb">
        {media.type === 'photo' ? (
          <img src={media.url} alt={media.title} />
        ) : (
          <div className="video-placeholder">
            <Film size={48} />
          </div>
        )}
        <div className="media-actions-overlay">
          <button className="action-btn edit" onClick={onEdit} title="Modifier">
            <Pencil size={18} />
          </button>
          <button className="action-btn delete" onClick={onDelete} title="Supprimer">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="media-info">
        <div className="media-type-badge">
          {media.type === 'photo' ? <ImageIcon size={14} /> : <Film size={14} />}
          {media.type === 'photo' ? 'Photo' : 'Vidéo'}
        </div>
        
        <h3>{media.title}</h3>
        {media.description && <p className="desc">{media.description}</p>}
        
        <div className="media-meta">
          <span className="tag category">{media.category}</span>
          <span className="tag section">{media.section}</span>
        </div>
        
        <div className="media-date">
          <Calendar size={12} /> {date}
        </div>
      </div>

      <style>{`
        .media-card {
          background: var(--color-bg-light);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
          transition: transform 0.3s ease, border-color 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .media-card:hover {
          transform: translateY(-5px);
          border-color: rgba(212, 175, 55, 0.3);
        }

        .media-thumb {
          position: relative;
          aspect-ratio: 16/9;
          background: #000;
          overflow: hidden;
        }

        .media-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .media-card:hover .media-thumb img {
          transform: scale(1.05);
        }

        .video-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
        }

        .media-actions-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .media-card:hover .media-actions-overlay {
          opacity: 1;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-light);
          color: var(--color-text);
          transition: all 0.3s ease;
          transform: translateY(20px);
        }

        .media-card:hover .action-btn {
          transform: translateY(0);
        }

        .action-btn.edit:hover {
          background: var(--color-accent);
          color: #000;
        }

        .action-btn.delete:hover {
          background: #ff4d4d;
          color: #fff;
        }

        .media-info {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          position: relative;
        }

        .media-type-badge {
          position: absolute;
          top: -12px;
          right: 1.5rem;
          background: var(--color-accent);
          color: #000;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }

        .media-info h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: var(--color-text);
        }

        .media-info .desc {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .media-meta {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
          margin-bottom: 1rem;
        }

        .tag {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          background: rgba(255,255,255,0.05);
          color: var(--color-text-muted);
        }

        .media-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default MediaCard;
