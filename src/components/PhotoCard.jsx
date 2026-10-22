import { useState } from 'react';

/**
 * PhotoCard Component
 * 
 * Displays an individual photo with:
 * - High quality resized image with graceful error handling
 * - Author's name
 * - Accessible, interactive heart toggle button for favorites
 * 
 * @param {{
 *   photo: { id: string, author: string, download_url: string, width: number, height: number },
 *   isFavorite: boolean,
 *   onToggleFavorite: (id: string) => void
 * }} props
 */
export default function PhotoCard({ photo, isFavorite, onToggleFavorite }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Optimized image URL (600x400) for faster loading and responsive layout
  const optimizedImageUrl = `https://picsum.photos/id/${photo.id}/600/400`;

  const handleToggle = () => {
    onToggleFavorite(photo.id);
  };

  return (
    <article
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
      data-testid={`photo-card-${photo.id}`}
    >
      {/* Photo Container with fixed 3:2 aspect ratio */}
      <div className="relative aspect-[3/2] w-full bg-slate-100 overflow-hidden">
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-slate-200/70 animate-pulse flex items-center justify-center">
            <span className="sr-only">Loading image...</span>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <svg
              className="w-10 h-10 mb-2 stroke-current"
              fill="none"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <span className="text-xs font-medium">Image unavailable</span>
          </div>
        ) : (
          <img
            src={optimizedImageUrl}
            alt={`Captured by ${photo.author}`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              // If resized URL fails, fallback to photo.download_url, else mark as error
              setHasError(true);
            }}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Favorite Heart Badge Overlay (convenient for mobile & fast click) */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={
            isFavorite
              ? `Remove photo by ${photo.author} from favorites`
              : `Add photo by ${photo.author} to favorites`
          }
          aria-pressed={isFavorite}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
            isFavorite
              ? 'bg-white/95 text-red-500 shadow-md scale-100'
              : 'bg-black/30 text-white/90 hover:bg-white/90 hover:text-red-500'
          }`}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 active:scale-75 ${
              isFavorite ? 'fill-current' : 'fill-transparent stroke-current stroke-2'
            }`}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
      </div>

      {/* Card Details */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase font-semibold tracking-wider text-slate-600">
            Photographer
          </p>
          <h3
            className="text-base font-semibold text-slate-800 truncate"
            title={photo.author}
          >
            {photo.author}
          </h3>
        </div>

        {/* Favorite Status Indicator Button */}
        <button
          type="button"
          onClick={handleToggle}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            isFavorite
              ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          aria-label={
            isFavorite
              ? `Favorited photo by ${photo.author}. Click to remove.`
              : `Favorite photo by ${photo.author}`
          }
        >
          <svg
            className={`w-3.5 h-3.5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'fill-none stroke-current stroke-2'
            }`}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <span>{isFavorite ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </article>
  );
}
