import React from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Film, BarChart3, Plus } from 'lucide-react';
import { useMedia } from '../../context/MediaContext';

const AdminDashboard = () => {
  const { mediaItems, loading } = useMedia();

  if (loading) return <div>Chargement des statistiques...</div>;

  const photosCount = mediaItems.filter(m => m.type === 'photo').length;
  const videosCount = mediaItems.filter(m => m.type === 'video').length;
  const recentMedia = mediaItems.slice(0, 5);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/admin/media" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Gérer les médias
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><BarChart3 size={24} /></div>
          <div className="stat-info">
            <h3>Total Médias</h3>
            <p>{mediaItems.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><ImageIcon size={24} /></div>
          <div className="stat-info">
            <h3>Photos</h3>
            <p>{photosCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Film size={24} /></div>
          <div className="stat-info">
            <h3>Vidéos</h3>
            <p>{videosCount}</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h2>Ajouts Récents</h2>
        <div className="recent-grid">
          {recentMedia.length === 0 ? (
            <p className="empty-state">Aucun média trouvé. Commencez par en ajouter !</p>
          ) : (
            recentMedia.map(media => (
              <div key={media.id} className="recent-card">
                <div className="recent-thumb">
                  {media.type === 'photo' ? (
                    <img src={media.url} alt={media.title} />
                  ) : (
                    <div className="video-placeholder"><Film size={32} /></div>
                  )}
                </div>
                <div className="recent-info">
                  <h4>{media.title}</h4>
                  <span className="badge">{media.category}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-family: var(--font-heading);
          color: var(--color-accent);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: var(--color-bg-light);
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          background: rgba(212, 175, 55, 0.1);
          color: var(--color-accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info h3 {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin-bottom: 0.25rem;
          font-family: var(--font-main);
        }

        .stat-info p {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--color-text);
        }

        .recent-section h2 {
          font-family: var(--font-heading);
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .recent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .recent-card {
          background: var(--color-bg-light);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .recent-thumb {
          aspect-ratio: 16/9;
          background: #000;
        }

        .recent-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
        }

        .recent-info {
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .recent-info h4 {
          font-size: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          color: var(--color-text-muted);
        }

        .empty-state {
          color: var(--color-text-muted);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
