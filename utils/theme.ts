// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { ThemeColor } from "../types/index";

/**
 * A map from the abstract theme color names used in the expansion metadata
 * to their concrete RGB string representations. This allows components to set
 * a CSS variable for the color, which can then be used by various theme-related
 * utility classes.
 * 
 * The hex values are sourced from `tailwind.config.js`.
 */
export const THEME_COLOR_MAP: Record<ThemeColor, string> = {
    // From tailwind.config.js -> theme.extend.colors.expansion
    orangeRed: '255, 69, 0',       // #FF4500
    steelBlue: '70, 130, 180',     // #4682B4
    darkSlateBlue: '72, 61, 139',  // #483D8B
    deepBrown: '35, 23, 9',        // #231709
    rebeccaPurple: '102, 51, 153', // #663399
    cordovan: '137, 63, 69',       // #893f45
    darkOliveGreen: '85, 107, 47', // #556b2f
    teal: '13, 148, 136',          // #0d9488

    // From tailwind.config.js -> theme.extend.colors.firefly
    saddleBrown: '139, 69, 19',    // #8B4513
    
    // Generic colors
    black: '0, 0, 0',
    dark: '55, 65, 81', // gray-600
};