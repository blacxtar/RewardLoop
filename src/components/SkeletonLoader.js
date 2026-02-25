/**
 * SkeletonLoader — animated placeholder for loading states.
 * 
 * WHY skeleton loading?
 * - Much better UX than a plain spinner — users perceive faster load times
 * - Gives a preview of the layout before content arrives
 * - Modern apps (YouTube, Instagram, LinkedIn) all use skeleton loading
 * 
 * Uses a pulsing opacity animation (no external dependencies).
 * 
 * Props:
 *   width   — skeleton width (number or '100%')
 *   height  — skeleton height
 *   radius  — border radius (default: 8)
 *   style   — additional styles
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { BorderRadius } from '../theme';

const SkeletonLoader = ({ width = '100%', height = 20, radius = BorderRadius.sm, style }) => {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: colors.skeletonBase,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
};

/**
 * ProductCardSkeleton — skeleton placeholder matching ProductCard layout.
 * Used inside ProductListScreen when loading.
 */
export const ProductCardSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={[skeletonStyles.card, { backgroundColor: colors.surface }]}>
      {/* Image placeholder */}
      <SkeletonLoader width="100%" height={180} radius={0} />
      {/* Info */}
      <View style={skeletonStyles.info}>
        <SkeletonLoader width={80} height={12} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="90%" height={16} style={{ marginBottom: 6 }} />
        <SkeletonLoader width="60%" height={16} style={{ marginBottom: 12 }} />
        <View style={skeletonStyles.row}>
          <SkeletonLoader width={60} height={20} />
          <SkeletonLoader width={40} height={16} />
        </View>
      </View>
    </View>
  );
};

const skeletonStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  info: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SkeletonLoader;
