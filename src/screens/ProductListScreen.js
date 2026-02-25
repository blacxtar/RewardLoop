/**
 * ProductListScreen — dark-mode-aware with skeleton loading.
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  fetchProducts,
  fetchCategories,
  setSearchQuery,
  setSelectedCategory,
  filterProducts,
} from '../redux/slices/productsSlice';
import useDebounce from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import CategoryChip from '../components/CategoryChip';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../theme';

const ProductListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const {
    filteredItems,
    loading,
    error,
    searchQuery,
    selectedCategory,
    categories,
  } = useSelector((state) => state.products);

  const favoriteItems = useSelector(
    (state) => state.favorites.items,
    shallowEqual
  );
  const favoriteIds = useMemo(
    () => favoriteItems.map((item) => item.id),
    [favoriteItems]
  );

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterProducts());
  }, [debouncedSearch, selectedCategory, dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(setSearchQuery(''));
    dispatch(setSelectedCategory('all'));
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryPress = useCallback(
    (category) => {
      dispatch(setSelectedCategory(category === selectedCategory ? 'all' : category));
    },
    [dispatch, selectedCategory]
  );

  const renderProduct = useCallback(
    ({ item }) => (
      <ProductCard
        product={item}
        isFavorite={favoriteIds.includes(item.id)}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      />
    ),
    [navigation, favoriteIds]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Error state
  if (error && !loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={styles.errorIcon}>😕</Text>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={handleRefresh}
        >
          <Text style={[styles.retryText, { color: colors.white }]}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
          placeholder="Search products..."
          placeholderTextColor={colors.textLight}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => dispatch(setSearchQuery(''))}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.clearIcon, { color: colors.textLight }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category filters */}
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryBar}
        >
          <CategoryChip
            label="All"
            isSelected={selectedCategory === 'all'}
            onPress={() => dispatch(setSelectedCategory('all'))}
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              isSelected={selectedCategory === cat}
              onPress={() => handleCategoryPress(cat)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Skeleton Loading */}
      {loading ? (
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={() => <ProductCardSkeleton />}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderProduct}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={[styles.emptyText, { color: colors.textPrimary }]}>No products found</Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Try a different search or category
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  searchIcon: { fontSize: 16, marginRight: Spacing.sm },
  searchInput: { flex: 1, fontSize: FontSize.md, height: '100%' },
  clearIcon: { fontSize: 16, marginLeft: Spacing.sm },
  categoryWrapper: { maxHeight: 48 },
  categoryBar: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, alignItems: 'center' },
  listContent: { paddingBottom: Spacing.xl, flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  errorIcon: { fontSize: 48, marginBottom: Spacing.md },
  errorText: { fontSize: FontSize.body, textAlign: 'center', marginBottom: Spacing.md },
  retryButton: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md },
  retryText: { fontSize: FontSize.md, fontWeight: '600' },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontSize: FontSize.lg, fontWeight: '600', marginBottom: Spacing.xs },
  emptySubtext: { fontSize: FontSize.md },
});

export default ProductListScreen;
