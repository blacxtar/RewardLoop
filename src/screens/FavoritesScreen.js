/**
 * FavoritesScreen — dark-mode-aware favorites list.
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
import { useTheme } from '../theme/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../theme';

const FavoriteCard = React.memo(({ product, onRemove, onPress, colors }) => (
  <TouchableOpacity
    style={[
      styles.card,
      {
        backgroundColor: colors.surface,
        shadowColor: colors.shadowColor,
        shadowOpacity: colors.cardShadowOpacity,
      },
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.imageContainer, { backgroundColor: colors.background }]}>
      <Text style={styles.imageEmoji}>📦</Text>
    </View>
    <View style={styles.cardInfo}>
      <Text style={[styles.cardCategory, { color: colors.primary }]}>{product.category}</Text>
      <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={2}>
        {product.title}
      </Text>
      <Text style={[styles.cardPrice, { color: colors.textPrimary }]}>${product.price.toFixed(2)}</Text>
    </View>
    <TouchableOpacity
      style={[styles.removeButton, { backgroundColor: colors.error + '15' }]}
      onPress={onRemove}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={[styles.removeIcon, { color: colors.error }]}>✕</Text>
    </TouchableOpacity>
  </TouchableOpacity>
));

const FavoritesScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const favorites = useSelector((state) => state.favorites.items);
  const { colors } = useTheme();

  const handleRemove = useCallback(
    (productId) => {
      dispatch(removeFavorite(productId));
      const updated = favorites.filter((item) => item.id !== productId);
      saveFavorites(updated);
    },
    [dispatch, favorites]
  );

  const handlePress = useCallback(
    (product) => {
      navigation.navigate('ProductsTab', { screen: 'ProductDetail', params: { product } });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <FavoriteCard
        product={item}
        colors={colors}
        onRemove={() => handleRemove(item.id)}
        onPress={() => handlePress(item)}
      />
    ),
    [handleRemove, handlePress, colors]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  if (favorites.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={styles.emptyIcon}>💝</Text>
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No favorites yet</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Browse products and tap the heart{'\n'}to add them here
        </Text>
        <TouchableOpacity
          style={[styles.browseButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('ProductsTab')}
          activeOpacity={0.7}
        >
          <Text style={[styles.browseButtonText, { color: colors.white }]}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.countHeader}>
        <Text style={[styles.countText, { color: colors.textSecondary }]}>
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
  container: { flex: 1 },
  countHeader: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  countText: { fontSize: FontSize.sm, fontWeight: '600' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  imageEmoji: { fontSize: 24 },
  cardInfo: { flex: 1, marginRight: Spacing.sm },
  cardCategory: { fontSize: FontSize.xs, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  cardTitle: { fontSize: FontSize.md, fontWeight: '600', lineHeight: 18, marginBottom: 4 },
  cardPrice: { fontSize: FontSize.body, fontWeight: '800' },
  removeButton: { width: 32, height: 32, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center' },
  removeIcon: { fontSize: 14, fontWeight: '700' },
  listContent: { paddingBottom: Spacing.xl },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.sm },
  emptySubtitle: { fontSize: FontSize.md, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.lg },
  browseButton: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.md },
  browseButtonText: { fontSize: FontSize.body, fontWeight: '700' },
});

export default FavoritesScreen;
