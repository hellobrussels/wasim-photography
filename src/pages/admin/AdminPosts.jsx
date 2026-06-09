import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMedia } from '../../context/MediaContext';
import PostForm from '../../components/admin/PostForm';

const AdminPosts = () => {
  const { posts, getMediaByPost, deletePost } = useMedia();
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce post et dissocier ses médias ?')) return;
    try {
      await deletePost(id);
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const closeForm = () => {
    setEditingPost(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="media-header">
        <h1>Gestion des Posts</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Nouveau Post
        </button>
      </div>

      <div className="media-grid">
        {(!posts || posts.length === 0) ? (
          <p className="empty-state">Aucun post pour le moment.</p>
        ) : (
          posts.map(p => (
            <div key={p.id} className="post-card">
              <h3>{p.title}</h3>
              <p className="muted">{p.description}</p>
              <p className="muted small">Médias: {getMediaByPost(p.id).length}</p>
              <div className="card-actions">
                <button className="btn-outline" onClick={() => handleEdit(p)}>Éditer</button>
                <button className="btn-danger" onClick={() => handleDelete(p.id)}>Supprimer</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <PostForm editingPost={editingPost} onClose={closeForm} />
      )}

      <style>{`
        .media-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
        .media-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem}
        .post-card{background:var(--color-bg-light);padding:1rem;border-radius:8px}
        .muted{color:var(--color-text-muted)}
        .small{font-size:0.85rem}
        .card-actions{display:flex;gap:0.5rem;margin-top:0.75rem}
      `}</style>
    </div>
  );
};

export default AdminPosts;
