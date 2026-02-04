
import { useEffect, useCallback } from 'react';
import { useGameState } from './useGameState';
import { useGameDispatch } from './useGameDispatch';
import { GameState } from '../types';
import { ActionType } from '../state/actions';

// Define a minimal shape for the shareable state to keep URLs short
interface ShareableState {
    expansions: string[]; // List of active expansion IDs
    setupMode: GameState['setupMode'];
    setupCardId: string;
    secondarySetupId?: string;
    storyIndex: number | null;
    goal?: string;
    players: number;
}

export const useUrlSync = () => {
    const { state } = useGameState();
    const { dispatch } = useGameDispatch();

    // 1. Serialize State to URL Hash
    useEffect(() => {
        // Prevent execution in blob/preview environments where history API fails
        if (typeof window !== 'undefined' && window.location.protocol === 'blob:') return;

        const timeoutId = setTimeout(() => {
            const activeExpansions = Object.entries(state.expansions)
                .filter(([, isActive]) => isActive)
                .map(([id]) => id);

            const shareable: ShareableState = {
                expansions: activeExpansions,
                setupMode: state.setupMode,
                setupCardId: state.setupCardId as string,
                secondarySetupId: state.secondarySetupId as string,
                storyIndex: state.selectedStoryCardIndex,
                goal: state.selectedGoal,
                players: state.playerCount,
            };

            try {
                const json = JSON.stringify(shareable);
                const encoded = btoa(json); // Base64 encode
                
                // Only update if changed to avoid history spam
                const currentHash = window.location.hash.slice(1); // remove '#'
                if (currentHash !== encoded) {
                    window.history.replaceState(null, '', `#${encoded}`);
                }
            } catch (e) {
                // Ignore security errors in restrictive iframes
                if (e instanceof DOMException && e.name === 'SecurityError') return;
                console.error("Failed to serialize state for URL", e);
            }
        }, 1000); // Debounce updates

        return () => clearTimeout(timeoutId);
    }, [state]);

    // 2. Deserialize Hash on Mount
    useEffect(() => {
        if (typeof window === 'undefined' || window.location.protocol === 'blob:') return;

        const hash = window.location.hash.slice(1);
        if (hash) {
            try {
                const json = atob(hash);
                const data: ShareableState = JSON.parse(json);
                
                // Construct partial GameState
                const importedState: Partial<GameState> = {
                    setupMode: data.setupMode,
                    setupCardId: data.setupCardId,
                    secondarySetupId: data.secondarySetupId,
                    selectedStoryCardIndex: data.storyIndex,
                    selectedGoal: data.goal,
                    playerCount: data.players,
                };

                const expansionMap: Record<string, boolean> = {};
                data.expansions.forEach(id => { expansionMap[id] = true; });
                
                // We cast to unknown then to the target type to bypass strict checks for the partial object
                // The reducer logic handles merging this with default values.
                importedState.expansions = expansionMap as unknown as GameState['expansions'];

                dispatch({ type: ActionType.IMPORT_GAME_STATE, payload: importedState });
                
            } catch (e) {
                console.error("Failed to parse game state from URL", e);
                // Fallback: Clear hash if invalid
                window.history.replaceState(null, '', ' ');
            }
        }
    }, [dispatch]);
    
    const copyShareUrl = useCallback(() => {
        if (typeof window === 'undefined') return false;
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        return true;
    }, []);

    return { copyShareUrl };
};
