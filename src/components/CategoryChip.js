/**
 * CategoryChip — small pill-shaped filter button for product categories.
 * 
 * WHY a separate component?
 * - Used inside a horizontal ScrollView in ProductListScreen
 * - Memoized to prevent unnecessary re-renders when sibling chips change
 * - Selected state drives different visual styling
 * 
 * Props:
 *   label      — category name (e.g., "electronics")
 *   isSelected — whether this chip is the active filter
 *   onPress    — sets this category as the selected filter
 */

import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';

const CategoryChip = ({ label, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, isSelected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  labelSelected: {
    color: Colors.white,
  },
});

export default memo(CategoryChip);
