import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useMedia } from '../../context/MediaContext';
import ModalWrapper from '../../components/ModalWrapper';

const MediaUploadModal = ({ onClose, editingMedia }) => {
  const { posts, uploadFile, addMedia, fetchMedia } = useMedia();
  const [file, setFile] = useState(null);
  const [postId, setPostId] = useState(editingMedia?.post_id || '');
  const [category, setCategory] = useState(editingMedia?.category || 'photo');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) return setError('Choisir un fichier');
    setUploading(true);
    try {
      const url = await uploadFile(file);
      const mediaData = {
        title: file.name,
        description: '',
        url,
        type: file.type && file.type.startsWith('video') ? 'video' : 'photo',
        category: category,
        section: 'portfolio',
        post_id: postId || null,
      };
      await addMedia(mediaData);
      if (typeof fetchMedia === 'function') await fetchMedia();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  return (
    <ModalWrapper title={editingMedia ? 'Modifier Média (rudimentaire)' : 'Uploader un Média'} subtitle={editingMedia ? 'Ajustez le média et son association' : 'Ajouter un seul média rapidement'} onClose={onClose} size="sm">

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="media-upload-form">
          <div className="form-group">
            <label>Fichier</label>
            <div className="drop-zone" onDrop={handleDrop} onDragOver={(e)=>e.preventDefault()}>
              <input id="simple-file" type="file" accept="image/*,video/*" onChange={handleFileChange} aria-label="Choisir un fichier image ou vidéo" />
              <label htmlFor="simple-file" className="drop-label" tabIndex={0} role="button" aria-label="Ouvrir le sélecteur de fichiers" onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' ') document.getElementById('simple-file').click(); }}>
                <div className="drop-visual"><Upload size={20} /></div>
                <div className="drop-text">Glisser-déposez une image ou une vidéo</div>
                <div className="drop-sub">Formats acceptés: PNG, JPG, MP4 — taille max recommandée 50MB</div>
              </label>

              {file && <div className="file-preview" aria-live="polite">
                {file.type && file.type.startsWith('image') ? (<img src={URL.createObjectURL(file)} alt={file.name} />) : (<div className="file-icon">VID</div>)}
                <div className="file-meta"><div className="file-name">{file.name}</div><div className="file-size">{Math.round((file.size||0)/1024)} KB</div></div>
              </div>}
            </div>
          </div>

          <div className="form-group">
            <label>Associer à un post (optionnel)</label>
            <select value={postId || ''} onChange={(e) => setPostId(e.target.value)}>
              <option value="">Aucun</option>
              {posts && posts.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Catégorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="photo">Photographie</option>
              <option value="video">Vidéo</option>
              <option value="cinema">Cinéma</option>
              <option value="reportage-documentaire">Reportage / Documentaire</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={uploading}>{uploading ? 'Upload...' : 'Uploader le média'}</button>
          </div>
      </form>
      <style>{`
        .drop-zone{border:1px dashed rgba(255,255,255,0.06);padding:0.75rem;border-radius:10px;display:flex;flex-direction:column;align-items:center;gap:0.75rem;background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent)}
        .drop-label{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;color:var(--color-text-muted);padding:1rem;border-radius:8px;width:100%}
        .drop-visual{background:rgba(255,255,255,0.02);padding:10px;border-radius:10px}
        .drop-text{font-weight:700}
        .drop-sub{font-size:0.85rem;color:var(--color-text-muted)}
        .drop-zone input[type=file]{display:none}
        .drop-label:focus{outline:2px solid rgba(212,175,55,0.18);outline-offset:4px}
        .file-preview{display:flex;align-items:center;gap:0.75rem;background:rgba(0,0,0,0.04);padding:0.5rem;border-radius:8px;margin-top:0.5rem}
        .file-preview img{width:96px;height:72px;object-fit:cover;border-radius:6px;animation:thumb-in 240ms ease}
        .file-icon{width:96px;height:72px;background:#111;border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--color-text-muted)}
        .file-meta{display:flex;flex-direction:column}
        .file-name{font-size:0.95rem;color:var(--color-text);font-weight:700}
        .file-size{font-size:0.82rem;color:var(--color-text-muted)}
        .form-group label{display:block;margin-bottom:0.5rem;font-weight:700}
        .media-upload-form select{width:100%;padding:0.75rem;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:rgba(0,0,0,0.25);color:var(--color-text)}
        .form-actions{display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1rem}
        .btn-primary{background:var(--color-accent);color:#000;padding:0.55rem 1rem;border-radius:8px;border:none;font-weight:700}
        .btn-outline{background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--color-text);padding:0.45rem 0.9rem;border-radius:8px}
        @keyframes thumb-in{0%{opacity:0;transform:scale(0.96)}100%{opacity:1;transform:scale(1)}}
      `}</style>
    </ModalWrapper>
  );
};

export default MediaUploadModal;
