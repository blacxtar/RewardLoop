/**
 * RewardsScreen — dark-mode-aware loyalty dashboard.
 */

import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../theme';
import { formatDate } from '../utils/constants';

const REWARD_TIERS = [
  { points: 50, label: '₹50 Coupon', icon: '🎟️', color: '#10B981' },
  { points: 100, label: '₹100 Coupon', icon: '🎫', color: '#3B82F6' },
  { points: 250, label: '₹250 Coupon', icon: '🏷️', color: '#8B5CF6' },
  { points: 500, label: '₹500 Coupon', icon: '🎁', color: '#F59E0B' },
  { points: 1000, label: 'Premium Reward', icon: '👑', color: '#EF4444' },
];

const getTransactionIcon = (type) => {
  switch (type) {
    case 'LOGIN_BONUS': return '🔑';
    case 'FAVORITE_ADDED': return '❤️';
    default: return '⭐';
  }
};

const PointsHeroCard = React.memo(({ points, colors }) => {
  const nextTier = REWARD_TIERS.find((tier) => tier.points > points);
  const progress = nextTier ? Math.min((points / nextTier.points) * 100, 100) : 100;

  return (
    <View style={[styles.heroCard, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
      <View style={styles.pointsCircle}>
        <Text style={styles.pointsValue}>{points}</Text>
        <Text style={styles.pointsLabel}>Points</Text>
      </View>
      {nextTier ? (
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            {nextTier.icon} {nextTier.points - points} points to {nextTier.label}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.gold }]} />
          </View>
          <Text style={styles.progressPercent}>{Math.round(progress)}% complete</Text>
        </View>
      ) : (
        <View style={styles.progressSection}>
          <Text style={[styles.maxLevelText, { color: colors.gold }]}>👑 You've reached the highest level!</Text>
        </View>
      )}
    </View>
  );
});

const RewardTierCard = React.memo(({ tier, isUnlocked, colors }) => (
  <View
    style={[
      styles.tierCard,
      {
        backgroundColor: isUnlocked ? (colors.success + '12') : colors.surface,
        borderColor: isUnlocked ? colors.success : colors.border,
      },
    ]}
  >
    <Text style={styles.tierIcon}>{tier.icon}</Text>
    <View style={styles.tierInfo}>
      <Text style={[styles.tierLabel, { color: isUnlocked ? colors.success : colors.textPrimary }]}>
        {tier.label}
      </Text>
      <Text style={[styles.tierPoints, { color: colors.textSecondary }]}>{tier.points} points</Text>
    </View>
    <View style={[styles.tierBadge, { backgroundColor: isUnlocked ? tier.color : colors.border }]}>
      <Text style={styles.tierBadgeText}>{isUnlocked ? '✓' : '🔒'}</Text>
    </View>
  </View>
));

const TransactionItem = React.memo(({ transaction, colors }) => (
  <View style={[styles.transactionItem, { backgroundColor: colors.surface }]}>
    <View style={[styles.transactionIcon, { backgroundColor: colors.background }]}>
      <Text style={styles.transactionEmoji}>{getTransactionIcon(transaction.type)}</Text>
    </View>
    <View style={styles.transactionInfo}>
      <Text style={[styles.transactionDesc, { color: colors.textPrimary }]} numberOfLines={1}>
        {transaction.description}
      </Text>
      <Text style={[styles.transactionDate, { color: colors.textLight }]}>
        {formatDate(transaction.date)}
      </Text>
    </View>
    <Text style={[styles.transactionPoints, { color: colors.success }]}>+{transaction.points}</Text>
  </View>
));

const RewardsScreen = () => {
  const { points, transactions } = useSelector((state) => state.loyalty);
  const { colors } = useTheme();

  const renderTransaction = ({ item }) => <TransactionItem transaction={item} colors={colors} />;
  const keyExtractor = (item) => item.id;

  const ListHeader = useMemo(
    () => (
      <View>
        <PointsHeroCard points={points} colors={colors} />
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>🏆 Reward Tiers</Text>
          {REWARD_TIERS.map((tier) => (
            <RewardTierCard key={tier.points} tier={tier} isUnlocked={points >= tier.points} colors={colors} />
          ))}
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>📋 Points History</Text>
          {transactions.length === 0 && (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryIcon}>📝</Text>
              <Text style={[styles.emptyHistoryText, { color: colors.textSecondary }]}>
                No transactions yet. Start earning points!
              </Text>
            </View>
          )}
        </View>
      </View>
    ),
    [points, transactions.length, colors]
  );

  return (
    <FlatList
      style={[styles.container, { backgroundColor: colors.background }]}
      data={transactions}
      renderItem={renderTransaction}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: Spacing.xxl },
  heroCard: {
    margin: Spacing.md,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  pointsCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
  },
  pointsValue: { fontSize: 36, fontWeight: '800', color: '#FFF' },
  pointsLabel: { fontSize: FontSize.sm, fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  progressSection: { width: '100%', alignItems: 'center' },
  progressLabel: { fontSize: FontSize.md, fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: Spacing.sm },
  progressBar: { width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressPercent: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: Spacing.xs },
  maxLevelText: { fontSize: FontSize.body, fontWeight: '700' },
  section: { marginHorizontal: Spacing.md, marginTop: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', marginBottom: Spacing.md },
  tierCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: BorderRadius.md, padding: Spacing.md,
    marginBottom: Spacing.sm, borderWidth: 1,
  },
  tierIcon: { fontSize: 24, marginRight: Spacing.md },
  tierInfo: { flex: 1 },
  tierLabel: { fontSize: FontSize.md, fontWeight: '600' },
  tierPoints: { fontSize: FontSize.sm, marginTop: 2 },
  tierBadge: { width: 28, height: 28, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center' },
  tierBadgeText: { fontSize: 14, color: '#FFF', fontWeight: '700' },
  transactionItem: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.md, marginBottom: Spacing.xs,
    borderRadius: BorderRadius.md, padding: Spacing.md,
  },
  transactionIcon: { width: 40, height: 40, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  transactionEmoji: { fontSize: 18 },
  transactionInfo: { flex: 1, marginRight: Spacing.sm },
  transactionDesc: { fontSize: FontSize.md, fontWeight: '600', marginBottom: 2 },
  transactionDate: { fontSize: FontSize.xs },
  transactionPoints: { fontSize: FontSize.body, fontWeight: '800' },
  emptyHistory: { alignItems: 'center', padding: Spacing.lg },
  emptyHistoryIcon: { fontSize: 36, marginBottom: Spacing.sm },
  emptyHistoryText: { fontSize: FontSize.md, textAlign: 'center' },
});

export default RewardsScreen;
