import { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import useFetchPhotos from '../hooks/useFetchPhotos';
import {
  favoritesReducer,
  getInitialFavorites,
  FAVORITES_ACTIONS,
  FAVORITES_STORAGE_KEY,
} from '../reducers/favoritesReducer';
import PhotoCard from './PhotoCard';
import LoadingSpinner from './LoadingSpinner';

/**
 * Gallery Component
 * 
 * Core coordinator component that:
 * - Fetches photos via the custom useFetchPhotos hook (Requirement 2 & 6)
 * - Manages favorites state with useReducer & localStorage sync (Requirement 5)
 * - Implements live author search with useCallback & useMemo (Requirement 4 & 7)
 * - Renders responsive photo grid: 1 col (mobile), 2 cols (tablet), 4 cols (desktop) (Requirement 3)
 */
export default function Gallery() {
  // 1. Fetch data through custom hook (Requirement 2 & 6)
  const { photos, loading, error } = useFetchPhotos();

  // 2. Local search query state (useState is permitted for search input)
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Favorites state managed via useReducer with lazy localStorage initializer (Requirement 5)
  const [favorites, dispatch] = useReducer(
    favoritesReducer,
    [],
    getInitialFavorites
  );

  // 4. Persist favorites to localStorage whenever the collection changes (Requirement 5)
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.error('Failed to persist favorites to localStorage:', err);
    }
  }, [favorites]);

  // 5. Memoized search input handler (Requirement 4 & 7)
  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  // Handler to clear search and restore full list
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Memoized favorite toggle dispatcher (Requirement 5)
  const handleToggleFavorite = useCallback((photoId) => {
    dispatch({
      type: FAVORITES_ACTIONS.TOGGLE_FAVORITE,
      payload: photoId,
    });
  }, []);

  // 6. Memoized filtered photos calculation (Requirement 4 & 7)
  const filteredPhotos = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) {
      return photos;
    }
    return photos.filter((photo) =>
      photo.author ? photo.author.toLowerCase().includes(trimmed) : false
    );
  }, [photos, searchQuery]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Search and Filter Control Area */}
      <div className="max-w-2xl mx-auto mb-8">
        <label
          htmlFor="author-search"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Search by author name
        </label>
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <input
            id="author-search"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Type photographer name (e.g. Alejandro, Paul)..."
            className="w-full pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150"
            aria-label="Search photos by author name"
            disabled={loading || Boolean(error)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              aria-label="Clear author search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Status Counts & Badges */}
        <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-500 mt-3 px-1 gap-2">
          <span>
            {loading
              ? 'Fetching photos...'
              : `Showing ${filteredPhotos.length} of ${photos.length} photos`}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
            <svg
              className="w-3.5 h-3.5 text-red-500 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'} saved
          </span>
        </div>
      </div>

      {/* Loading State (Requirement 2) */}
      {loading && <LoadingSpinner />}

      {/* Error State (Requirement 2) */}
      {!loading && error && (
        <div
          role="alert"
          className="max-w-2xl mx-auto my-8 p-6 bg-red-50 border border-red-200 rounded-2xl text-center"
        >
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-red-900 mb-1">
            Failed to Load Photos
          </h2>
          <p className="text-sm text-red-700 max-w-md mx-auto mb-4">
            {error}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty State when Search Yields No Matches (Requirement 4) */}
      {!loading && !error && filteredPhotos.length === 0 && (
        <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">
            No matching authors found
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            No photographers match &ldquo;<span className="font-medium text-slate-700">{searchQuery}</span>&rdquo;.
          </p>
          <button
            type="button"
            onClick={handleClearSearch}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Responsive Photo Grid (Requirement 3: Desktop 4 cols, Tablet 2 cols, Mobile 1 col) */}
      {!loading && !error && filteredPhotos.length > 0 && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          data-testid="photo-grid"
        >
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isFavorite={favorites.includes(String(photo.id))}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}
