/**
 * loyaltySlice — manages the loyalty points and transaction history.
 * 
 * WHY a separate slice?
 * GARS Technology's core offering is Loyalty SaaS. This slice is designed
 * to mirror a real backend-synced loyalty engine:
 *   - Points accumulate via actions (login, favorite, future: purchase)
 *   - Every point change is tracked as a transaction (audit trail)
 *   - The slice is "sync-ready" — a future thunk could POST transactions
 *     to a backend and reconcile the local state.
 * 
 * Fully wired in Phase 6.
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  points: 0,            // Running total
  transactions: [],     // Array of { id, type, points, date, description }
};

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    /**
     * Generic "earn points" action.
     * Payload: { type: string, points: number, description?: string }
     */
    earnPoints: (state, action) => {
      const { type, points, description } = action.payload;
      state.points += points;
      state.transactions.unshift({
        id: Date.now().toString(),
        type,
        points,
        description: description || type,
        date: new Date().toISOString(),
      });
    },

    /** Hydrate from AsyncStorage on app boot */
    setLoyaltyData: (state, action) => {
      state.points = action.payload.points;
      state.transactions = action.payload.transactions;
    },

    /** Reset — e.g., on logout */
    resetLoyalty: () => initialState,
  },
});

export const { earnPoints, setLoyaltyData, resetLoyalty } =
  loyaltySlice.actions;
export default loyaltySlice.reducer;
