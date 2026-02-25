/**
 * CustomInput — reusable text input with dark mode support.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../theme';

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  icon,
  ...rest
}) => {
  const { colors } = useTheme();
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
      >
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          autoCapitalize="none"
          {...rest}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecureVisible(!isSecureVisible)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.toggleIcon}>
              {isSecureVisible ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  icon: { fontSize: 18, marginRight: Spacing.sm },
  input: { flex: 1, fontSize: FontSize.body, height: '100%' },
  toggleIcon: { fontSize: 18, marginLeft: Spacing.sm },
  errorText: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});

export default CustomInput;
