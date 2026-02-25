/**
 * RewardsScreen — loyalty dashboard showing points, progress, and transaction history.
 * 
 * Design aligned with GARS Technology's Loyalty SaaS model:
 * 1. Hero card showing total points with a progress bar toward the next reward tier
 * 2. Reward tiers with unlock thresholds (configurable for future backend sync)
 * 3. Transaction history — chronological audit trail of all point-earning events
 * 4. Empty state when no transactions yet
 * 
 * Architecture:
 * - Reads directly from loyaltySlice (points + transactions)
 * - No local state needed — everything is derived from Redux
 * - SectionList used for header + transactions to keep a single scroll
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';
import { formatDate } from '../utils/constants';

// ── Reward tiers — configurable, future-proof for backend ──
const REWARD_TIERS = [
  { points: 50, label: '₹50 Coupon', icon: '🎟️', color: '#10B981' },
  { points: 100, label: '₹100 Coupon', icon: '🎫', color: '#3B82F6' },
  { points: 250, label: '₹250 Coupon', icon: '🏷️', color: '#8B5CF6' },
  { points: 500, label: '₹500 Coupon', icon: '🎁', color: '#F59E0B' },
  { points: 1000, label: 'Premium Reward', icon: '👑', color: '#EF4444' },
];

/**
 * Get the transaction icon based on type.
 */
const getTransactionIcon = (type) => {
  switch (type) {
    case 'LOGIN_BONUS':
      return '🔑';
    case 'FAVORITE_ADDED':
      return '❤️';
    default:
      return '⭐';
  }
};

/**
 * PointsHeroCard — large display of total points with progress ring.
 */
const PointsHeroCard = React.memo(({ points }) => {
  // Find current and next reward tier
  const nextTier = REWARD_TIERS.find((tier) => tier.points > points);
  const progress = nextTier
    ? Math.min((points / nextTier.points) * 100, 100)
    : 100;

  return (
    <View style={styles.heroCard}>
      {/* Points display */}
      <View style={styles.pointsCircle}>
        <Text style={styles.pointsValue}>{points}</Text>
        <Text style={styles.pointsLabel}>Points</Text>
      </View>

      {/* Progress to next reward */}
      {nextTier ? (
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            {nextTier.icon} {nextTier.points - points} points to {nextTier.label}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={styles.progressPercent}>
            {Math.round(progress)}% complete
          </Text>
        </View>
      ) : (
        <View style={styles.progressSection}>
          <Text style={styles.maxLevelText}>
            👑 You've reached the highest level!
          </Text>
        </View>
      )}
    </View>
  );
});

/**
 * RewardTierCard — shows a single reward tier with unlock status.
 */
const RewardTierCard = React.memo(({ tier, isUnlocked }) => (
  <View style={[styles.tierCard, isUnlocked && styles.tierCardUnlocked]}>
    <Text style={styles.tierIcon}>{tier.icon}</Text>
    <View style={styles.tierInfo}>
      <Text style={[styles.tierLabel, isUnlocked && styles.tierLabelUnlocked]}>
        {tier.label}
      </Text>
      <Text style={styles.tierPoints}>{tier.points} points</Text>
    </View>
    <View
      style={[
        styles.tierBadge,
        { backgroundColor: isUnlocked ? tier.color : Colors.border },
      ]}
    >
      <Text style={styles.tierBadgeText}>
        {isUnlocked ? '✓' : '🔒'}
      </Text>
    </View>
  </View>
));

/**
 * TransactionItem — single row in the transaction history.
 */
const TransactionItem = React.memo(({ transaction }) => (
  <View style={styles.transactionItem}>
    <View style={styles.transactionIcon}>
      <Text style={styles.transactionEmoji}>
        {getTransactionIcon(transaction.type)}
      </Text>
    </View>
    <View style={styles.transactionInfo}>
      <Text style={styles.transactionDesc} numberOfLines={1}>
        {transaction.description}
      </Text>
      <Text style={styles.transactionDate}>
        {formatDate(transaction.date)}
      </Text>
    </View>
    <Text style={styles.transactionPoints}>+{transaction.points}</Text>
  </View>
));

/**
 * Main RewardsScreen component.
 */
const RewardsScreen = () => {
  const { points, transactions } = useSelector((state) => state.loyalty);

  // Memoize unlocked tiers to avoid recalculation on every render
  const unlockedTiers = useMemo(
    () => REWARD_TIERS.filter((tier) => points >= tier.points),
    [points]
  );

  const renderTransaction = ({ item }) => (
    <TransactionItem transaction={item} />
  );

  const keyExtractor = (item) => item.id;

  // ── List header: hero card + reward tiers ──
  const ListHeader = useMemo(
    () => (
      <View>
        {/* Points hero */}
        <PointsHeroCard points={points} />

        {/* Reward tiers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Reward Tiers</Text>
          {REWARD_TIERS.map((tier) => (
            <RewardTierCard
              key={tier.points}
              tier={tier}
              isUnlocked={points >= tier.points}
            />
          ))}
        </View>

        {/* Transaction history header */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Points History</Text>
          {transactions.length === 0 && (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryIcon}>📝</Text>
              <Text style={styles.emptyHistoryText}>
                No transactions yet. Start earning points!
              </Text>
            </View>
          )}
        </View>
      </View>
    ),
    [points, transactions.length]
  );

  return (
    <FlatList
      style={styles.container}
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  // ── Hero Card ──
  heroCard: {
    margin: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  pointsCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.white,
  },
  pointsLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.gold,
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: Spacing.xs,
  },
  maxLevelText: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.gold,
  },
  // ── Sections ──
  section: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  // ── Reward Tiers ──
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tierCardUnlocked: {
    borderColor: Colors.success,
    backgroundColor: '#F0FDF4',
  },
  tierIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  tierInfo: {
    flex: 1,
  },
  tierLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tierLabelUnlocked: {
    color: Colors.success,
  },
  tierPoints: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tierBadge: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tierBadgeText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '700',
  },
  // ── Transaction History ──
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transactionEmoji: {
    fontSize: 18,
  },
  transactionInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  transactionDesc: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  transactionPoints: {
    fontSize: FontSize.body,
    fontWeight: '800',
    color: Colors.success,
  },
  // ── Empty ──
  emptyHistory: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  emptyHistoryIcon: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  emptyHistoryText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default RewardsScreen;
