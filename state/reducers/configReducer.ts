
import { GameState, Expansions, GameMode } from '../../types/index';
import { Action, ActionType, ExpansionBundle } from '../actions';
import { EXPANSIONS_METADATA } from '../../data/expansions';
import { EXPANSION_SETTINGS_STORAGE_KEY, SETUP_MODE_STORAGE_KEY } from '../../data/constants';
import { defaultToFlyingSoloIfNeeded } from '../validation';

const adjustPlayerNames = (currentNames: string[], targetCount: number): string[] => {
    const newNames = [...currentNames];
    if (targetCount > newNames.length) {
        for (let i = newNames.length; i < targetCount; i++) {
            newNames.push('');
        }
    } else {
        newNames.length = targetCount;
    }
    return newNames;
};

const handlePlayerCountChange = (state: GameState, count: number): GameState => {
    const safeCount = Math.max(1, Math.min(9, count));
    const newMode: GameMode = safeCount === 1 ? 'solo' : 'multiplayer';
    
    const intermediateState = {
        ...state,
        playerCount: safeCount,
        gameMode: newMode,
        playerNames: adjustPlayerNames(state.playerNames, safeCount),
        isCampaign: newMode === 'multiplayer' ? false : state.isCampaign,
        draft: { state: null, isManual: false },
    };

    return defaultToFlyingSoloIfNeeded(intermediateState);
};

const handleExpansionToggle = (state: GameState, expansionId: keyof GameState['expansions']): GameState => {
    const nextExpansions = { ...state.expansions, [expansionId]: !state.expansions[expansionId] };

    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(EXPANSION_SETTINGS_STORAGE_KEY, JSON.stringify(nextExpansions));
        }
    } catch (e) {
        console.error("Could not save expansion settings.", e);
    }
    
    let newState: GameState = { ...state, expansions: nextExpansions };
    
    if (expansionId === 'tenth') {
        newState.gameEdition = nextExpansions.tenth ? 'tenth' : 'original';
        if (nextExpansions.tenth) {
            newState = defaultToFlyingSoloIfNeeded(newState);
        }
    }
    
    return newState;
};

const handleSetExpansionsBundle = (state: GameState, bundle: ExpansionBundle): GameState => {
    const newExpansions = { ...state.expansions };
    const allOfficial = EXPANSIONS_METADATA
        .filter(e => e.category !== 'independent' && e.id !== 'base')
        .map(e => e.id as keyof Expansions);
        
    // Turn off all official expansions first
    allOfficial.forEach(id => {
        newExpansions[id] = false;
    });
    
    if (bundle === 'rim_worlds') {
        newExpansions.blue = true;
        newExpansions.kalidasa = true;
    } else if (bundle === 'all_official') {
        allOfficial.forEach(id => {
            newExpansions[id] = true;
        });
    }

    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(EXPANSION_SETTINGS_STORAGE_KEY, JSON.stringify(newExpansions));
        }
    } catch (e) {
        console.error("Could not save expansion settings.", e);
    }

    return { ...state, expansions: newExpansions };
};

export function configReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case ActionType.SET_PLAYER_COUNT:
            return handlePlayerCountChange(state, action.payload);
        
        case ActionType.SET_PLAYER_NAME: {
            const newNames = [...state.playerNames];
            newNames[action.payload.index] = action.payload.name;
            return { ...state, playerNames: newNames };
        }
        
        case ActionType.TOGGLE_EXPANSION:
            return handleExpansionToggle(state, action.payload);

        case ActionType.SET_EXPANSIONS_BUNDLE:
            return handleSetExpansionsBundle(state, action.payload);
            
        case ActionType.SET_SETUP_MODE: {
            const newMode = action.payload;
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem(SETUP_MODE_STORAGE_KEY, newMode);
                }
            } catch (e) {
                console.error("Could not save setup mode preference.", e);
            }
            return { ...state, setupMode: newMode };
        }

        case ActionType.TOGGLE_SHOW_HIDDEN_CONTENT: {
            const showHidden = !state.showHiddenContent;
            let nextExpansions = state.expansions;
            if (!showHidden) {
                // If we're hiding them, turn them all off.
                nextExpansions = { ...state.expansions };
                EXPANSIONS_METADATA.forEach(exp => {
                    if (exp.hidden) {
                        nextExpansions[exp.id as keyof Expansions] = false;
                    }
                });
            }
            return { ...state, showHiddenContent: showHidden, expansions: nextExpansions };
        }

        default:
            return state;
    }
}
