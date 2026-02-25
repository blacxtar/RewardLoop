/**
 * Redux Store Configuration
 * 
 * WHY configureStore over createStore?
 * - Automatically sets up Redux DevTools
 * - Includes redux-thunk middleware by default (for async actions/thunks)
 * - Enables Immer for immutable updates with mutable syntax
 * - Provides good defaults with zero boilerplate
 * 
 * All four feature slices are registered here. The store is the single
 * source of truth for the entire app's state tree.
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import favoritesReducer from './slices/favoritesSlice';
import loyaltyReducer from './slices/loyaltySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    favorites: favoritesReducer,
    loyalty: loyaltyReducer,
  },
  // Middleware: redux-thunk is included by default.
  // serializableCheck is on by default — we keep it for safety.
});

export default store;
