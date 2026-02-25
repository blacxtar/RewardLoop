/**
 * favoritesSlice — manages user's favorite products.
 * 
 * Fully wired in Phase 5 with AsyncStorage persistence.
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],  // Array of favorited product objects
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      // Prevent duplicates by checking product ID
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setFavorites: (state, action) => {
      // Hydrate from AsyncStorage on app boot
      state.items = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, setFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
