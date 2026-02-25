/**
 * ProductDetailScreen — full product info with "Add to Favorites" toggle.
 * 
 * Design decisions:
 * 1. Product data is passed via route params (no extra API call needed)
 * 2. Favorite toggle dispatches to both favoritesSlice AND loyaltySlice
 *    - Adding: +10 loyalty points + persists to AsyncStorage
 *    - Removing: just removes from favorites (points are NOT deducted —
 *      loyalty points should only grow, like a real loyalty system)
 * 3. ScrollView (not FlatList) because we render a single product, not a list
 * 4. Image has a fixed aspect ratio container for visual consistency
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../redux/slices/favoritesSlice';
import { earnPoints } from '../redux/slices/loyaltySlice';
import { saveFavorites, saveLoyaltyData } from '../utils/storage';
import { LOYALTY_POINTS, TRANSACTION_TYPES } from '../utils/constants';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const dispatch = useDispatch();

  // Check if this product is already favorited
  const isFavorite = useSelector((state) =>
    state.favorites.items.some((item) => item.id === product.id)
  );

  // Get current state refs for persistence
  const favorites = useSelector((state) => state.favorites.items);
  const loyalty = useSelector((state) => state.loyalty);

  /**
   * Toggle favorite status.
   * - ADD: dispatch addFavorite + earn loyalty points + persist both
   * - REMOVE: dispatch removeFavorite + persist favorites only
   * 
   * WHY not deduct points on remove?
   * In real loyalty systems, points are earned and never reversed for
   * engagement actions. This encourages exploration without penalty.
   */
  const handleToggleFavorite = useCallback(() => {
    if (isFavorite) {
      dispatch(removeFavorite(product.id));
      // Persist updated favorites (after removal)
      const updated = favorites.filter((item) => item.id !== product.id);
      saveFavorites(updated);
    } else {
      dispatch(addFavorite(product));
      // Award loyalty points for adding to favorites
      dispatch(
        earnPoints({
          type: TRANSACTION_TYPES.FAVORITE_ADDED,
          points: LOYALTY_POINTS.FAVORITE_ADDED,
          description: `Favorited: ${product.title}`,
        })
      );
      // Persist updated favorites and loyalty data
      const updated = [...favorites, product];
      saveFavorites(updated);
      // Loyalty data will be persisted after the state update settles
      setTimeout(() => {
        // We need the updated loyalty state, so use a small delay
        // In production, this would be middleware or a listener
        saveLoyaltyData({
          points: loyalty.points + LOYALTY_POINTS.FAVORITE_ADDED,
          transactions: [
            {
              id: Date.now().toString(),
              type: TRANSACTION_TYPES.FAVORITE_ADDED,
              points: LOYALTY_POINTS.FAVORITE_ADDED,
              description: `Favorited: ${product.title}`,
              date: new Date().toISOString(),
            },
            ...loyalty.transactions,
          ],
        });
      }, 100);
    }
  }, [dispatch, product, isFavorite, favorites, loyalty]);

  // Star rating display
  const renderStars = useMemo(() => {
    const rate = product.rating?.rate || 0;
    const fullStars = Math.floor(rate);
    const hasHalf = rate - fullStars >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalf) stars += '½';
    stars += '☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0));
    return stars;
  }, [product.rating]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Product Image ── */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* ── Product Info ── */}
      <View style={styles.infoCard}>
        {/* Category badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{product.title}</Text>

        {/* Price + Rating row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.stars}>{renderStars}</Text>
            <Text style={styles.ratingText}>
              {product.rating?.rate} ({product.rating?.count} reviews)
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* ── Favorite Toggle Button ── */}
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFavorite && styles.favoriteButtonActive,
          ]}
          onPress={handleToggleFavorite}
          activeOpacity={0.7}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
          <Text
            style={[
              styles.favoriteText,
              isFavorite && styles.favoriteTextActive,
            ]}
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>

        {/* Loyalty hint */}
        {!isFavorite && (
          <Text style={styles.loyaltyHint}>
            ⭐ Earn {LOYALTY_POINTS.FAVORITE_ADDED} loyalty points!
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  // ── Image ──
  imageContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    alignItems: 'center',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  // ── Info Card ──
  infoCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    marginTop: -Spacing.md,
    padding: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '15', // 15% opacity
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.md,
  },
  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 28,
    marginBottom: Spacing.md,
  },
  // ── Price + Rating ──
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  price: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  stars: {
    fontSize: FontSize.body,
    color: Colors.gold,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  // ── Description ──
  sectionTitle: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  // ── Favorite Button ──
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.accent,
    backgroundColor: Colors.white,
  },
  favoriteButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  favoriteIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  favoriteText: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.accent,
  },
  favoriteTextActive: {
    color: Colors.white,
  },
  loyaltyHint: {
    fontSize: FontSize.sm,
    color: Colors.goldDark,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});

export default ProductDetailScreen;
