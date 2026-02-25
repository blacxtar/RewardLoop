/**
 * RewardsScreen — placeholder for Phase 6.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize } from '../theme';

const RewardsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 My Rewards</Text>
      <Text style={styles.subtitle}>Loyalty rewards — coming in Phase 6</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
});

export default RewardsScreen;
