# Photo Gallery Web Application

A clean, responsive, and accessible Photo Gallery web application built with **React**, **Vite**, and **Tailwind CSS** for the Celebrare Frontend React Internship Pre-Screening Assignment.

---

## 📸 Project Overview

This application displays a curated gallery of 30 photos fetched from the Picsum Photos API. It includes live client-side search by author name, an interactive favorites system that persists across page refreshes using browser `localStorage`, and an adaptive responsive grid layout.

The project strictly follows functional React best practices, employing custom hooks (`useFetchPhotos`), state management with `useReducer`, and performance optimization hooks (`useCallback`, `useMemo`).

---

## ✨ Key Features

- **Custom Fetch Hook (`useFetchPhotos`)**:
  - Automatically fetches 30 photos from `https://picsum.photos/v2/list?limit=30`.
  - Exposes `{ photos, loading, error }`.
  - Features pending request cancellation with `AbortController` and seamless React Strict Mode compatibility.
  - Handles non-200 HTTP responses and network failures gracefully.

- **Responsive Grid**:
  - **Desktop (≥ 1024px)**: 4 columns
  - **Tablet (≥ 768px)**: 2 columns
  - **Mobile (< 768px)**: 1 column
  - Cards feature a 3:2 fixed aspect ratio, smooth hover transitions, and accessible alt/aria labels.

- **Live Author Search**:
  - Fast, client-side case-insensitive search by photographer name.
  - Updates immediately without page reload and without making redundant API calls.
  - Preserves the original fetched photos list.
  - Includes a dedicated empty state with a "Clear Search" button when no photographers match.

- **Favorites System with `useReducer`**:
  - Centralized state transitions managed via `favoritesReducer.js`.
  - Supports `TOGGLE_FAVORITE` and `LOAD_FAVORITES` actions.
  - Stores unique photo IDs instead of full objects to keep memory and storage footprint minimal.
  - Automatically persists to and initializes safely from browser `localStorage`.
  - Resilient against corrupted or malformed `localStorage` data.

- **Optimized Performance**:
  - `useCallback` memoizes the search input handler and favorites dispatcher.
  - `useMemo` avoids recalculating the filtered photos array on unrelated renders.

- **Automated Tests**:
  - 17 unit tests verifying the favorites reducer, lazy initializer, edge cases, and search filter logic using Node.js built-in test runner (`node:test`).

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component-based UI with functional components and hooks |
| **Vite 8** | Ultra-fast development server and production bundler |
| **Tailwind CSS v4** | Modern utility-first CSS via `@tailwindcss/vite` |
| **Native Fetch API** | HTTP data fetching |
| **Picsum Photos API** | Public photography data source |
| **Node.js Test Runner** | Zero-dependency unit testing (`node:test`, `node:assert`) |

---

## 📁 Project Structure

```text
celebrare/
├── docs/
│   └── VIDEO_SCRIPT.md          # 5-minute video walkthrough script
├── public/
│   └── favicon.svg              # App icon
├── src/
│   ├── components/
│   │   ├── Gallery.jsx          # Main coordinator: search, favorites, grid
│   │   ├── LoadingSpinner.jsx   # Accessible loading state component
│   │   └── PhotoCard.jsx        # Individual photo card with heart toggle
│   ├── hooks/
│   │   └── useFetchPhotos.js    # Custom hook for fetching photos from API
│   ├── reducers/
│   │   └── favoritesReducer.js  # Pure reducer & localStorage initializer
│   ├── App.jsx                  # Top-level shell with header & footer
│   ├── index.css                # Tailwind CSS import & base styles
│   └── main.jsx                 # Application entry point with StrictMode
├── tests/
│   ├── favoritesReducer.test.js # Unit tests for reducer & storage edge cases
│   └── searchFilter.test.js     # Unit tests for author filtering logic
├── index.html                   # HTML entry point with metadata
├── package.json                 # Project dependencies & scripts
└── vite.config.js               # Vite configuration with Tailwind plugin
```

---

