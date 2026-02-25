/**
 * CustomButton — reusable button with dark mode support.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../theme';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isPrimary && { backgroundColor: colors.primary },
        isOutline && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? colors.white : colors.primary}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.label,
            { color: isPrimary ? colors.white : colors.primary },
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
    paddingHorizontal: 24,
  },
  disabled: { opacity: 0.5 },
  label: { fontSize: FontSize.body, fontWeight: '700' },
});

export default CustomButton;
