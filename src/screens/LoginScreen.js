/**
 * LoginScreen — branded login with input validation and DummyJSON integration.
 * 
 * Design decisions:
 * 1. Local state for form fields + validation errors (not Redux — form state
 *    is ephemeral and doesn't need to survive navigation).
 * 2. Redux dispatch for the actual login thunk (state is global after auth).
 * 3. Input validation runs on submit, not on every keystroke (cleaner UX).
 * 4. Shows DummyJSON test credentials as a hint for the reviewer / demo.
 * 5. KeyboardAvoidingView prevents the keyboard from hiding the inputs on iOS.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/slices/authSlice';
import { earnPoints } from '../redux/slices/loyaltySlice';
import { LOYALTY_POINTS, TRANSACTION_TYPES } from '../utils/constants';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // ── Local form state ──
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  /**
   * Validate inputs before submission.
   * Returns true if all fields pass validation.
   */
  const validate = useCallback(() => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [username, password]);

  /**
   * Handle login — validate, then dispatch the async thunk.
   * On successful login, award welcome bonus points.
   */
  const handleLogin = useCallback(async () => {
    // Clear any previous API error
    dispatch(clearError());

    if (!validate()) return;

    const result = await dispatch(
      loginUser({ username: username.trim(), password })
    );

    // Award login bonus points only on successful login
    if (loginUser.fulfilled.match(result)) {
      dispatch(
        earnPoints({
          type: TRANSACTION_TYPES.LOGIN_BONUS,
          points: LOYALTY_POINTS.LOGIN_BONUS,
          description: 'Welcome bonus for logging in',
        })
      );
    }
  }, [dispatch, username, password, validate]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Branding Header ── */}
        <View style={styles.header}>
          <Text style={styles.logo}>🎁</Text>
          <Text style={styles.brandName}>RewardLoop</Text>
          <Text style={styles.tagline}>
            Your loyalty, your rewards
          </Text>
        </View>

        {/* ── Login Form ── */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>
            Sign in to earn points & unlock rewards
          </Text>

          <CustomInput
            label="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (errors.username) {
                setErrors((prev) => ({ ...prev, username: null }));
              }
            }}
            placeholder="Enter your username"
            error={errors.username}
            icon="👤"
            autoComplete="username"
            returnKeyType="next"
          />

          <CustomInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: null }));
              }
            }}
            placeholder="Enter your password"
            error={errors.password}
            secureTextEntry
            icon="🔒"
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          {/* API-level error message */}
          {error && (
            <View style={styles.apiError}>
              <Text style={styles.apiErrorText}>⚠️ {error}</Text>
            </View>
          )}

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />
        </View>

        {/* ── Test credentials hint ── */}
        <View style={styles.hint}>
          <Text style={styles.hintTitle}>Demo Credentials</Text>
          <Text style={styles.hintText}>Username: emilys</Text>
          <Text style={styles.hintText}>Password: emilyspass</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  // ── Header ──
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    fontSize: 56,
    marginBottom: Spacing.sm,
  },
  brandName: {
    fontSize: FontSize.hero,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  // ── Form ──
  form: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  formTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  apiError: {
    backgroundColor: '#FEF2F2',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  apiErrorText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
  // ── Hint ──
  hint: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  hintTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  hintText: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default LoginScreen;
