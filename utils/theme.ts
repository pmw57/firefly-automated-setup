import { ThemeColor } from "../types/index";
import { expansionColorConfig } from '../data/themeColors';

/**
 * Converts a hex color string to an "R, G, B" string.
 * @param hex The hex color string (e.g., "#d2b48c").
 * @returns The RGB string (e.g., "210, 180, 140").
 */
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `${r}, ${g}, ${b}`;
};

/**
 * A map from the abstract theme color names used in the expansion metadata
 * to their concrete RGB string representations. This allows components to set
 * a CSS variable for the color, which can then be used by various theme-related
 * utility classes.
 * 
 * This map is now generated dynamically from the single source of truth in `data/themeColors.ts`.
 */
export const THEME_COLOR_MAP: Record<ThemeColor, string> = {
    ...Object.fromEntries(
        Object.entries(expansionColorConfig).map(([key, { hex }]) => [key, hexToRgb(hex)])
    ) as Record<Exclude<ThemeColor, 'black' | 'dark'>, string>,
    
    // Generic colors
    black: '0, 0, 0',
    dark: '55, 65, 81', // gray-600
};
