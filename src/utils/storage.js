/**
 * AsyncStorage persistence helpers.
 * 
 * WHY a separate module?
 * - Keeps persistence logic out of components and slices
 * - Central place to handle serialization errors
 * - Easy to swap with a backend sync layer in the future
 * - Each helper is fire-and-forget (async but we don't await in most callers)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

/**
 * Save favorites array to AsyncStorage.
 * @param {Array} favorites - Array of product objects
 */
export const saveFavorites = async (favorites) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(favorites)
    );
  } catch (error) {
    console.warn('Failed to save favorites:', error);
  }
};

/**
 * Load favorites from AsyncStorage.
 * @returns {Array} Array of product objects, or empty array on failure
 */
export const loadFavorites = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.warn('Failed to load favorites:', error);
    return [];
  }
};

/**
 * Save loyalty data (points + transactions) to AsyncStorage.
 * @param {Object} data - { points: number, transactions: Array }
 */
export const saveLoyaltyData = async (data) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.LOYALTY_DATA,
      JSON.stringify(data)
    );
  } catch (error) {
    console.warn('Failed to save loyalty data:', error);
  }
};

/**
 * Load loyalty data from AsyncStorage.
 * @returns {Object} { points, transactions } or defaults on failure
 */
export const loadLoyaltyData = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.LOYALTY_DATA);
    return json ? JSON.parse(json) : { points: 0, transactions: [] };
  } catch (error) {
    console.warn('Failed to load loyalty data:', error);
    return { points: 0, transactions: [] };
  }
};
