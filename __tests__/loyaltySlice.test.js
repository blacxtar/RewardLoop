/**
 * loyaltySlice unit test — validates core reducer and action logic.
 * 
 * WHY test the loyalty slice?
 * - It's the most business-critical slice (core to GARS Technology's model)
 * - Tests verify points accumulate correctly and transactions are tracked
 * - Reducer tests are pure functions — fast, no mocking needed
 */

import loyaltyReducer, {
  earnPoints,
  setLoyaltyData,
  resetLoyalty,
} from '../src/redux/slices/loyaltySlice';

describe('loyaltySlice', () => {
  const initialState = {
    points: 0,
    transactions: [],
  };

  it('should return the initial state', () => {
    expect(loyaltyReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should earn points and add a transaction', () => {
    const action = earnPoints({
      type: 'LOGIN_BONUS',
      points: 5,
      description: 'Welcome bonus',
    });
    const state = loyaltyReducer(initialState, action);

    expect(state.points).toBe(5);
    expect(state.transactions).toHaveLength(1);
    expect(state.transactions[0]).toMatchObject({
      type: 'LOGIN_BONUS',
      points: 5,
      description: 'Welcome bonus',
    });
    expect(state.transactions[0].id).toBeTruthy();
    expect(state.transactions[0].date).toBeTruthy();
  });

  it('should accumulate points across multiple earnings', () => {
    let state = loyaltyReducer(
      initialState,
      earnPoints({
        type: 'LOGIN_BONUS',
        points: 5,
        description: 'Login',
      })
    );
    state = loyaltyReducer(
      state,
      earnPoints({
        type: 'FAVORITE_ADDED',
        points: 10,
        description: 'Favorited product',
      })
    );

    expect(state.points).toBe(15);
    expect(state.transactions).toHaveLength(2);
    // Most recent transaction should be first (unshift)
    expect(state.transactions[0].type).toBe('FAVORITE_ADDED');
    expect(state.transactions[1].type).toBe('LOGIN_BONUS');
  });

  it('should hydrate loyalty data from storage', () => {
    const savedData = {
      points: 42,
      transactions: [
        {
          id: '1',
          type: 'LOGIN_BONUS',
          points: 5,
          description: 'Test',
          date: '2026-01-01',
        },
      ],
    };
    const state = loyaltyReducer(initialState, setLoyaltyData(savedData));

    expect(state.points).toBe(42);
    expect(state.transactions).toHaveLength(1);
  });

  it('should reset loyalty state on logout', () => {
    const stateWithData = {
      points: 100,
      transactions: [{ id: '1', type: 'TEST', points: 100 }],
    };
    const state = loyaltyReducer(stateWithData, resetLoyalty());

    expect(state).toEqual(initialState);
  });
});
