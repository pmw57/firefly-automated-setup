import React from 'react';
import { GameState, AllianceReaverDetails, StoryCardDef, AllianceSetupMode, SpecialRule } from '../types';
import { hasFlag } from './data';

const ActionText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    React.createElement('span', { className: "font-bold border-b border-dotted border-zinc-500 dark:border-gray-400" }, children)
);

export const calculateAllianceReaverDetails = (
    gameState: GameState, 
    activeStoryCard: StoryCardDef | undefined,
    allianceMode: AllianceSetupMode | undefined
): AllianceReaverDetails => {
  
  const storyConfig = activeStoryCard?.setupConfig;
  const specialRules: SpecialRule[] = [];

  // --- Process Setup Card Overrides (allianceMode) ---
  switch (allianceMode) {
    case 'no_alerts':
      specialRules.push({
        source: 'setupCard',
        title: 'Setup Card Override',
        // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
        content: React.createElement('strong', null, 'Safe Skies:')
      });
      break;
    case 'awful_crowded':
      specialRules.push({
        source: 'setupCard',
        title: 'Setup Card Override',
        // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
        content: React.createElement(React.Fragment, null,
          React.createElement('strong', null, 'Awful Crowded:'),
          React.createElement('ul', { className: "list-disc ml-4 space-y-1 mt-1" },
            React.createElement('li', null, 'Place an ', React.createElement(ActionText, null, 'Alert Token'), ' in ', React.createElement('strong', null, 'every planetary sector'), '.'),
            React.createElement('li', null, React.createElement('strong', null, 'Alliance Space:'), ' Place Alliance Alert Tokens.'),
            React.createElement('li', null, React.createElement('strong', null, 'Border & Rim Space:'), ' Place Reaver Alert Tokens.'),
            React.createElement('li', { className: "text-red-700 dark:text-red-400 italic font-bold" }, "Do not place Alert Tokens on players' starting locations."),
            React.createElement('li', null, React.createElement('strong', null, 'Alliance Ship movement'), ' does not generate new Alert Tokens.'),
            React.createElement('li', null, React.createElement('strong', null, 'Reaver Ship movement'), ' generates new Alert Tokens.')
          )
        )
      });
      break;
  }
  
  // --- Process Story Card Flags ---
  if (hasFlag(storyConfig, 'placeAllianceAlertsInAllianceSpace')) {
    specialRules.push({
      source: 'story',
      title: 'Story Override',
      // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
      content: React.createElement(React.Fragment, null, 'Place an ', React.createElement(ActionText, null, 'Alliance Alert Token'), ' on ', React.createElement('strong', null, 'every planetary sector in Alliance Space'), '.')
    });
  }
  
  if (hasFlag(storyConfig, 'placeMixedAlertTokens')) {
    specialRules.push({
      source: 'story',
      title: 'Story Override',
      // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
      content: React.createElement(React.Fragment, null,
        'Place ', React.createElement('strong', null, '3 Alliance Alert Tokens'), " in the 'Verse:",
        React.createElement('ul', { className: "list-disc ml-4 mt-1" },
          React.createElement('li', null, '1 in ', React.createElement('strong', null, 'Alliance Space')),
          React.createElement('li', null, '1 in ', React.createElement('strong', null, 'Border Space')),
          React.createElement('li', null, '1 in ', React.createElement('strong', null, 'Rim Space'))
        )
      )
    });
  }

  if (storyConfig?.createAlertTokenStackMultiplier) {
    const alertStackCount = storyConfig.createAlertTokenStackMultiplier * gameState.playerCount;
    specialRules.push({
      source: 'story',
      title: 'Story Override',
      // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
      content: React.createElement(React.Fragment, null, 'Create a stack of ', React.createElement('strong', null, `${alertStackCount} Alliance Alert Tokens`), ` (${storyConfig.createAlertTokenStackMultiplier} per player).`)
    });
  }

  const smugglersBluesSetup = hasFlag(storyConfig, 'smugglersBluesSetup');
  if (smugglersBluesSetup) {
    const useSmugglersRimRule = smugglersBluesSetup && gameState.expansions.blue && gameState.expansions.kalidasa;
    specialRules.push({
      source: 'story',
      title: 'Story Override',
      // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
      content: useSmugglersRimRule 
        ? React.createElement(React.Fragment, null, 'Place ', React.createElement('strong', null, '2 Contraband'), ' on each Planetary Sector in ', React.createElement('strong', null, 'Rim Space'), '.')
        : React.createElement(React.Fragment, null, 'Place ', React.createElement('strong', null, '3 Contraband'), ' on each Planetary Sector in ', React.createElement('strong', null, 'Alliance Space'), '.')
    });
  }
  
  if (hasFlag(storyConfig, 'lonelySmugglerSetup')) {
    specialRules.push({
      source: 'story',
      title: 'Story Override',
      // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
      content: React.createElement(React.Fragment, null, 'Place ', React.createElement('strong', null, '3 Contraband'), ' on each Supply Planet ', React.createElement('strong', null, 'except Persephone and Space Bazaar'), '.')
    });
  }

  if (hasFlag(storyConfig, 'startWithAlertCard')) {
    specialRules.push({
      source: 'story',
      title: 'Story Override',
      // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
      content: React.createElement(React.Fragment, null, 'Begin the game with one random Alliance Alert Card in play.')
    });
  }

  // --- Determine Ship Placement Strings ---
  const alliancePlacement = allianceMode === 'extra_cruisers'
    ? "Place a Cruiser at Regulus AND Persephone."
    : "Place the Cruiser at Londinium.";
    
  const reaverPlacement = gameState.expansions.blue
    ? "Place 3 Cutters in the border sectors closest to Miranda."
    : "Place 1 Cutter at the Firefly logo (Regina/Osiris).";

  return {
      specialRules,
      alliancePlacement,
      reaverPlacement
  };
};
