/**
 * ProductDetailScreen — dark-mode-aware full product view.
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
import { useTheme } from '../theme/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../theme';

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const isFavorite = useSelector((state) =>
    state.favorites.items.some((item) => item.id === product.id)
  );
  const favorites = useSelector((state) => state.favorites.items);
  const loyalty = useSelector((state) => state.loyalty);

  const handleToggleFavorite = useCallback(() => {
    if (isFavorite) {
      dispatch(removeFavorite(product.id));
      const updated = favorites.filter((item) => item.id !== product.id);
      saveFavorites(updated);
    } else {
      dispatch(addFavorite(product));
      dispatch(
        earnPoints({
          type: TRANSACTION_TYPES.FAVORITE_ADDED,
          points: LOYALTY_POINTS.FAVORITE_ADDED,
          description: `Favorited: ${product.title}`,
        })
      );
      const updated = [...favorites, product];
      saveFavorites(updated);
      setTimeout(() => {
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
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.imageContainer, { backgroundColor: colors.white }]}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      </View>

      <View
        style={[
          styles.infoCard,
          {
            backgroundColor: colors.surface,
            shadowColor: colors.shadowColor,
            shadowOpacity: colors.cardShadowOpacity,
          },
        ]}
      >
        <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '15' }]}>
          <Text style={[styles.categoryText, { color: colors.primary }]}>{product.category}</Text>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>{product.title}</Text>

        <View style={[styles.priceRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.price, { color: colors.textPrimary }]}>${product.price.toFixed(2)}</Text>
          <View style={styles.ratingContainer}>
            <Text style={[styles.stars, { color: colors.gold }]}>{renderStars}</Text>
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {product.rating?.rate} ({product.rating?.count} reviews)
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Description</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{product.description}</Text>

        <TouchableOpacity
          style={[
            styles.favoriteButton,
            {
              borderColor: colors.accent,
              backgroundColor: isFavorite ? colors.accent : colors.surface,
            },
          ]}
          onPress={handleToggleFavorite}
          activeOpacity={0.7}
        >
          <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          <Text
            style={[
              styles.favoriteText,
              { color: isFavorite ? colors.white : colors.accent },
            ]}
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>

        {!isFavorite && (
          <Text style={[styles.loyaltyHint, { color: colors.goldDark }]}>
            ⭐ Earn {LOYALTY_POINTS.FAVORITE_ADDED} loyalty points!
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: Spacing.xxl },
  imageContainer: { padding: Spacing.xl, alignItems: 'center', height: 300 },
  image: { width: '100%', height: '100%' },
  infoCard: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    marginTop: -Spacing.md,
    padding: Spacing.lg,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 3,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.md,
  },
  categoryText: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: FontSize.xl, fontWeight: '700', lineHeight: 28, marginBottom: Spacing.md },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  price: { fontSize: FontSize.xxl, fontWeight: '800' },
  ratingContainer: { alignItems: 'flex-end' },
  stars: { fontSize: FontSize.body, marginBottom: 2 },
  ratingText: { fontSize: FontSize.xs },
  sectionTitle: { fontSize: FontSize.body, fontWeight: '700', marginBottom: Spacing.sm },
  description: { fontSize: FontSize.md, lineHeight: 22, marginBottom: Spacing.lg },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
  },
  favoriteIcon: { fontSize: 20, marginRight: Spacing.sm },
  favoriteText: { fontSize: FontSize.body, fontWeight: '700' },
  loyaltyHint: { fontSize: FontSize.sm, textAlign: 'center', marginTop: Spacing.sm },
});

export default ProductDetailScreen;
