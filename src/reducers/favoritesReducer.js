/**
 * Action Types for Favorites Reducer
 */
export const FAVORITES_ACTIONS = {
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  LOAD_FAVORITES: 'LOAD_FAVORITES',
};

export const FAVORITES_STORAGE_KEY = 'photo_gallery_favorites';

/**
 * Safely retrieves initial favorites from browser localStorage.
 * Used as the lazy initializer function in useReducer.
 * 
 * Handles edge cases:
 * - Missing localStorage key
 * - Malformed JSON strings
 * - Data that is not an array (e.g. stored object or number)
 * - Removes any potential duplicate IDs
 * 
 * @returns {Array<string>} Array of favorite photo IDs
 */
export function getInitialFavorites() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      // Ensure IDs are strings and unique
      const uniqueIds = Array.from(new Set(parsed.map(String)));
      return uniqueIds;
    }
    return [];
  } catch (error) {
    console.warn('Failed to parse favorites from localStorage, safely resetting to empty array:', error.message);
    return [];
  }
}

/**
 * Pure reducer function managing the list of favorite photo IDs.
 * 
 * @param {Array<string>} state - Current array of favorite photo IDs
 * @param {{ type: string, payload: any }} action - Dispatched action
 * @returns {Array<string>} Updated array of favorite photo IDs
 */
export function favoritesReducer(state, action) {
  switch (action.type) {
    case FAVORITES_ACTIONS.TOGGLE_FAVORITE: {
      const photoId = String(action.payload);
      const isFavorite = state.includes(photoId);

      if (isFavorite) {
        // Remove from favorites
        return state.filter((id) => id !== photoId);
      } else {
        // Add to favorites (guarantee uniqueness)
        return [...state, photoId];
      }
    }

    case FAVORITES_ACTIONS.LOAD_FAVORITES: {
      if (Array.isArray(action.payload)) {
        return Array.from(new Set(action.payload.map(String)));
      }
      return state;
    }

    default:
      return state;
  }
}
