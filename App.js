/**
 * App.js — root entry point for RewardLoop.
 * 
 * Wraps the entire application in:
 * 1. ErrorBoundary — catches unhandled JS errors with a fallback UI
 * 2. ThemeProvider — provides dynamic light/dark color palette
 * 3. Redux Provider — makes the store available to all components
 * 4. SafeAreaProvider — handles device-safe insets
 * 5. AppNavigator — the conditional auth/main navigation tree
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { ThemeProvider, useTheme } from './src/theme';

/**
 * Inner app — needs ThemeProvider above it to use useTheme().
 * StatusBar style flips based on current theme.
 */
const AppContent = () => {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Provider store={store}>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
