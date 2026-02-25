/**
 * productsSlice — manages product listing, search, and category filtering.
 * 
 * Architecture:
 * 1. fetchProducts thunk pulls from FakeStore API and stores the full list.
 * 2. Filtering (search + category) is done client-side on the stored items
 *    for instant feedback — no extra API calls on each keystroke.
 * 3. filterProducts reducer runs whenever searchQuery or selectedCategory
 *    changes (dispatched from the screen via useEffect + debounce).
 * 4. fetchCategories thunk loads available categories for the filter chips.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../../services/api';

/**
 * Fetch all products from FakeStore API.
 * Endpoint: GET https://fakestoreapi.com/products
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.get('/products');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load products. Please try again.'
      );
    }
  }
);

/**
 * Fetch product categories from FakeStore API.
 * Endpoint: GET https://fakestoreapi.com/products/categories
 */
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.get('/products/categories');
      return response.data; // Array of category strings
    } catch (error) {
      return rejectWithValue('Failed to load categories.');
    }
  }
);

const initialState = {
  items: [],             // Full product list from API
  filteredItems: [],     // Subset after search + category filter
  categories: [],        // Available categories from API
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    /**
     * Client-side filter — runs on the full items array.
     * Combines search query (title match) + category filter.
     * 
     * WHY client-side? FakeStore API doesn't support combined search + category
     * filtering in a single call. With ~20 products, client-side is instant.
     */
    filterProducts: (state) => {
      let filtered = [...state.items];

      // Category filter
      if (state.selectedCategory !== 'all') {
        filtered = filtered.filter(
          (item) => item.category === state.selectedCategory
        );
      }

      // Search filter (case-insensitive title match)
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase().trim();
        filtered = filtered.filter((item) =>
          item.title.toLowerCase().includes(query)
        );
      }

      state.filteredItems = filtered;
    },
  },
  extraReducers: (builder) => {
    // ── Fetch products ──
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An unexpected error occurred.';
      });

    // ── Fetch categories ──
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
  },
});

export const { setSearchQuery, setSelectedCategory, filterProducts } =
  productsSlice.actions;
export default productsSlice.reducer;
