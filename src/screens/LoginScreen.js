/**
 * LoginScreen — modern branded login with dark mode support.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/slices/authSlice';
import { earnPoints } from '../redux/slices/loyaltySlice';
import { LOYALTY_POINTS, TRANSACTION_TYPES } from '../utils/constants';
import { saveLoyaltyData } from '../utils/storage';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../theme';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { colors } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = useCallback(() => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    else if (username.trim().length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [username, password]);

  const handleLogin = useCallback(async () => {
    dispatch(clearError());
    if (!validate()) return;
    const result = await dispatch(loginUser({ username: username.trim(), password }));
    if (loginUser.fulfilled.match(result)) {
      dispatch(
        earnPoints({
          type: TRANSACTION_TYPES.LOGIN_BONUS,
          points: LOYALTY_POINTS.LOGIN_BONUS,
          description: 'Welcome bonus for logging in',
        })
      );
      saveLoyaltyData({
        points: LOYALTY_POINTS.LOGIN_BONUS,
        transactions: [{
          id: Date.now().toString(),
          type: TRANSACTION_TYPES.LOGIN_BONUS,
          points: LOYALTY_POINTS.LOGIN_BONUS,
          description: 'Welcome bonus for logging in',
          date: new Date().toISOString(),
        }],
      });
    }
  }, [dispatch, username, password, validate]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Branding */}
        <View style={styles.header}>
          <Text style={styles.logo}>🎁</Text>
          <Text style={[styles.brandName, { color: colors.primary }]}>RewardLoop</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Your loyalty, your rewards
          </Text>
        </View>

        {/* Form card */}
        <View
          style={[
            styles.form,
            {
              backgroundColor: colors.surface,
              shadowColor: colors.shadowColor,
              shadowOpacity: colors.cardShadowOpacity,
            },
          ]}
        >
          <Text style={[styles.formTitle, { color: colors.textPrimary }]}>Welcome Back</Text>
          <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
            Sign in to earn points & unlock rewards
          </Text>

          <CustomInput
            label="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (errors.username) setErrors((prev) => ({ ...prev, username: null }));
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
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            }}
            placeholder="Enter your password"
            error={errors.password}
            secureTextEntry
            icon="🔒"
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          {error && (
            <View style={[styles.apiError, { backgroundColor: colors.error + '15' }]}>
              <Text style={[styles.apiErrorText, { color: colors.error }]}>⚠️ {error}</Text>
            </View>
          )}

          <CustomButton title="Sign In" onPress={handleLogin} loading={loading} style={styles.loginButton} />
        </View>

        {/* Demo credentials */}
        <View style={[styles.hint, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.hintTitle, { color: colors.textSecondary }]}>Demo Credentials</Text>
          <Text style={[styles.hintText, { color: colors.textLight }]}>Username: emilys</Text>
          <Text style={[styles.hintText, { color: colors.textLight }]}>Password: emilyspass</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  logo: { fontSize: 56, marginBottom: Spacing.sm },
  brandName: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { fontSize: FontSize.md, marginTop: Spacing.xs },
  form: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 4,
  },
  formTitle: { fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.xs },
  formSubtitle: { fontSize: FontSize.md, marginBottom: Spacing.lg },
  apiError: { borderRadius: BorderRadius.sm, padding: Spacing.md, marginBottom: Spacing.md },
  apiErrorText: { fontSize: FontSize.sm, textAlign: 'center' },
  loginButton: { marginTop: Spacing.sm },
  hint: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  hintTitle: { fontSize: FontSize.sm, fontWeight: '600', marginBottom: Spacing.xs },
  hintText: { fontSize: FontSize.sm, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});

export default LoginScreen;
