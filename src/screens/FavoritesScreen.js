/**
 * FavoritesScreen — displays user's favorited products with remove option.
 * 
 * Features:
 * 1. FlatList of favorited products (reuses ProductCard)
 * 2. Swipe-to-remove via a dedicated remove button on each card
 * 3. Empty state with illustration when no favorites exist
 * 4. Persists changes to AsyncStorage on every update
 * 5. Navigate to product detail on card press
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { removeFavorite } from '../redux/slices/favoritesSlice';
import { saveFavorites } from '../utils/storage';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';

/**
 * FavoriteCard — individual favorite item with remove button.
 * Separate from ProductCard because layout differs (horizontal, with remove CTA).
 */
const FavoriteCard = React.memo(({ product, onRemove, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {/* Product image */}
    <View style={styles.imageContainer}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageEmoji}>📦</Text>
      </View>
      {product.image && (
        <View style={styles.imageOverlay}>
          <Text style={styles.imageEmoji}>🖼️</Text>
        </View>
      )}
    </View>

    {/* Info */}
    <View style={styles.cardInfo}>
      <Text style={styles.cardCategory}>{product.category}</Text>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {product.title}
      </Text>
      <Text style={styles.cardPrice}>${product.price.toFixed(2)}</Text>
    </View>

    {/* Remove button */}
    <TouchableOpacity
      style={styles.removeButton}
      onPress={onRemove}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={styles.removeIcon}>✕</Text>
    </TouchableOpacity>
  </TouchableOpacity>
));

const FavoritesScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const favorites = useSelector((state) => state.favorites.items);

  /**
   * Remove a product from favorites + persist.
   */
  const handleRemove = useCallback(
    (productId) => {
      dispatch(removeFavorite(productId));
      const updated = favorites.filter((item) => item.id !== productId);
      saveFavorites(updated);
    },
    [dispatch, favorites]
  );

  /**
   * Navigate to product detail.
   */
  const handlePress = useCallback(
    (product) => {
      navigation.navigate('ProductsTab', {
        screen: 'ProductDetail',
        params: { product },
      });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <FavoriteCard
        product={item}
        onRemove={() => handleRemove(item.id)}
        onPress={() => handlePress(item)}
      />
    ),
    [handleRemove, handlePress]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // ── Empty state ──
  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💝</Text>
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptySubtitle}>
          Browse products and tap the heart{'\n'}to add them here
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('ProductsTab')}
          activeOpacity={0.7}
        >
          <Text style={styles.browseButtonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Count header */}
      <View style={styles.countHeader}>
        <Text style={styles.countText}>
          {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // ── Count header ──
  countHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  countText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  // ── Card ──
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
  },
  imageEmoji: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  cardCategory: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.error,
  },
  // ── List ──
  listContent: {
    paddingBottom: Spacing.xl,
  },
  // ── Empty state ──
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  browseButtonText: {
    color: Colors.white,
    fontSize: FontSize.body,
    fontWeight: '700',
  },
});

export default FavoritesScreen;
