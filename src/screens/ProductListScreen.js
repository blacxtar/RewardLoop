/**
 * ProductListScreen — main product browsing screen.
 * 
 * Features:
 * 1. Fetches products + categories on mount
 * 2. Debounced search input — filters after user stops typing (300ms)
 * 3. Horizontal category chip bar — filters by product category
 * 4. Pull-to-refresh with RefreshControl
 * 5. Loading skeleton / retry on error
 * 6. Optimized FlatList with keyExtractor, getItemLayout not needed
 *    since card heights vary, but we use initialNumToRender + windowSize
 * 
 * Performance:
 * - ProductCard is React.memo'd — only re-renders on prop change
 * - renderItem wrapped in useCallback — stable reference across re-renders
 * - Debounced search prevents excessive filter runs
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
  ActivityIndicator,
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
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';

const ProductListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    filteredItems,
    loading,
    error,
    searchQuery,
    selectedCategory,
    categories,
  } = useSelector((state) => state.products);

  // Select raw favorites array (stable reference — same object unless items change)
  const favoriteItems = useSelector(
    (state) => state.favorites.items,
    shallowEqual
  );

  // Derive IDs via useMemo — only recalculates when favoriteItems actually changes.
  // WHY not inside useSelector? .map() creates a new array reference every render,
  // which triggers unnecessary re-renders and the Redux "different result" warning.
  const favoriteIds = useMemo(
    () => favoriteItems.map((item) => item.id),
    [favoriteItems]
  );

  // Debounce search query — waits 300ms after user stops typing
  const debouncedSearch = useDebounce(searchQuery, 300);

  // ── Fetch data on mount ──
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // ── Re-filter when debounced search or category changes ──
  useEffect(() => {
    dispatch(filterProducts());
  }, [debouncedSearch, selectedCategory, dispatch]);

  /**
   * Pull-to-refresh handler.
   * Resets filters and re-fetches fresh data from the API.
   */
  const handleRefresh = useCallback(() => {
    dispatch(setSearchQuery(''));
    dispatch(setSelectedCategory('all'));
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  /**
   * Handle category chip press.
   * If the same category is tapped again, reset to 'all'.
   */
  const handleCategoryPress = useCallback(
    (category) => {
      dispatch(
        setSelectedCategory(
          category === selectedCategory ? 'all' : category
        )
      );
    },
    [dispatch, selectedCategory]
  );

  /**
   * Render each product card.
   * useCallback ensures stable reference — FlatList won't unnecessarily
   * re-render items when the parent state changes.
   */
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

  /**
   * FlatList keyExtractor — stable unique key per item.
   * Using product ID (number cast to string) is more reliable than index.
   */
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // ── Error state with retry ──
  if (error && !loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>😕</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Search bar ── */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
          placeholder="Search products..."
          placeholderTextColor={Colors.textLight}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => dispatch(setSearchQuery(''))}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Category filters (fixed height prevents vertical expansion) ── */}
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

      {/* ── Product list ── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderProduct}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // ── Pull-to-refresh ──
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          // ── Performance tuning ──
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={true}
          // ── Empty state ──
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptySubtext}>
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // ── Search ──
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    height: '100%',
  },
  clearIcon: {
    fontSize: 16,
    color: Colors.textLight,
    marginLeft: Spacing.sm,
  },
  // ── Categories (fixed height wrapper prevents flex expansion) ──
  categoryWrapper: {
    maxHeight: 48,
  },
  categoryBar: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    alignItems: 'center',
  },
  // ── List ──
  listContent: {
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
  // ── States ──
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  retryText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});

export default ProductListScreen;
