/**
 * AppNavigator — root navigation with auth hydration and logout support.
 * 
 * Architecture:
 * 1. On mount, checks AsyncStorage for a saved token → auto-login (hydration)
 * 2. Shows a splash/loading state while hydrating to prevent flash of login screen
 * 3. Conditional rendering: Auth stack (login) vs Main tabs (products, favorites, rewards)
 * 4. Logout button in Products header — dispatches logoutUser thunk
 * 5. Points badge visible in the Products header (loyalty system preview)
 */

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, FontSize, Spacing, BorderRadius } from '../theme';
import { STORAGE_KEYS } from '../utils/constants';

// Redux actions
import { setCredentials, logoutUser } from '../redux/slices/authSlice';
import { setLoyaltyData } from '../redux/slices/loyaltySlice';
import { setFavorites } from '../redux/slices/favoritesSlice';

// Screens
import LoginScreen from '../screens/LoginScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import RewardsScreen from '../screens/RewardsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * PointsBadge — shows loyalty points in the header.
 * Tapping it could navigate to rewards (wired in Phase 6).
 */
const PointsBadge = () => {
  const points = useSelector((state) => state.loyalty.points);
  return (
    <View style={styles.pointsBadge}>
      <Text style={styles.pointsIcon}>⭐</Text>
      <Text style={styles.pointsText}>{points}</Text>
    </View>
  );
};

/**
 * LogoutButton — dispatches logout thunk from the header.
 */
const LogoutButton = () => {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      onPress={() => dispatch(logoutUser())}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
};

/**
 * Products stack — list → detail navigation.
 */
const ProductsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: Colors.surface },
      headerTintColor: Colors.textPrimary,
      headerTitleStyle: { fontWeight: '600', fontSize: FontSize.lg },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen
      name="ProductList"
      component={ProductListScreen}
      options={{
        title: '🛍️ Products',
        headerLeft: () => <PointsBadge />,
        headerRight: () => <LogoutButton />,
      }}
    />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{ title: 'Details' }}
    />
  </Stack.Navigator>
);

/**
 * Main bottom tab navigator.
 */
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textLight,
      tabBarStyle: {
        backgroundColor: Colors.surface,
        borderTopColor: Colors.border,
        paddingBottom: 4,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: FontSize.xs,
        fontWeight: '600',
      },
    }}
  >
    <Tab.Screen
      name="ProductsTab"
      component={ProductsStack}
      options={{
        tabBarLabel: 'Products',
        tabBarIcon: ({ color }) => (
          <Text style={[styles.tabIcon, { color }]}>🛍️</Text>
        ),
      }}
    />
    <Tab.Screen
      name="FavoritesTab"
      component={FavoritesScreen}
      options={{
        title: '❤️ Favorites',
        headerShown: true,
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: '600', fontSize: FontSize.lg },
        headerShadowVisible: false,
        tabBarLabel: 'Favorites',
        tabBarIcon: ({ color }) => (
          <Text style={[styles.tabIcon, { color }]}>❤️</Text>
        ),
      }}
    />
    <Tab.Screen
      name="RewardsTab"
      component={RewardsScreen}
      options={{
        title: '🏆 My Rewards',
        headerShown: true,
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: '600', fontSize: FontSize.lg },
        headerShadowVisible: false,
        tabBarLabel: 'Rewards',
        tabBarIcon: ({ color }) => (
          <Text style={[styles.tabIcon, { color }]}>🏆</Text>
        ),
      }}
    />
  </Tab.Navigator>
);

/**
 * Root navigator — handles auth hydration and conditional stacks.
 */
const AppNavigator = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isHydrating, setIsHydrating] = useState(true);

  /**
   * On app boot, check AsyncStorage for a saved session.
   * If found, restore auth + loyalty + favorites state (hydration).
   * This prevents the user from seeing a login flash on app restart.
   */
  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token) {
          const user = userJson ? JSON.parse(userJson) : null;
          dispatch(setCredentials({ token, user }));

          // Also restore loyalty & favorites if available
          const loyaltyJson = await AsyncStorage.getItem(
            STORAGE_KEYS.LOYALTY_DATA
          );
          if (loyaltyJson) {
            dispatch(setLoyaltyData(JSON.parse(loyaltyJson)));
          }

          const favoritesJson = await AsyncStorage.getItem(
            STORAGE_KEYS.FAVORITES
          );
          if (favoritesJson) {
            dispatch(setFavorites(JSON.parse(favoritesJson)));
          }
        }
      } catch (err) {
        // Silent fail — user will just see login screen
        console.warn('Auth hydration failed:', err);
      } finally {
        setIsHydrating(false);
      }
    };

    hydrateAuth();
  }, [dispatch]);

  // Show loading spinner while restoring session
  if (isHydrating) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashLogo}>🎁</Text>
        <Text style={styles.splashBrand}>RewardLoop</Text>
        <ActivityIndicator
          color={Colors.primary}
          size="large"
          style={{ marginTop: Spacing.lg }}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
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
  tabIcon: {
    fontSize: 22,
  },
  // ── Points badge ──
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginLeft: Spacing.sm,
  },
  pointsIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  pointsText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.goldDark,
  },
  // ── Logout ──
  logoutText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.error,
    marginRight: Spacing.sm,
  },
  // ── Splash / hydration ──
  splash: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    fontSize: 64,
    marginBottom: Spacing.sm,
  },
  splashBrand: {
    fontSize: FontSize.hero,
    fontWeight: '800',
    color: Colors.primary,
  },
});

export default AppNavigator;