## 🚀 Installation & Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended; developed on v24)
- [npm](https://www.npmjs.com/) (v9 or higher)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mayanksinha17/celebrare-photo-gallery.git
   cd celebrare-photo-gallery
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Run unit tests**:
   ```bash
   npm test
   ```

5. **Run the linter**:
   ```bash
   npm run lint
   ```

6. **Create a production build**:
   ```bash
   npm run build
   ```
   To preview the production build locally:
   ```bash
   npm run preview
   ```

---

## 🌐 API Reference

The gallery consumes the public Picsum Photos API endpoint:
```http
GET https://picsum.photos/v2/list?limit=30
```

Each photo item returned has the following shape:
```json
{
  "id": "0",
  "author": "Alejandro Escamilla",
  "width": 5000,
  "height": 3333,
  "url": "https://unsplash.com/photos/yC-Yzbqy7PY",
  "download_url": "https://picsum.photos/id/0/5000/3333"
}
```

To optimize network bandwidth and image rendering speed, cards request a pre-scaled 600×400 thumbnail (`https://picsum.photos/id/${id}/600/400`) with graceful error fallback.

---

## 🧠 Core Concept Explanations

### 1. `useFetchPhotos` (Custom Hook)

- **Purpose**: Encapsulates all data-fetching logic, state, and cleanup outside of UI components.
- **Return Values**:
  - `photos` (`Array`): The loaded photos from the API.
  - `loading` (`boolean`): `true` while the request is in flight, `false` once finished.
  - `error` (`string | null`): Descriptive error message if the fetch fails; `null` on success.
- **Resilience**:
  - Uses `AbortController` to cancel pending HTTP requests if the component unmounts.
  - Correctly differentiates between deliberate aborts (`err.name === 'AbortError'`) and real network/HTTP errors so that React 18/19 Strict Mode double-invocation does not trigger false error screens.

### 2. `useReducer` for State Management

- **Why `useReducer` instead of `useState`?**:
  - The favorites feature requires structured transitions (toggling an ID, deduplication, loading persisted data).
  - `useReducer` cleanly separates state update logic from UI rendering in a pure, testable function (`favoritesReducer`).
- **Actions**:
  - `TOGGLE_FAVORITE`: Adds the photo ID if not present; removes it if already present.
  - `LOAD_FAVORITES`: Replaces the current state with an array of validated IDs (e.g., from an external store).
- **State Shape**: Stored as an array of ID strings (`['0', '1', '10']`) rather than full photo objects. This minimizes memory usage, keeps `localStorage` payloads lightweight, and prevents stale author or URL data if the API changes.

### 3. `localStorage` Persistence

- **Initialization**: Uses the third parameter of `useReducer`, `getInitialFavorites`, for lazy initialization. This runs only once during the initial mount, avoiding expensive `JSON.parse` operations on subsequent renders.
- **Safe Handling**: If `localStorage` is unavailable (e.g. private mode, SSR), contains malformed JSON, or contains non-array data, `getInitialFavorites` catches the error and safely falls back to `[]`.
- **Synchronization**: A `useEffect` hook in `Gallery.jsx` watches the `favorites` state and writes the serialized JSON to `localStorage` whenever `favorites` updates.

### 4. `useCallback`

- **What it returns**: A memoized version of the callback function whose reference stays stable across renders unless its specified dependencies change.
- **Why it is used**:
  - In `Gallery.jsx`, `handleSearchChange` is wrapped with `useCallback(..., [])` so that child components receiving this handler do not receive a newly instantiated function on every keystroke or render.
- **Dependencies**: `[]` (empty array) because the setter function `setSearchQuery` provided by `useState` is guaranteed to have a stable identity by React.
- **What happens if removed**: The code still works functionally, but a new function object is recreated in memory on every render.
- **Limitation**: `useCallback` does not automatically make the app faster; creating the memoized wrapper has a small cost and only provides performance benefits when passing callbacks to memoized child components (`React.memo`) or when used as dependencies in other hooks.

### 5. `useMemo`

- **What it returns**: A memoized calculation result cached until one of its dependencies changes.
- **Why it is used**:
  - In `Gallery.jsx`, `filteredPhotos` filters the 30-item `photos` array by the search query. Wrapping this in `useMemo` ensures that filtering only re-runs when either `photos` or `searchQuery` changes—not when unrelated state updates (such as clicking a favorite on another card).
- **Dependencies**: `[photos, searchQuery]`. If either the fetched photos change or the user types in the search box, the filter is recomputed.
- **What happens if removed**: The filtering calculation will re-execute on every single render of the `Gallery` component (for example, every time an item is favorited).
- **Limitation**: For small arrays (like 30 items), the computation time is negligible (< 1ms). `useMemo` should not be used everywhere blindly, as checking dependency equality carries slight overhead. However, it demonstrates proper performance architecture for larger datasets.

---

## ⚠️ Known Limitations

1. **Fixed Page Size**: The API call fetches a static limit of 30 photos (`limit=30`). Pagination or infinite scroll is omitted to adhere strictly to assignment boundaries.
2. **Offline Mode**: If the device loses internet access, previously loaded images may display from browser HTTP cache, but new photo fetches will show the error state until the connection is restored.
3. **Browser Storage Quota**: `localStorage` is restricted to ~5MB per origin. Storing IDs requires only a few bytes, but in enterprise applications with millions of items, an IndexedDB solution or backend database would be preferred.

---

## 🧪 Verification Summary

| Test / Check | Command | Result |
| :--- | :--- | :--- |
| Production Build | `npm run build` | ✅ Built in 184ms without warnings |
| Code Linting | `npm run lint` | ✅ 0 errors, 0 warnings across all files |
| Unit Tests | `npm test` | ✅ 17 / 17 tests passed |
| Browser Verification | Automated Subagent | ✅ Verified photo loading, responsive layout, search filter, empty state, favorites toggle, and localStorage persistence |

---

## 📄 License

Created for the Celebrare Frontend React Internship Pre-Screening Assignment.
