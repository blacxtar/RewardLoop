/**
 * Centralized color palette for RewardLoop.
 * 
 * WHY: A single source of truth for colors ensures visual consistency
 * across the entire app and makes dark-mode or rebranding trivial.
 * All components import from here — never use raw hex values inline.
 */

export const Colors = {
  // ── Primary brand colors (loyalty / reward theme) ──
  primary: '#6C63FF',        // Vibrant purple — conveys trust & premium feel
  primaryDark: '#5A52D5',    // Pressed / active states
  primaryLight: '#8B83FF',   // Subtle highlights

  // ── Accent ──
  accent: '#FF6B6B',         // Warm coral — used for badges, alerts, CTAs
  accentLight: '#FF8E8E',

  // ── Loyalty-specific ──
  gold: '#FFD700',           // Points / reward highlights
  goldDark: '#E6C200',

  // ── Neutrals ──
  background: '#F5F7FA',     // Light grey background
  surface: '#FFFFFF',        // Card / surface color
  textPrimary: '#1A1A2E',   // High-contrast body text
  textSecondary: '#6B7280',  // Muted / secondary text
  textLight: '#9CA3AF',      // Placeholders, disabled states
  border: '#E5E7EB',         // Subtle borders & dividers

  // ── Semantic ──
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // ── Misc ──
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
};
