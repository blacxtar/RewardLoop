/**
 * ThemeContext — provides dynamic light/dark theme switching.
 * 
 * WHY React Context (not Redux)?
 * - Theme is a UI concern, not app state — it doesn't need time-travel debugging
 * - Context avoids unnecessary Redux re-renders for non-theme state changes
 * - useTheme() hook gives components direct access to current colors + toggle
 * 
 * Architecture:
 * - ThemeProvider wraps the app in App.js
 * - Persists theme preference to AsyncStorage
 * - Reads system preference on first launch as default
 * - Provides: colors, isDark, toggleTheme
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightTheme, DarkTheme } from './colors';

const THEME_STORAGE_KEY = '@RewardLoop:theme';

const ThemeContext = createContext({
  colors: LightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  // Check system preference as default
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved preference from AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved !== null) {
          setIsDark(saved === 'dark');
        }
      } catch (e) {
        // Silently fall back to system preference
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Toggle and persist
  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
    } catch (e) {
      // Silent fail
    }
  };

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      colors: isDark ? DarkTheme : LightTheme,
      isDark,
      toggleTheme,
    }),
    [isDark]
  );

  // Wait for theme preference to load before rendering
  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme() — hook for accessing the current theme in any component.
 * 
 * Returns: { colors, isDark, toggleTheme }
 * 
 * Usage:
 *   const { colors, isDark, toggleTheme } = useTheme();
 *   <View style={{ backgroundColor: colors.background }}>
 */
export const useTheme = () => useContext(ThemeContext);
