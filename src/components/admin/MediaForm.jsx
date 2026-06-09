import React, { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, Eye } from 'lucide-react';
import { useMedia } from '../../context/MediaContext';
import ModalWrapper from '../../components/ModalWrapper';

const MediaForm = ({ editingMedia, onClose }) => {
  const { addMedia, updateMedia, uploadFile, posts } = useMedia();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: 'photo',
    category: 'photo',
    section: 'portfolio',
    post_id: ''
  });
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingMedia) {
      setFormData({
        title: editingMedia.title || '',
        description: editingMedia.description || '',
        url: editingMedia.url || '',
        type: editingMedia.type || 'photo',
        category: editingMedia.category || 'photo',
        section: editingMedia.section || 'portfolio',
        post_id: editingMedia.post_id || ''
      });
    }
  }, [editingMedia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      let finalUrl = formData.url;

      if (file) {
        finalUrl = await uploadFile(file);
      }

      if (!finalUrl) {
        throw new Error('Vous devez fournir une URL ou uploader un fichier');
      }

      const mediaData = {
        ...formData,
        url: finalUrl
      };

      if (editingMedia) {
        await updateMedia(editingMedia.id, mediaData);
      } else {
        await addMedia(mediaData);
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ModalWrapper title={editingMedia ? 'Modifier le Média' : 'Ajouter un Média'} onClose={onClose} size="md">

      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit} className="media-form">
          <div className="form-group">
            <label>Titre</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="photo">Photo</option>
                <option value="video">Vidéo</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Catégorie</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="photo">Photographie</option>
                <option value="video">Vidéo</option>
                <option value="cinema">Cinéma</option>
                <option value="reportage-documentaire">Reportage / Documentaire</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Associer à un Post (optionnel)</label>
              <select name="post_id" value={formData.post_id} onChange={handleChange}>
                <option value="">Aucun</option>
                {posts && posts.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Section Cible</label>
              <select name="section" value={formData.section} onChange={handleChange}>
                <option value="portfolio">Portfolio</option>
                <option value="hero">Hero (Accueil)</option>
                <option value="home">Accueil (Autre)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Média (URL ou Upload)</label>
            <div className="media-input-group">
              <div className="input-with-icon">
                <LinkIcon size={16} />
                <input 
                  type="url" 
                  name="url" 
                  value={formData.url} 
                  onChange={handleChange} 
                  placeholder="https://..." 
                  disabled={!!file}
                />
              </div>
              <span>OU</span>
              <div className="file-upload">
                <input 
                  type="file" 
                  id="file-upload" 
                  onChange={handleFileChange} 
                  accept="image/*,video/*"
                  disabled={!!formData.url && !editingMedia}
                />
                <label htmlFor="file-upload" className="btn-outline-dark">
                  <Upload size={16} /> Parcourir
                </label>
                {file && <span className="file-name">{file.name}</span>}
              </div>
            </div>
          </div>

          {/* Preview */}
          {(formData.url || file) && formData.type === 'photo' && (
            <div className="preview-container">
              <label><Eye size={16} /> Aperçu</label>
              <div className="preview-img-wrapper">
                <img 
                  src={file ? URL.createObjectURL(file) : formData.url} 
                  alt="Aperçu" 
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>

      <style>{`
        .media-form {display:flex;flex-direction:column;gap:1.5rem}
        .form-row{display:flex;gap:1rem}
        .form-row .form-group{flex:1}
        .form-group label{display:flex;align-items:center;gap:0.5rem;font-size:0.9rem;color:var(--color-text-muted);margin-bottom:0.5rem}
        .form-group input[type="text"],.form-group input[type="url"],.form-group textarea,.form-group select{width:100%;padding:0.75rem;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);border-radius:4px;color:var(--color-text);font-family:var(--font-main)}
        .form-group input:focus,.form-group textarea:focus,.form-group select:focus{outline:none;border-color:var(--color-accent)}
        .media-input-group{display:flex;flex-direction:column;gap:1rem;background:rgba(0,0,0,0.3);padding:1rem;border-radius:4px;border:1px dashed rgba(255,255,255,0.1)}
        .input-with-icon{display:flex;align-items:center;gap:0.5rem;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:0 0.75rem}
        .input-with-icon input{border:none!important;background:transparent!important;padding-left:0!important}
        .file-upload{display:flex;align-items:center;gap:1rem}
        .file-upload input[type="file"]{display:none}
        .file-upload label{display:flex;align-items:center;gap:0.5rem;cursor:pointer;margin:0}
        .btn-outline-dark{padding:0.5rem 1rem;border:1px solid rgba(255,255,255,0.2);border-radius:4px;background:transparent;color:var(--color-text);transition:all 0.3s ease}
        .btn-outline-dark:hover{border-color:var(--color-accent);color:var(--color-accent)}
        .file-name{font-size:0.8rem;color:var(--color-accent);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}
        .preview-container{background:rgba(0,0,0,0.3);padding:1rem;border-radius:4px}
        .preview-img-wrapper{width:100%;height:200px;border-radius:4px;overflow:hidden;background:#000;display:flex;align-items:center;justify-content:center}
        .preview-img-wrapper img{max-width:100%;max-height:100%;object-fit:contain}
        .form-actions{display:flex;justify-content:flex-end;gap:1rem;margin-top:1rem}
        .error-msg{background:rgba(255,0,0,0.1);color:#ff4d4d;padding:1rem;border-radius:4px;margin-bottom:1rem}
      `}</style>
    </ModalWrapper>
  );
};

export default MediaForm;
