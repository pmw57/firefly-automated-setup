
import { GameState, Expansions } from '../types';
import { STORY_CARDS, SETUP_CARDS, EXPANSIONS_METADATA, SETUP_CARD_IDS } from '../constants';

const calculatePlayerNames = (currentNames: string[], newCount: number): string[] => {
    const newNames = [...currentNames];
    if (newCount > newNames.length) {
        for (let i = newNames.length; i < newCount; i++) {
            newNames.push(`Captain ${i + 1}`);
        }
    } else {
        newNames.length = newCount;
    }
    return newNames;
};

export const updatePlayerCountState = (prevState: GameState, newCount: number): GameState => {
    const safeCount = Math.max(1, Math.min(9, newCount));
    const newMode = safeCount === 1 ? 'solo' : 'multiplayer';

    const newState: GameState = {
        ...prevState,
        playerCount: safeCount,
        gameMode: newMode,
        playerNames: calculatePlayerNames(prevState.playerNames, safeCount),
        isCampaign: newMode === 'multiplayer' ? false : prevState.isCampaign,
    };

    if (newMode === 'multiplayer' && prevState.setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
        newState.setupCardId = SETUP_CARD_IDS.STANDARD;
        newState.setupCardName = 'Standard Game Setup';
        newState.secondarySetupId = undefined;
    }

    const currentStoryDef = STORY_CARDS.find(c => c.title === prevState.selectedStoryCard);
    if (newMode === 'multiplayer' && currentStoryDef?.isSolo) {
        const defaultMulti = STORY_CARDS.find(c => !c.isSolo && c.requiredExpansion !== 'community') || STORY_CARDS[0];
        newState.selectedStoryCard = defaultMulti.title;
        newState.selectedGoal = defaultMulti.goals?.[0]?.title;
        newState.challengeOptions = {};
    }
    
    return newState;
};

export const updateExpansionState = (prevState: GameState, toggledExpansion: keyof Expansions): GameState => {
    const nextExpansions = {
        ...prevState.expansions,
        [toggledExpansion]: !prevState.expansions[toggledExpansion],
    };

    const newState: GameState = { ...prevState, expansions: nextExpansions };

    if (toggledExpansion === 'tenth') {
        newState.gameEdition = nextExpansions.tenth ? 'tenth' : 'original';
    }

    const currentSetup = SETUP_CARDS.find(s => s.id === prevState.setupCardId);
    let shouldResetSetup = false;

    if (currentSetup?.requiredExpansion && !nextExpansions[currentSetup.requiredExpansion]) {
        shouldResetSetup = true;
    }
    
    if (toggledExpansion === 'tenth' && !nextExpansions.tenth && prevState.setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
        shouldResetSetup = true;
    }

    if (shouldResetSetup) {
        newState.setupCardId = SETUP_CARD_IDS.STANDARD;
        newState.setupCardName = 'Standard Game Setup';
        newState.secondarySetupId = undefined;
    }
    
    return newState;
};

export const autoSelectFlyingSoloState = (prevState: GameState): GameState => {
    const isSolo = prevState.gameMode === 'solo';
    const has10th = prevState.expansions.tenth;
    const isDefaultSetup = !prevState.setupCardId || prevState.setupCardId === SETUP_CARD_IDS.STANDARD;

    if (isSolo && has10th && isDefaultSetup) {
        return {
            ...prevState,
            setupCardId: SETUP_CARD_IDS.FLYING_SOLO,
            setupCardName: 'Flying Solo',
            secondarySetupId: SETUP_CARD_IDS.STANDARD,
        };
    }
    return prevState;
};

export const getDefaultGameState = (): GameState => {
    const allExpansions = EXPANSIONS_METADATA.reduce((acc, exp) => {
        if (exp.id !== 'base') {
            (acc as Record<keyof Expansions, boolean>)[exp.id] = true; // Default all expansions to ON
        }
        return acc;
    }, {} as Expansions);

    const firstStory = STORY_CARDS.find(c => !c.isSolo && c.requiredExpansion !== 'community') || STORY_CARDS[0];

    return {
        gameEdition: 'tenth', // Default to tenth since expansions are on
        gameMode: 'multiplayer',
        playerCount: 4,
        playerNames: ['Captain 1', 'Captain 2', 'Captain 3', 'Captain 4'],
        setupCardId: SETUP_CARD_IDS.STANDARD,
        setupCardName: 'Standard Game Setup',
        secondarySetupId: undefined,
        selectedStoryCard: firstStory.title,
        selectedGoal: firstStory.goals?.[0]?.title,
        challengeOptions: {},
        timerConfig: {
            mode: 'standard',
            unpredictableSelectedIndices: [0, 2, 4, 5],
            randomizeUnpredictable: false,
        },
        soloOptions: {
            noSureThings: false,
            shesTrouble: false,
            recipeForUnpleasantness: false,
        },
        optionalRules: {
            disgruntledDie: 'standard',
            optionalShipUpgrades: false,
        },
        expansions: allExpansions,
        isCampaign: false,
        campaignStoriesCompleted: 0,
    };
};