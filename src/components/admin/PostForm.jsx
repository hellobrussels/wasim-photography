import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useMedia } from '../../context/MediaContext';
import ModalWrapper from '../../components/ModalWrapper';

const PostForm = ({ editingPost, onClose }) => {
  const { addPost, updatePost, uploadFile, addMedia } = useMedia();

  const [form, setForm] = useState({ title: '', description: '', category: 'photo' });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingPost) {
      setForm({ title: editingPost.title || '', description: editingPost.description || '', category: editingPost.category || 'photo' });
    }
  }, [editingPost]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files || []);
    setFiles(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      let postRec;
      if (editingPost) {
        const res = await updatePost(editingPost.id, form);
        postRec = Array.isArray(res) ? res[0] : res;
      } else {
        const res = await addPost(form);
        postRec = Array.isArray(res) ? res[0] : (res && res[0]) || res;
      }

      const postId = postRec?.id || (editingPost && editingPost.id);

      // Upload files and create media records linked to the post
      for (const f of files) {
        const publicUrl = await uploadFile(f);
        const mediaData = {
          title: form.title,
          description: '',
          url: publicUrl,
          type: f.type && f.type.startsWith('video') ? 'video' : 'photo',
          category: form.category || 'photo',
          section: 'portfolio',
          post_id: postId
        };
        await addMedia(mediaData);
      }

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur');
    } finally {
      setUploading(false);
    }
  };


  return (
    <ModalWrapper title={editingPost ? 'Modifier le Post' : 'Nouveau Post'} subtitle={editingPost ? 'Mettez à jour les champs et médias associés' : 'Créez une série: titre, description et plusieurs médias'} onClose={onClose} size="md">

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Titre</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
          </div>

          <div className="form-group">
            <label>Catégorie</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="photo">Photographie</option>
              <option value="video">Vidéo</option>
              <option value="cinema">Cinéma</option>
              <option value="reportage-documentaire">Reportage / Documentaire</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ajouter des médias</label>
            <div className="drop-zone" onDrop={handleDrop} onDragOver={(e)=>e.preventDefault()}>
              <input id="post-files" type="file" multiple onChange={handleFiles} accept="image/*,video/*" aria-label="Choisir plusieurs fichiers" />
              <label htmlFor="post-files" className="drop-label" tabIndex={0} role="button" onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' ') document.getElementById('post-files').click(); }}>
                <div className="drop-icon"><Upload size={18} /></div>
                <div className="drop-main">Glisser-déposez vos fichiers ici</div>
                <div className="drop-sub">PNG, JPG, MP4 — vous pouvez ajouter plusieurs fichiers</div>
              </label>
            </div>

            {files.length > 0 && (
              <div className="files-grid" aria-live="polite">
                {files.map((f, i) => (
                  <div key={i} className="file-card">
                    {f.type && f.type.startsWith('image') ? (<img src={URL.createObjectURL(f)} alt={f.name} />) : (<div className="file-vid">VID</div>)}
                    <div className="file-meta"><div className="file-name" aria-label={`Fichier ${f.name}`}>{f.name}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={uploading}>{uploading ? 'Enregistrement...' : 'Enregistrer la série'}</button>
          </div>
      </form>
      <style>{`
        .form-group{margin-bottom:1rem}
        input, textarea, select{width:100%;padding:0.75rem;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:rgba(0,0,0,0.25);color:var(--color-text);font-size:0.98rem}
        textarea{min-height:120px}
        .drop-zone{border:1px dashed rgba(255,255,255,0.06);padding:0.75rem;border-radius:10px;display:block;background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent)}
        .drop-label{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;color:var(--color-text-muted);padding:1rem;border-radius:8px}
        .drop-icon{background:rgba(255,255,255,0.02);padding:8px;border-radius:8px}
        .drop-main{font-weight:700}
        .drop-sub{font-size:0.85rem;color:var(--color-text-muted)}
        .drop-zone input[type=file]{display:none}
        .files-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:0.75rem;margin-top:0.75rem}
        .file-card{background:rgba(0,0,0,0.06);padding:0.5rem;border-radius:8px;display:flex;flex-direction:column;gap:0.5rem;align-items:stretch}
        .file-card img{width:100%;height:96px;object-fit:cover;border-radius:6px;display:block}
        .file-meta{width:100%;display:flex;align-items:center;justify-content:space-between}
        .file-name{font-size:0.9rem;color:var(--color-text);font-weight:600}
        .file-vid{width:100%;height:96px;background:#111;border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--color-text-muted)}
        .form-actions{display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1rem}
        .btn-primary{background:var(--color-accent);color:#000;padding:0.6rem 1rem;border-radius:8px;border:none;font-weight:700}
        .btn-primary:disabled{opacity:0.6}
        .btn-outline{background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--color-text);padding:0.5rem 0.9rem;border-radius:8px}
      `}</style>
    </ModalWrapper>
  );
};

export default PostForm;
