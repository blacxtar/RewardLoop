/**
 * Barrel export for theme tokens.
 * 
 * All components import from here:
 *   import { useTheme } from '../theme';
 *   import { Spacing, FontSize } from '../theme';
 * 
 * Colors are now accessed via useTheme() hook instead of a static import,
 * so they respond to dark/light mode switching.
 */

export { LightTheme, DarkTheme } from './colors';
export { Spacing, FontSize, BorderRadius } from './spacing';
export { ThemeProvider, useTheme } from './ThemeContext';
