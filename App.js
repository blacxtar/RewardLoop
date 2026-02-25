/**
 * App.js — root entry point for RewardLoop.
 * 
 * Wraps the entire application in:
 * 1. ErrorBoundary — catches unhandled JS errors with a fallback UI
 * 2. Redux Provider — makes the store available to all components via hooks
 * 3. SafeAreaProvider — handles device-safe insets (notches, status bars)
 * 4. AppNavigator — the conditional auth/main navigation tree
 * 
 * StatusBar is set to dark-content on a light background to match our theme.
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
}
