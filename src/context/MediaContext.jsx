import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
const MediaContext = createContext(null);

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...options,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || payload.message || 'Erreur API');
  }

  return payload;
}

export function MediaProvider({ children }) {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/media');
      setMediaItems(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error);
      setMediaItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const addMedia = async (mediaData) => {
    const data = await apiRequest('/api/media', {
      method: 'POST',
      body: JSON.stringify(mediaData),
    });
    await fetchMedia();
    return data;
  };

  const updateMedia = async (id, updates) => {
    const data = await apiRequest(`/api/media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    await fetchMedia();
    return data;
  };

  const deleteMedia = async (id) => {
    await apiRequest(`/api/media/${id}`, { method: 'DELETE' });
    await fetchMedia();
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/api/media/upload`, {
      method: 'POST',
      body: formData,
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || 'Erreur d\u2019upload');
    }

    return payload.publicUrl;
  };

  const getMediaBySection = useCallback(
    (section) => mediaItems.filter((item) => item.section === section),
    [mediaItems]
  );

  const getMediaByCategory = useCallback(
    (category) => mediaItems.filter((item) => item.category === category),
    [mediaItems]
  );

  const value = {
    mediaItems,
    loading,
    addMedia,
    updateMedia,
    deleteMedia,
    uploadFile,
    getMediaBySection,
    getMediaByCategory,
  };

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
}
