# 5-Minute Video Presentation Script
## Celebrare Frontend React Internship Assignment: Photo Gallery

> **Total Target Duration:** Exactly 5:00 minutes  
> **Speaker Notes:** Keep your tone natural, friendly, confident, and steady. Do not rush. Follow the on-screen cues in brackets `[like this]`.

---

### Segment 1: Live Application Demonstration (0:00 – 1:00)

**[Visual Cue: Open browser at `http://localhost:5173`. Show the responsive gallery loaded.]**

**Spoken Script:**
> "Hello everyone! My name is [Your Name], and today I am excited to present my submission for the Celebrare Frontend React Internship assignment: a responsive, performant Photo Gallery application built with React, Vite, and Tailwind CSS.
>
> Let's start with a quick live demonstration.
>
> When the application opens, it immediately contacts the Picsum API and loads 30 high-quality photos. You can see our responsive grid layout: on this desktop screen, it displays in 4 columns. If I resize the window down to tablet width, it seamlessly adapts to 2 columns, and on mobile screens, it stacks cleanly into a single column.
>
> Now, let's test the live author search. If I type **'Alejandro'**, the gallery filters instantly without reloading the page and without sending any additional network requests. The badge updates to show 'Showing 15 of 30 photos'. If I type a name that does not exist, like **'xyz'**, we see a clean empty state with a 'Clear Search' button. Clicking it instantly restores the full collection.
>
> Next, let's look at the favorites feature. I can click the heart button on this card—notice the heart turns red, the label updates to 'Saved', and our counter shows '1 favorite saved'. Let's add a second one. Now, if I reload the browser page... you can see both favorites persist perfectly because they are saved in `localStorage`. Clicking again removes them smoothly."

---

### Segment 2: Custom Hook — `useFetchPhotos.js` (1:00 – 2:00)

**[Visual Cue: Switch to code editor and open `src/hooks/useFetchPhotos.js`.]**

**Spoken Script:**
> "Now, let's dive into the code. The assignment specifies that all data-fetching logic must be encapsulated in a custom hook named `useFetchPhotos`.
>
> Here in `src/hooks/useFetchPhotos.js`, our hook returns an object with exactly three properties: `photos`, `loading`, and `error`.
>
> Inside the `useEffect`, we make an HTTP request to the Picsum API endpoint using the browser's native `fetch` API.
>
> Let's look at how error handling and state management are structured:
> - First, we initialize `loading` to `true` and `error` to `null`.
> - When the response arrives, we check `if (!response.ok)`. This is essential because native `fetch` does not reject on 404 or 500 HTTP errors—it only rejects on network failures. So checking `response.ok` allows us to throw a custom error with the HTTP status.
> - In the `catch` block, we capture any network failures and store a user-friendly message in the `error` state.
> - Notice the cleanup function returning `controller.abort()`. We attach an `AbortController` signal to the fetch call so that if the component unmounts while a request is in flight, the pending request is cleanly cancelled, preventing memory leaks and avoiding updates on unmounted components."

---

### Segment 3: Favourites State with `useReducer` & `localStorage` (2:00 – 3:00)

**[Visual Cue: Open `src/reducers/favoritesReducer.js` and show `src/components/Gallery.jsx`.]**

**Spoken Script:**
> "Requirement 5 strictly mandates using `useReducer` instead of `useState` for managing favourites.
>
> Here in `src/reducers/favoritesReducer.js`, we define a pure reducer function that manages an array of photo IDs. We intentionally store only photo IDs—strings like `'0'` or `'1'`—rather than full photo objects. Storing only IDs keeps memory minimal, avoids storing redundant image URLs in `localStorage`, and keeps state updates lightning fast.
>
> Our reducer handles two primary action types:
> 1. `TOGGLE_FAVORITE`: When dispatched with a photo ID, it checks if the ID already exists in the array. If it does, it filters it out; if not, it appends it using the spread operator. This guarantees that repeated clicks never produce duplicate entries.
> 2. `LOAD_FAVORITES`: Validates incoming data and loads a deduplicated list of IDs.
>
> For `localStorage` integration, we use lazy initialization. In `Gallery.jsx`, we pass `getInitialFavorites` as the third argument to `useReducer`. This function runs only once during the initial mount, parsing the stored JSON safely inside a `try/catch` block. If `localStorage` is empty or contains malformed data, it safely defaults to an empty array without crashing.
>
> Then, a simple `useEffect` listens to changes in `favorites` and writes the updated array to `localStorage`, avoiding infinite render loops."

