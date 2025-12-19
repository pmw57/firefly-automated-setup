import React from 'react';
import { GameState, Step, DraftRuleDetails, SpecialRule } from '../types';
import { STEP_IDS, CHALLENGE_IDS, STORY_TITLES } from '../data/ids';
import { hasFlag } from './data';
import { STORY_CARDS } from '../data/storyCards';

export const calculateDraftDetails = (gameState: GameState, step: Step): DraftRuleDetails => {
    const specialRules: SpecialRule[] = [];
    const { overrides = {} } = step;
    const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];

    const isHavenDraft = step.id.includes(STEP_IDS.D_HAVEN_DRAFT);
    const isHeroesCustomSetup = !!gameState.challengeOptions[CHALLENGE_IDS.HEROES_CUSTOM_SETUP];
    const isHeroesAndMisfits = activeStoryCard.title === STORY_TITLES.HEROES_AND_MISFITS;
    const isRacingAPaleHorse = activeStoryCard.title === STORY_TITLES.RACING_A_PALE_HORSE;
    const isPersephoneStart = activeStoryCard.setupConfig?.shipPlacementMode === 'persephone' && !isHeroesCustomSetup;
    const isLondiniumStart = hasFlag(activeStoryCard.setupConfig, 'startAtLondinium');
    const startOutsideAllianceSpace = hasFlag(activeStoryCard.setupConfig, 'startOutsideAllianceSpace');
    const startAtSector = activeStoryCard.setupConfig?.startAtSector;
    const allianceSpaceOffLimits = hasFlag(activeStoryCard.setupConfig, 'allianceSpaceOffLimits');
    const addBorderHavens = hasFlag(activeStoryCard.setupConfig, 'addBorderSpaceHavens');
    const isBrowncoatDraft = overrides.draftMode === 'browncoat';
    const isWantedLeaderMode = overrides.leaderSetup === 'wanted';
    const showBrowncoatHeroesWarning = isBrowncoatDraft && isHeroesAndMisfits && gameState.finalStartingCredits != null && gameState.finalStartingCredits < 4800;
    
    let specialStartSector: string | null = null;
    if (startAtSector) specialStartSector = startAtSector;
    else if (isPersephoneStart) specialStartSector = 'Persephone';
    else if (isLondiniumStart) specialStartSector = 'Londinium';

    let resolvedHavenDraft = isHavenDraft;
    let conflictMessage: React.ReactNode = null;
  
    if (isHavenDraft && specialStartSector) {
        if (gameState.optionalRules.resolveConflictsManually) {
            conflictMessage = "Conflict: Haven placement vs. Fixed start. Manual selection needed."; // Manual conflict not yet implemented
        } else {
            resolvedHavenDraft = false;
            conflictMessage = React.createElement(React.Fragment, null, React.createElement('strong', null, 'Story Priority:'), ` Ships start at `, React.createElement('strong', null, specialStartSector), `, overriding Haven placement rules.`);
        }
    }
    
    // Build Special Rules array
    if (conflictMessage) {
        // FIX: `conflictMessage` is a ReactNode, not a function. Removed incorrect function call `()`.
        specialRules.push({ source: 'info', title: 'Conflict Resolved', content: conflictMessage });
    }
    if (isWantedLeaderMode) {
        // FIX: The comma-separated values for `content` are invalid. Wrapped them in a React.Fragment.
        specialRules.push({ source: 'setupCard', title: 'The Heat Is On', content: React.createElement(React.Fragment, null, `Choose Ships & Leaders normally, but `, React.createElement('strong', null, `each Leader begins play with a Wanted token`), `.`) });
    }
    if (showBrowncoatHeroesWarning) {
        specialRules.push({
            source: 'warning',
            title: 'Story & Setup Card Interaction',
            content: React.createElement(React.Fragment, null, 
                React.createElement('p', { className: 'mb-2' }, `The `, React.createElement('strong', null, `"${activeStoryCard.title}"`), ` story provides a specific starting Ship & Crew, which overrides the standard "buy" phase of `, React.createElement('strong', null, `"The Browncoat Way"`), `.`),
                React.createElement('div', { className: `text-sm p-3 rounded border bg-red-950/40 border-red-900/50` },
                    React.createElement('p', { className: 'mb-2' }, `Your starting Capitol is reduced by the cost of your assigned ship (e.g., Serenity costs $4,800), but not below $0.`),
                    React.createElement('p', { className: 'font-bold' }, `This will likely leave you with $0, unable to purchase Fuel or Parts during the Browncoat Market phase.`)
                )
            )
        });
    }
    if (isHeroesCustomSetup) {
        specialRules.push({ source: 'warning', title: 'Heroes & Misfits: Further Adventures', content: React.createElement(React.Fragment, null, React.createElement('strong', null, `Custom Setup Active:`), ` Ignore standard crew/ship/location requirements.`, React.createElement('br'), `Pick your Leader, Ship, and Supply Planet. Start with $2000 and a full compliment of your favourite crew.`) });
    }
    if (gameState.optionalRules.optionalShipUpgrades) {
        specialRules.push({
            source: 'expansion', title: 'Optional Ship Upgrades', content: React.createElement(React.Fragment, null, 
                React.createElement('p', { className: 'mb-2' }, `The following ships have `, React.createElement('strong', null, `Optional Ship Upgrade`), ` cards available. If you choose one of these ships, take its corresponding upgrade card.`),
                React.createElement('ul', { className: "list-disc ml-5 grid grid-cols-2 gap-x-4 text-sm font-medium mb-3" },
                    ['Bonanza', 'Bonnie Mae', 'Interceptor', 'Serenity', 'Walden', 'Yun Qi'].map(ship => React.createElement('li', { key: ship }, React.createElement('strong', null, ship)))
                ),
                React.createElement('div', { className: 'text-xs p-2 rounded border bg-amber-900/30 border-amber-800 text-amber-200' }, React.createElement('strong', null, `Walden & Interceptor:`), ` These upgrades are double-sided. Choose your side during setup—you cannot switch later.`)
            )
        });
    }
    if (isRacingAPaleHorse) {
        specialRules.push({ source: 'story', title: 'Story Setup: Haven', content: React.createElement(React.Fragment, null, React.createElement('strong', null, `Place your Haven at Deadwood (Blue Sun).`), React.createElement('br'), `If you end your turn at your Haven, remove Disgruntled from all Crew.`) });
    }
    if (addBorderHavens) {
        specialRules.push({ source: 'story', title: activeStoryCard.title, content: React.createElement(React.Fragment, null, React.createElement('strong', null, `Choose Havens:`), ` Each player chooses a Haven token. Havens `, React.createElement('strong', null, `must be in Border Space`), `.`) });
    }
    if (startOutsideAllianceSpace) {
        // FIX: The comma-separated values for `content` are invalid. Wrapped them in a React.Fragment.
        specialRules.push({ source: 'warning', title: 'Placement Restriction', content: React.createElement(React.Fragment, null, `Players' starting locations `, React.createElement('strong', null, `may not be within Alliance Space`), `.`) });
    }
    if (allianceSpaceOffLimits) {
        specialRules.push({ source: 'warning', title: 'Restricted Airspace', content: React.createElement(React.Fragment, null, React.createElement('strong', null, `Alliance Space is Off Limits`), ` until Goal 3.`) });
    }
    if (isBrowncoatDraft) {
        specialRules.push({ source: 'setupCard', title: 'Browncoat Market', content: React.createElement(React.Fragment, null, React.createElement('strong', null, `Market Phase:`), ` Once all players have purchased a ship and chosen a leader, everyone may buy fuel ($100) and parts ($300).`, React.createElement('br'), React.createElement('span', { className: "text-xs italic opacity-75" }, `Reminder: Free starting fuel/parts are disabled in this mode.`)) });
    }
    if (resolvedHavenDraft) {
        specialRules.push({ source: 'setupCard', title: 'Home Sweet Haven: Placement Rules', content: React.createElement('ul', { className: "list-disc ml-5 mt-1 space-y-1 text-sm" },
            React.createElement('li', null, `Each Haven must be placed in an unoccupied `, React.createElement('strong', null, `Planetary Sector adjacent to a Supply Planet`), `.`),
            React.createElement('li', null, `Havens may not be placed in a Sector with a `, React.createElement('strong', null, `Contact`), `.`),
            React.createElement('li', null, `Remaining players place their Havens in `, React.createElement('strong', null, `reverse order`), `.`),
            React.createElement('li', null, React.createElement('strong', null, `Players' ships start at their Havens.`)),
        ) });
    }

    return {
        specialRules,
        isHavenDraft: resolvedHavenDraft,
        isBrowncoatDraft,
        specialStartSector,
        conflictMessage
    };
};