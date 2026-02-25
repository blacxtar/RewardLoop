/**
 * AppNavigator — dark-mode-aware navigation with theme toggle.
 */

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer, DefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Text,
  View,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../theme';
import { STORAGE_KEYS } from '../utils/constants';

import { setCredentials, logoutUser } from '../redux/slices/authSlice';
import { setLoyaltyData } from '../redux/slices/loyaltySlice';
import { setFavorites } from '../redux/slices/favoritesSlice';

import LoginScreen from '../screens/LoginScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import RewardsScreen from '../screens/RewardsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/** Brand title + points badge centered in header */
const HeaderTitle = () => {
  const points = useSelector((state) => state.loyalty.points);
  const { colors } = useTheme();
  return (
    <View style={styles.brandHeader}>
      <Text style={[styles.brandName, { color: colors.primary }]}>RewardLoop</Text>
      <View style={[styles.pointsBadge, { backgroundColor: colors.gold + '25' }]}>
        <Text style={styles.pointsIcon}>⭐</Text>
        <Text style={[styles.pointsText, { color: colors.goldDark }]}>{points}</Text>
      </View>
    </View>
  );
};

/** Theme switch + Logout in header */
const HeaderRight = () => {
  const dispatch = useDispatch();
  const { isDark, toggleTheme, colors } = useTheme();
  return (
    <View style={styles.headerRight}>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>{isDark ? '🌙' : '☀️'}</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#D1D5DB', true: colors.primary + '60' }}
          thumbColor={isDark ? colors.primary : '#F9FAFB'}
          ios_backgroundColor="#D1D5DB"
          style={styles.switch}
        />
      </View>
      <TouchableOpacity
        onPress={() => dispatch(logoutUser())}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

/** Products stack */
const ProductsStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '600', fontSize: FontSize.lg },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          headerTitle: () => <HeaderTitle />,
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Details' }}
      />
    </Stack.Navigator>
  );
};

/** Main bottom tabs */
const MainTabs = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: FontSize.xs, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="ProductsTab"
        component={ProductsStack}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🛍️</Text>,
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          title: '❤️ Favorites',
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '600', fontSize: FontSize.lg },
          headerShadowVisible: false,
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>❤️</Text>,
        }}
      />
      <Tab.Screen
        name="RewardsTab"
        component={RewardsScreen}
        options={{
          title: '🏆 My Rewards',
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '600', fontSize: FontSize.lg },
          headerShadowVisible: false,
          tabBarLabel: 'Rewards',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🏆</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

/** Root navigator with auth hydration */
const AppNavigator = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { colors, isDark } = useTheme();
  const [isHydrating, setIsHydrating] = useState(true);

  // Custom nav themes that match our palette
  const navTheme = {
    ...(isDark ? NavDarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? NavDarkTheme : DefaultTheme).colors,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      primary: colors.primary,
    },
  };

  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (token) {
          const user = userJson ? JSON.parse(userJson) : null;
          dispatch(setCredentials({ token, user }));
          const loyaltyJson = await AsyncStorage.getItem(STORAGE_KEYS.LOYALTY_DATA);
          if (loyaltyJson) dispatch(setLoyaltyData(JSON.parse(loyaltyJson)));
          const favoritesJson = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
          if (favoritesJson) dispatch(setFavorites(JSON.parse(favoritesJson)));
        }
      } catch (err) {
        console.warn('Auth hydration failed:', err);
      } finally {
        setIsHydrating(false);
      }
    };
    hydrateAuth();
  }, [dispatch]);

  if (isHydrating) {
    return (
      <View style={[styles.splash, { backgroundColor: colors.background }]}>
        <Text style={styles.splashLogo}>🎁</Text>
        <Text style={[styles.splashBrand, { color: colors.primary }]}>RewardLoop</Text>
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: Spacing.lg }} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIcon: { fontSize: 22 },
  // ── Brand header ──
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandEmoji: { fontSize: 20, marginRight: 6 },
  brandName: { fontSize: FontSize.lg, fontWeight: '800', letterSpacing: -0.3 },
  // ── Points badge ──
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginLeft: Spacing.sm,
  },
  pointsIcon: { fontSize: 14, marginRight: 4 },
  pointsText: { fontSize: FontSize.sm, fontWeight: '700' },
  // ── Header right ──
  headerRight: { flexDirection: 'row', alignItems: 'center', marginRight: Spacing.sm },
  switchContainer: { flexDirection: 'row', alignItems: 'center', marginRight: Spacing.md },
  switchLabel: { fontSize: 14, marginRight: 4 },
  switch: { transform: [{ scale: 0.8 }] },
  logoutText: { fontSize: FontSize.md, fontWeight: '600' },
  // ── Splash ──
  splash: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  splashLogo: { fontSize: 64, marginBottom: Spacing.sm },
  splashBrand: { fontSize: 34, fontWeight: '800' },
});

export default AppNavigator;
