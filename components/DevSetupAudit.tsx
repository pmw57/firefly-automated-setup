import React, { useState } from 'react';
import { STORY_CARDS } from '../data/storyCards/index';
import { StoryCardDef } from '../types';

interface DevSetupAuditProps {
    onClose: () => void;
}

export const DevSetupAudit: React.FC<DevSetupAuditProps> = ({ onClose }) => {
  const [cardsWithSetupDescription, setCardsWithSetupDescription] = useState<{card: StoryCardDef, reason: string}[]>([]);
  const [cardsWithRules, setCardsWithRules] = useState<StoryCardDef[]>([]);

  const runAudit = () => {
    const needsConversion: {card: StoryCardDef, reason: string}[] = [];
    const converted: StoryCardDef[] = [];

    for (const card of STORY_CARDS) {
      const hasSetupDescription = !!card.setupDescription;
      
      const hasStoryOverrideRule = card.rules?.some(
        rule => rule.type === 'addSpecialRule' && rule.category === 'story_override'
      );

      const hasOtherRules = card.rules?.some(
        rule => !(rule.type === 'addSpecialRule' && rule.category === 'story_override')
      );

      if (hasSetupDescription && !hasStoryOverrideRule) {
        needsConversion.push({ card, reason: "Has setupDescription but no story_override rule" });
      } else if (hasStoryOverrideRule && !hasSetupDescription) {
        needsConversion.push({ card, reason: "Has story_override rule but no setupDescription" });
      } else if (hasStoryOverrideRule && !hasOtherRules) {
        needsConversion.push({ card, reason: "Has story_override rule but no other rules" });
      } else if (hasOtherRules && !hasStoryOverrideRule) {
        needsConversion.push({ card, reason: "Has rule updates but no story_override rule" });
      } else if (hasSetupDescription && hasStoryOverrideRule && hasOtherRules) {
        converted.push(card);
      }
    }

    setCardsWithSetupDescription(needsConversion);
    setCardsWithRules(converted);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col text-gray-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-blue-400">Audit Story Cards</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Checks all story cards for legacy `setupDescription` properties that should be converted to `rules`, and ensures that story overrides result in at least one setup page change.
          </p>
          <button
            onClick={runAudit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors"
          >
            Run Audit
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {cardsWithSetupDescription.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-2 border-b border-red-900/50 pb-1">
                Needs Conversion ({cardsWithSetupDescription.length})
              </h3>
              <ul className="space-y-2">
                {cardsWithSetupDescription.map(item => (
                  <li key={item.card.title} className="bg-red-900/20 border border-red-900/50 p-3 rounded text-sm">
                    <div className="font-bold text-red-300">{item.card.title}</div>
                    <div className="text-gray-400 mt-1">{item.reason}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cardsWithRules.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-2 border-b border-green-900/50 pb-1">
                Converted to Rules ({cardsWithRules.length})
              </h3>
              <ul className="space-y-2">
                {cardsWithRules.map(card => (
                  <li key={card.title} className="bg-green-900/20 border border-green-900/50 p-3 rounded text-sm">
                    <div className="font-bold text-green-300">{card.title}</div>
                    <div className="text-gray-400 mt-1">{card.rules?.length} rules defined</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
