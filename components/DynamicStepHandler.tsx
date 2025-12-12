
import React from 'react';
import { GameState, Step } from '../types';
import { STORY_CARDS } from '../constants';
import { calculateStartingResources } from '../utils';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { JobStep } from './JobStep';
import { DraftStep } from './DraftStep';
import { useTheme } from './ThemeContext';

interface DynamicStepHandlerProps {
  step: Step;
  gameState: GameState;
}

export const DynamicStepHandler: React.FC<DynamicStepHandlerProps> = ({ step, gameState }) => {
  const id = step.id;
  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (id.includes('D_RIM_JOBS')) {
    return <JobStep step={step} gameState={gameState} />;
  }
  
  if (id.includes('D_HAVEN_DRAFT')) {
    return <DraftStep step={step} gameState={gameState} />;
  }

  const warningText = isDark ? 'text-red-400' : 'text-red-700';
  const panelBg = isDark ? 'bg-slate-900/80' : 'bg-white';
  const panelBorder = isDark ? 'border-slate-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const numberColor = isDark ? 'text-green-400' : 'text-green-800';
  const subText = isDark ? 'text-gray-400' : 'text-gray-500';
  const dangerTitle = isDark ? 'text-red-300' : 'text-red-800';
  const dangerBorder = isDark ? 'border-red-800' : 'border-red-200';

  if (id.includes('D_TIME_LIMIT')) {
    return (
      <SpecialRuleBlock source="setupCard" title="Setup Card Override">
        <strong>Game Timer:</strong>
        <div className="space-y-3 mt-1">
          <p>Give a pile of <strong>20 Disgruntled Tokens</strong> to the player taking the first turn. These tokens will be used as Game Length Tokens.</p>
          <p>Each time that player takes a turn, discard one of the Disgruntled Tokens. When the final token is discarded, everyone gets one final turn, then the game is over.</p>
          <p className={`font-bold ${warningText}`}>If time runs out before the Story Card is completed, the player with the most credits wins.</p>
        </div>
      </SpecialRuleBlock>
    );
  }

  if (id.includes('D_SHUTTLE')) {
    return (
      <SpecialRuleBlock source="setupCard" title="Setup Card Override">
        <strong>Draft Shuttles from Supply:</strong>
        <ul className="list-decimal ml-5 space-y-2 mt-1">
          <li>Pull all <strong>Shuttles</strong> from the Supply Decks.</li>
          <li>Starting with the winner of the Ship Roll, each player takes <strong>1 Shuttle</strong> for free.</li>
          <li>Selection passes to the <strong>left</strong>.</li>
          <li>Place remaining Shuttles in their respective discard piles.</li>
        </ul>
      </SpecialRuleBlock>
    );
  }

  if (id.includes('D_BC_CAPITOL')) {
    const { totalCredits, bonusCredits } = calculateStartingResources(activeStoryCard, overrides);
    return (
      <div className={`text-center p-8 rounded-lg border shadow-sm transition-colors duration-300 ${panelBg} ${panelBorder}`}>
        <p className={`text-lg mb-2 ${textColor}`}>Each player receives:</p>
        <div className={`text-5xl font-bold font-western my-4 ${numberColor}`}>${totalCredits}</div>
        {bonusCredits > 0 && <p className={`text-sm ${subText}`}>(Includes ${bonusCredits} Story Bonus)</p>}
      </div>
    );
  }

  if (id.includes('D_LOCAL_HEROES')) {
    return (
      <SpecialRuleBlock source="setupCard" title="Setup Card Override">
        <strong>Local Heroes Bonuses:</strong>
        <ul className="list-disc ml-5 space-y-2 mt-1">
          <li><strong>Shore Leave:</strong> At your Haven, you may use a Buy Action to take Shore Leave for free. Remove all Disgruntled and Wanted tokens.</li>
          <li><strong>Home Field Advantage:</strong> When you proceed with Misbehaving in the same System as your Haven, take <strong>$100</strong>.</li>
        </ul>
      </SpecialRuleBlock>
    );
  }

  if (id.includes('D_ALLIANCE_ALERT')) {
    return (
      <SpecialRuleBlock source="setupCard" title="Setup Card Override">
        <strong>Alliance Alert Cards:</strong>
        <div className="space-y-3 mt-1">
          <p>Begin the game with <strong>one random Alliance Alert Card</strong> in play.</p>
          <p className="text-sm italic">Each Alert has a rule that affects all players. When a Misbehave Card directs you to draw a new Alert Card, place the current Alert at the bottom of the Alert Deck.</p>
        </div>
      </SpecialRuleBlock>
    );
  }

  if (id.includes('D_PRESSURES_HIGH')) {
    return (
      <SpecialRuleBlock source="setupCard" title="Setup Card Override">
        <strong>The Pressure's High:</strong>
        <div className="space-y-4 mt-1">
          <div>
            <strong className={`block mb-1 ${dangerTitle}`}>Alliance Alert</strong>
            <p>Begin the game with one random Alliance Alert Card in play.</p>
          </div>
          <div className={`border-t pt-3 ${dangerBorder}`}>
            <strong className={`block mb-1 ${dangerTitle}`}>Wanted Accumulation</strong>
            <ul className="list-disc ml-5 text-sm">
              <li>Wanted Crew and Leaders may accumulate Wanted tokens.</li>
              <li><strong>Roll Check:</strong> When making Alliance Wanted Crew rolls, you must roll higher than the number of current Wanted tokens for that Crew/Leader to avoid effects.</li>
            </ul>
          </div>
        </div>
      </SpecialRuleBlock>
    );
  }

  if (id.includes('D_STRIP_MINING')) {
    return (
      <SpecialRuleBlock source="setupCard" title="Setup Card Override">
        <strong>The Dinosaur Draft:</strong>
        <ol className="list-decimal ml-5 space-y-2 text-sm mt-1">
          <li>Choose 1 Supply Deck to be "Strip Mined".</li>
          <li>The winner of the Ship Roll claims the <strong>Dinosaur</strong>.</li>
          <li>Reveal <strong>{gameState.playerCount} cards</strong> from the top of the chosen deck.</li>
          <li>Starting at the Dinosaur and going left, draft one card for free.</li>
          <li>Pass the Dinosaur to the left. Repeat until all players have been the Dinosaur once.</li>
        </ol>
      </SpecialRuleBlock>
    );
  }

  return <div className="p-4 text-red-500">Content for {id} not found.</div>;
};
