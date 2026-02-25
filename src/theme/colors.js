/**
 * Color palettes for light and dark themes.
 * 
 * WHY separate palettes?
 * - Each palette defines the SAME keys with different values
 * - Components reference semantic names (background, surface, textPrimary)
 *   rather than absolute colors — so switching themes is a single context swap
 * - Brand colors (primary, accent, gold) stay consistent across themes
 *   for visual identity
 */

// ── Brand colors (shared across themes) ──
const Brand = {
  primary: '#6C63FF',
  primaryDark: '#5A52D5',
  primaryLight: '#8B83FF',
  accent: '#FF6B6B',
  accentLight: '#FF8E8E',
  gold: '#FFD700',
  goldDark: '#E6C200',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

export const LightTheme = {
  ...Brand,
  // ── Surfaces ──
  background: '#F0F2F5',       // Slight warm grey — more modern than pure white
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',  // Cards with elevation
  // ── Text ──
  textPrimary: '#111827',      // Near-black for sharp readability
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  // ── Borders & dividers ──
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  // ── Shadows ──
  shadowColor: '#000000',
  // ── Misc ──
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.4)',
  // ── Skeleton ──
  skeletonBase: '#E5E7EB',
  skeletonHighlight: '#F3F4F6',
  // ── Tab bar ──
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E5E7EB',
  // ── Input ──
  inputBackground: '#F9FAFB',
  // ── Card ──
  cardShadowOpacity: 0.08,
  cardShadowRadius: 12,
};

export const DarkTheme = {
  ...Brand,
  primary: '#7C74FF',         // Slightly lighter purple for dark BG contrast
  primaryLight: '#9B95FF',
  // ── Surfaces ──
  background: '#0F172A',      // Deep navy — modern, easier on eyes than pure black
  surface: '#1E293B',         // Slate card surface
  surfaceElevated: '#1E293B',
  // ── Text ──
  textPrimary: '#F1F5F9',     // Off-white text
  textSecondary: '#94A3B8',
  textLight: '#64748B',
  // ── Borders & dividers ──
  border: '#334155',
  borderLight: '#1E293B',
  // ── Shadows (subtle on dark) ──
  shadowColor: '#000000',
  // ── Misc ──
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.6)',
  // ── Skeleton ──
  skeletonBase: '#334155',
  skeletonHighlight: '#475569',
  // ── Tab bar ──
  tabBarBackground: '#1E293B',
  tabBarBorder: '#334155',
  // ── Input ──
  inputBackground: '#1E293B',
  // ── Card ──
  cardShadowOpacity: 0.3,
  cardShadowRadius: 16,
};
