/**
 * ProductDetailScreen — placeholder for Phase 4.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize } from '../theme';

const ProductDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Product Details</Text>
      <Text style={styles.subtitle}>Detail view — coming in Phase 4</Text>
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

export default ProductDetailScreen;
