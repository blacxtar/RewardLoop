/**
 * ProductCard — memoized, dark-mode-aware product card.
 */

import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../theme';

const ProductCard = ({ product, onPress, isFavorite }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.shadowColor,
          shadowOpacity: colors.cardShadowOpacity,
          shadowRadius: colors.cardShadowRadius,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.imageContainer, { backgroundColor: colors.white }]}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        {isFavorite && (
          <View style={[styles.favBadge, { backgroundColor: colors.white }]}>
            <Text style={styles.favIcon}>❤️</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.category, { color: colors.primary }]}>{product.category}</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={[styles.price, { color: colors.textPrimary }]}>
            ${product.price.toFixed(2)}
          </Text>
          <View style={styles.rating}>
            <Text style={styles.ratingIcon}>⭐</Text>
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {product.rating?.rate || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    padding: Spacing.md,
    alignItems: 'center',
    height: 180,
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  favBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    borderRadius: BorderRadius.full,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favIcon: { fontSize: 14 },
  info: { padding: Spacing.md },
  category: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { fontSize: FontSize.lg, fontWeight: '800' },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingIcon: { fontSize: 12, marginRight: 3 },
  ratingText: { fontSize: FontSize.sm, fontWeight: '600' },
});

export default memo(ProductCard);