---

### Segment 4: Performance Hooks — `useCallback` & `useMemo` (3:00 – 4:00)

**[Visual Cue: In `src/components/Gallery.jsx`, highlight lines with `useCallback` and `useMemo`.]**

**Spoken Script:**
> "Now let's examine Requirement 7: the usage of `useCallback` and `useMemo`.
>
> Here in `Gallery.jsx`:
> - `handleSearchChange` is wrapped in `useCallback`. What `useCallback` returns is a memoized reference to our event handler function. Because its dependency array is empty (`[]`), React preserves the exact same function reference across re-renders instead of creating a brand-new function object on every render.
> - Next, `filteredPhotos` is computed using `useMemo`. What `useMemo` returns is the cached result of a calculation. In our case, it executes the author search filter. Its dependencies are `[photos, searchQuery]`.
>
> Why is this important? When a user clicks to favorite a photo, the `favorites` state updates and triggers a re-render. Because `filteredPhotos` is memoized and neither `photos` nor `searchQuery` changed, React reuses the previously computed array and skips re-filtering all 30 photos.
>
> It is also vital to understand their limitations: neither hook is a magic bullet that automatically makes apps faster. Both introduce a small memory overhead for tracking dependencies. If removed, the app would still work functionally, but with unnecessary re-computations and changing function references."

---

### Segment 5: Genuine Implementation Challenge & Solution (4:00 – 5:00)

**[Visual Cue: Open `src/hooks/useFetchPhotos.js` and highlight lines 32–47 and 60–65.]**

**Spoken Script:**
> "Finally, I'd like to share a genuine technical challenge I encountered and solved during implementation: handling **React Strict Mode in combination with `AbortController`**.
>
> In React 18 and 19 development mode, `StrictMode` intentionally mounts, unmounts, and immediately remounts components to help identify side-effect bugs.
>
> When our `Gallery` component first mounted, `useFetchPhotos` started fetching photos. But because of `StrictMode`, React immediately ran the effect cleanup function, calling `controller.abort()`.
>
> In standard JavaScript, an aborted fetch throws a `DOMException` with the name `'AbortError'`. Initially, if the `catch` block caught that error naively, it treated the abort as a network failure and set an error message in state. That caused a split-second flash of an error banner before the second mount completed!
>
> To solve this cleanly:
> Inside the `catch` block, we added an explicit check:
> `if (err.name === 'AbortError') return;`
> This instructs the hook to silently ignore cancellations caused by component unmounting.
> In addition, inside the `finally` block, we checked `if (!controller.signal.aborted)` before setting `loading` to `false`.
>
> This ensured that only the active, valid request controls the UI state, completely eliminating race conditions and error flashes.
>
> All 17 automated tests pass, the production build completes cleanly, and every assignment requirement is fulfilled. Thank you for your time and consideration!"

---

## ⏱️ Timing Breakdown & Practice Guide

| Timestamp | Section | Key Visual Focus | Target Length |
| :--- | :--- | :--- | :--- |
| **0:00 – 1:00** | Live Demo | Browser UI: grid, search, empty state, favorites, refresh | 60 sec |
| **1:00 – 2:00** | `useFetchPhotos` | Code: `useFetchPhotos.js`, return shape, `response.ok`, `AbortController` | 60 sec |
| **2:00 – 3:00** | `useReducer` & Storage | Code: `favoritesReducer.js`, `TOGGLE_FAVORITE`, lazy init, effect | 60 sec |
| **3:00 – 4:00** | `useCallback` & `useMemo` | Code: `Gallery.jsx`, memoized handler, filtered list, dependencies | 60 sec |
| **4:00 – 5:00** | Genuine Challenge | Code: StrictMode double-mount, `AbortError` check, clean resolution | 60 sec |
| **Total** | | **5:00 minutes** | |
