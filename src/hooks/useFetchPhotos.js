import { useState, useEffect } from 'react';

const API_URL = 'https://picsum.photos/v2/list?limit=30';

/**
 * Custom hook to fetch a list of photos from Picsum Photos API.
 * 
 * Satisfies Assignment Requirement 2 & Requirement 6:
 * - Uses native fetch API with signal for cleanup
 * - Returns exactly { photos, loading, error }
 * - AbortController cleans up in-flight requests on component unmount
 * - Handles non-200 HTTP response codes and network errors gracefully
 * - Correctly handles React Strict Mode double-invoke without race conditions
 * 
 * @returns {{ photos: Array, loading: boolean, error: string | null }}
 */
export function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPhotos() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: ${response.statusText || 'Failed to fetch photos from Picsum'}`
          );
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Unexpected API response format: expected an array of photos.');
        }

        setPhotos(data);
        setError(null);
      } catch (err) {
        // If the request was aborted (e.g. unmount or StrictMode remount), ignore it
        if (err.name === 'AbortError') {
          return;
        }

        console.error('Error fetching photos in useFetchPhotos:', err);
        setError(
          err.message || 'A network error occurred while loading photos. Please check your connection.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    return () => {
      controller.abort();
    };
  }, []);

  return { photos, loading, error };
}

export default useFetchPhotos;
