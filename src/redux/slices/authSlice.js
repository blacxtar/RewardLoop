/**
 * authSlice — manages authentication state for RewardLoop.
 * 
 * Architecture decisions:
 * 1. createAsyncThunk for loginUser — handles pending/fulfilled/rejected 
 *    lifecycle automatically, keeping the component clean of try/catch.
 * 2. Token + user data persisted to AsyncStorage so the session survives
 *    app restarts (hydrated on boot via setCredentials).
 * 3. The slice is the SINGLE source of truth for auth state — navigation
 *    reads isLoggedIn to switch between auth and main stacks.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';
import { STORAGE_KEYS } from '../../utils/constants';

/**
 * loginUser thunk — calls DummyJSON /auth/login endpoint.
 * 
 * DummyJSON test credentials:
 *   username: 'emilys'  password: 'emilyspass'
 * 
 * On success: stores token + user in AsyncStorage for persistence.
 * On failure: rejects with a user-friendly error message.
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.post('/auth/login', {
        username,
        password,
      });

      const { accessToken, ...userData } = response.data;

      // Persist to AsyncStorage so session survives app restart
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );

      return { token: accessToken, user: userData };
    } catch (error) {
      // DummyJSON returns { message: "..." } on failure
      const message =
        error.response?.data?.message ||
        'Login failed. Please check your credentials.';
      return rejectWithValue(message);
    }
  }
);

/**
 * logoutUser thunk — clears persisted auth data.
 */
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.AUTH_TOKEN,
    STORAGE_KEYS.USER_DATA,
  ]);
});

const initialState = {
  token: null,
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Hydrate auth state from AsyncStorage on app boot.
     * Called once in App.js / navigation on startup.
     */
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.isLoggedIn = true;
      state.error = null;
    },

    /** Clear any previous error (e.g., when user re-types) */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Login lifecycle ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An unexpected error occurred.';
      });

    // ── Logout lifecycle ──
    builder.addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { setCredentials, clearError } = authSlice.actions;
export default authSlice.reducer;
