import React from 'react';
import { GameState, Step } from '../types';
import { SpecialRuleBlock } from './SpecialRuleBlock';

interface NavDeckStepProps {
  step: Step;
  gameState: GameState;
}

export const NavDeckStep: React.FC<NavDeckStepProps> = ({ step, gameState }) => {
  const overrides = step.overrides || {};
  const isRimMode = overrides.rimNavMode;
  const isBrowncoatNav = overrides.browncoatNavMode;
  const isForceReshuffle = overrides.forceReshuffle;
  const isClearerSkies = overrides.clearerSkiesNavMode;
  const isHighPlayerCount = gameState.playerCount >= 3;

  // Group "Rim Mode" and "Force Reshuffle" as scenarios that mandate Reshuffle cards at the start
  const hasForcedReshuffle = isRimMode || isForceReshuffle;

  const renderAction = (text: string) => <span className="font-bold border-b border-gray-400 border-dotted">{text}</span>;

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6 overflow-hidden">
        {isBrowncoatNav ? (
          <SpecialRuleBlock source="scenario" title="Hardcore Navigation">
            Shuffle the {renderAction("Alliance Cruiser")} and {renderAction("Reaver Cutter")} cards into the Nav Decks immediately, regardless of player count.
          </SpecialRuleBlock>
        ) : hasForcedReshuffle ? (
          <SpecialRuleBlock source="scenario" title="Hostile Universe">
            <ul className="list-disc ml-4 space-y-1">
              <li>Place the {renderAction("\"RESHUFFLE\"")} cards in the Nav Decks at the start of the game, regardless of player count.</li>
              <li>{renderAction("Shuffle each of the Alliance and Border Nav Decks")}.</li>
              {(gameState.expansions.blue || gameState.expansions.kalidasa) && (
                <li className="italic opacity-80">Applies to all active decks (including Rim Space).</li>
              )}
            </ul>
          </SpecialRuleBlock>
        ) : (
          <p className="mb-4 text-gray-700">{renderAction("Shuffle Alliance & Border Nav Cards")} standard setup.</p>
        )}

        {isClearerSkies && (
          <SpecialRuleBlock source="scenario" title="Clearer Skies Rule">
            <strong>Full Burn:</strong> When initiating a Full Burn, roll a die. The result is how many sectors you may move before you start drawing Nav Cards.
            <br /><span className="text-xs italic opacity-75">Note: You may not move farther than your Drive Core's range, regardless of the die roll.</span>
          </SpecialRuleBlock>
        )}
      </div>

      {/* Standard Reshuffle Panel */}
      {!hasForcedReshuffle && !isBrowncoatNav && (
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
            Reshuffle Card Rules (Player Count: {gameState.playerCount})
          </div>
          <div className={`p-4 border-l-4 transition-all duration-300 ${!isHighPlayerCount ? 'bg-green-50 border-green-600' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'}`}>
            <div className="flex justify-between items-center mb-1">
              <div className={`font-bold ${!isHighPlayerCount ? 'text-green-900' : 'text-gray-500'}`}>1-2 Players</div>
              {!isHighPlayerCount && <span className="text-[10px] font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded uppercase tracking-wide">Active</span>}
            </div>
            <div className={`text-sm ${!isHighPlayerCount ? 'text-green-800' : 'text-gray-500'}`}>Shuffle the "RESHUFFLE" cards into the deck.</div>
          </div>
          <div className={`p-4 border-l-4 border-t border-t-gray-200 transition-all duration-300 ${isHighPlayerCount ? 'bg-green-50 border-green-600' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'}`}>
            <div className="flex justify-between items-center mb-1">
              <div className={`font-bold ${isHighPlayerCount ? 'text-green-900' : 'text-gray-500'}`}>3+ Players</div>
              {isHighPlayerCount && <span className="text-[10px] font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded uppercase tracking-wide">Active</span>}
            </div>
            <div className={`text-sm ${isHighPlayerCount ? 'text-green-800' : 'text-gray-500'}`}>Place the "RESHUFFLE" card in the Discard Pile of <em>each</em> Nav Deck.</div>
          </div>
        </div>
      )}
    </>
  );
};