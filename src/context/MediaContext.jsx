import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const MediaContext = createContext(null);

export function MediaProvider({ children }) {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error loading media:', error);
        setMediaItems([]);
      } else {
        setMediaItems(data || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des médias:', err);
      setMediaItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Note: keep existing upload/CRUD helpers using API if present in project.
  const addMedia = async (mediaData) => {
    const { data, error } = await supabase.from('media').insert([mediaData]);
    if (error) throw error;
    await fetchMedia();
    return data;
  };

  const updateMedia = async (id, updates) => {
    const { data, error } = await supabase.from('media').update(updates).eq('id', id);
    if (error) throw error;
    await fetchMedia();
    return data;
  };

  const deleteMedia = async (id) => {
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
    await fetchMedia();
  };

  const uploadFile = async (file) => {
    // If you use Supabase storage, upload here. Fallback: return null.
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('media').upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) throw error;
      const publicUrl = supabase.storage.from('media').getPublicUrl(data.path).publicURL;
      return publicUrl;
    } catch (err) {
      console.error('Erreur upload fichier:', err);
      throw err;
    }
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
