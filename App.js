/**
 * App.js — root entry point for RewardLoop.
 * 
 * Wraps the entire application in:
 * 1. Redux Provider — makes the store available to all components via hooks
 * 2. SafeAreaProvider — handles device-safe insets (notches, status bars)
 * 3. AppNavigator — the conditional auth/main navigation tree
 * 
 * StatusBar is set to dark-content on a light background to match our theme.
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}
