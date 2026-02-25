/**
 * CustomInput — reusable text input with label, error display, and icon support.
 * 
 * WHY a custom wrapper?
 * - Ensures every input across the app has consistent styling, spacing, and error UX
 * - Supports optional left icon, secure text toggle, and error messages
 * - Follows controlled component pattern (value + onChangeText from parent)
 * 
 * Props:
 *   label        — field label text
 *   value        — controlled value
 *   onChangeText — change handler
 *   placeholder  — placeholder text
 *   error        — error message string (shows red below input when truthy)
 *   secureTextEntry — masks text for passwords
 *   icon         — emoji or text icon rendered on the left
 *   ...rest      — forwarded to underlying TextInput
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';

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
  // Local state to toggle password visibility
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Input row */}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          autoCapitalize="none"
          {...rest}
        />
        {/* Show/hide toggle for password fields */}
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

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  inputError: {
    borderColor: Colors.error,
  },
  icon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    height: '100%',
  },
  toggleIcon: {
    fontSize: 18,
    marginLeft: Spacing.sm,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});

export default CustomInput;
