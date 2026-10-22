import test from 'node:test';
import assert from 'node:assert/strict';
import {
  favoritesReducer,
  FAVORITES_ACTIONS,
  getInitialFavorites,
  FAVORITES_STORAGE_KEY,
} from '../src/reducers/favoritesReducer.js';

test('favoritesReducer - TOGGLE_FAVORITE adds ID when not present', () => {
  const initialState = ['1', '2'];
  const nextState = favoritesReducer(initialState, {
    type: FAVORITES_ACTIONS.TOGGLE_FAVORITE,
    payload: '3',
  });

  assert.deepStrictEqual(nextState, ['1', '2', '3']);
});

test('favoritesReducer - TOGGLE_FAVORITE removes ID when already present', () => {
  const initialState = ['1', '2', '3'];
  const nextState = favoritesReducer(initialState, {
    type: FAVORITES_ACTIONS.TOGGLE_FAVORITE,
    payload: '2',
  });

  assert.deepStrictEqual(nextState, ['1', '3']);
});

test('favoritesReducer - TOGGLE_FAVORITE handles numeric or string payload consistently', () => {
  const initialState = ['10'];
  // Toggling with number 10 should remove '10'
  const stateAfterRemove = favoritesReducer(initialState, {
    type: FAVORITES_ACTIONS.TOGGLE_FAVORITE,
    payload: 10,
  });
  assert.deepStrictEqual(stateAfterRemove, []);

  // Toggling back with number 10 should add '10' as string
  const stateAfterAdd = favoritesReducer(stateAfterRemove, {
    type: FAVORITES_ACTIONS.TOGGLE_FAVORITE,
    payload: 10,
  });
  assert.deepStrictEqual(stateAfterAdd, ['10']);
});

test('favoritesReducer - LOAD_FAVORITES loads and deduplicates IDs', () => {
  const initialState = [];
  const nextState = favoritesReducer(initialState, {
    type: FAVORITES_ACTIONS.LOAD_FAVORITES,
    payload: ['1', '2', '2', '3', 4],
  });

  assert.deepStrictEqual(nextState, ['1', '2', '3', '4']);
});

test('favoritesReducer - LOAD_FAVORITES ignores non-array payload', () => {
  const initialState = ['1', '2'];
  const nextState = favoritesReducer(initialState, {
    type: FAVORITES_ACTIONS.LOAD_FAVORITES,
    payload: 'not-an-array',
  });

  assert.deepStrictEqual(nextState, initialState);
});

test('favoritesReducer - unknown action returns current state', () => {
  const initialState = ['1'];
  const nextState = favoritesReducer(initialState, {
    type: 'UNKNOWN_ACTION',
    payload: 'something',
  });

  assert.deepStrictEqual(nextState, initialState);
});

test('getInitialFavorites - safely handles missing or non-browser environment', () => {
  // If window is undefined or localStorage is absent
  const originalWindow = globalThis.window;
  delete globalThis.window;

  const result = getInitialFavorites();
  assert.deepStrictEqual(result, []);

  globalThis.window = originalWindow;
});

test('getInitialFavorites - safely handles empty localStorage', () => {
  const mockStorage = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (key) => mockStorage.get(key) || null,
      setItem: (key, val) => mockStorage.set(key, String(val)),
    },
  };

  assert.deepStrictEqual(getInitialFavorites(), []);
});

test('getInitialFavorites - safely handles malformed JSON in localStorage', () => {
  const mockStorage = new Map([[FAVORITES_STORAGE_KEY, '{invalid json---']]);
  globalThis.window = {
    localStorage: {
      getItem: (key) => mockStorage.get(key) || null,
      setItem: (key, val) => mockStorage.set(key, String(val)),
    },
  };

  assert.deepStrictEqual(getInitialFavorites(), []);
});

test('getInitialFavorites - safely handles non-array stored data', () => {
  const mockStorage = new Map([[FAVORITES_STORAGE_KEY, JSON.stringify({ not: 'an array' })]]);
  globalThis.window = {
    localStorage: {
      getItem: (key) => mockStorage.get(key) || null,
      setItem: (key, val) => mockStorage.set(key, String(val)),
    },
  };

  assert.deepStrictEqual(getInitialFavorites(), []);
});

test('getInitialFavorites - loads valid array and deduplicates IDs', () => {
  const mockStorage = new Map([[FAVORITES_STORAGE_KEY, JSON.stringify(['10', '20', '20', 30])]]);
  globalThis.window = {
    localStorage: {
      getItem: (key) => mockStorage.get(key) || null,
      setItem: (key, val) => mockStorage.set(key, String(val)),
    },
  };

  assert.deepStrictEqual(getInitialFavorites(), ['10', '20', '30']);
});
