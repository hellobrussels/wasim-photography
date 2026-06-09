import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useMedia } from '../../context/MediaContext';
import MediaUploadModal from '../../components/admin/MediaUploadModal';
import MediaCard from '../../components/admin/MediaCard';

const AdminMedia = () => {
  const { mediaItems, loading, deleteMedia } = useMedia();
  const [showForm, setShowForm] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const filteredItems = filterType === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === filterType);

  const handleEdit = (media) => {
    setEditingMedia(media);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce média ?')) {
      try {
        await deleteMedia(id);
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMedia(null);
  };

  if (loading) return <div>Chargement des médias...</div>;

  return (
    <div>
      <div className="media-header">
        <h1>Gestion des Médias</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <div className="media-filters">
        <Filter size={20} color="var(--color-text-muted)" />
        <button className={`filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>Tout</button>
        <button className={`filter-btn ${filterType === 'photo' ? 'active' : ''}`} onClick={() => setFilterType('photo')}>Photos</button>
        <button className={`filter-btn ${filterType === 'video' ? 'active' : ''}`} onClick={() => setFilterType('video')}>Vidéos</button>
      </div>

      <div className="media-grid">
        {filteredItems.length === 0 ? (
          <p className="empty-state">Aucun média trouvé.</p>
        ) : (
          filteredItems.map(media => (
            <MediaCard 
              key={media.id} 
              media={media} 
              onEdit={() => handleEdit(media)} 
              onDelete={() => handleDelete(media.id)} 
            />
          ))
        )}
      </div>

      {showForm && (
        <MediaUploadModal
          editingMedia={editingMedia}
          onClose={closeForm}
        />
      )}

      <style>{`
        .media-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .media-header h1 {
          font-family: var(--font-heading);
          color: var(--color-accent);
        }

        .media-filters {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          background: var(--color-bg-light);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .filter-btn {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .filter-btn:hover, .filter-btn.active {
          background: rgba(212, 175, 55, 0.1);
          color: var(--color-accent);
        }

        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .empty-state {
          color: var(--color-text-muted);
          font-style: italic;
          grid-column: 1 / -1;
        }
      `}</style>
    </div>
  );
};

export default AdminMedia;
