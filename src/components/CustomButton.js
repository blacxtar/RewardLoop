/**
 * CustomButton — reusable button with loading state and variants.
 * 
 * WHY a custom button?
 * - React Native's built-in Button has no styling control
 * - Supports primary / outline / text variants + loading spinner
 * - Consistent height, border radius, and typography across the app
 * 
 * Props:
 *   title     — button label
 *   onPress   — press handler
 *   variant   — 'primary' | 'outline' | 'text' (default: 'primary')
 *   loading   — shows spinner and disables press
 *   disabled  — greys out and disables press
 *   style     — additional container styles
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isPrimary && styles.primary,
        isOutline && styles.outline,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? Colors.white : Colors.primary}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.label,
            isPrimary ? styles.primaryLabel : styles.altLabel,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: FontSize.body,
    fontWeight: '700',
  },
  primaryLabel: {
    color: Colors.white,
  },
  altLabel: {
    color: Colors.primary,
  },
});

export default CustomButton;
