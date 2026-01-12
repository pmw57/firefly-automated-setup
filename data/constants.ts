/**
 * A central repository for application-wide constants.
 * This ensures consistency and avoids "magic strings" scattered throughout the codebase.
 */
import { RuleSourceType } from '../types';

// --- Local Storage Keys ---
export const GAME_STATE_STORAGE_KEY = 'firefly_gameState_v3';
export const WIZARD_STEP_STORAGE_KEY = 'firefly_wizardStep_v3';
export const SHOW_FOOTER_QR_KEY = 'firefly_show_footer_qr';
export const THEME_STORAGE_KEY = 'firefly-theme';
export const EXPANSION_SETTINGS_STORAGE_KEY = 'firefly_expansion_settings_v1';
export const SETUP_MODE_STORAGE_KEY = 'firefly_setupMode_v1';

// --- Asset Paths ---
export const ONLINE_BASE_URL = 'https://pmw57.github.io/firefly-automated-setup/';
export const RELATIVE_SPRITE_SHEET_URL = "assets/images/game/expansion_sprites.png";

// --- Rule Engine Constants ---
export const RULE_PRIORITY_ORDER: RuleSourceType[] = [
    'story', 
    'challenge', 
    'combinableSetupCard', // Combinable cards (modifiers) have higher priority
    'setupCard',           // The base setup card
    'optionalRule', 
    'expansion'
];