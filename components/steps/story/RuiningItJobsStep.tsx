
import React from 'react';
import { useTheme } from '../../ThemeContext';
import { useGameState } from '../../../hooks/useGameState';
import { useJobSetupDetails } from '../../../hooks/useJobSetupDetails';
import { StepComponentProps } from '../../StepContent';
import { cls } from '../../../utils/style';

// This component was moved from JobStep.tsx
const RuiningItJobInstructions: React.FC<{
  contacts: string[];
  cardsToDraw: number;
  isSingleContactChoice: boolean;
}> = ({ contacts, cardsToDraw, isSingleContactChoice }) => {
    const { state: gameState } = useGameState();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
    const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
    const headerColor = isDark ? 'text-amber-300' : 'text-amber-800';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const strongColor = isDark ? 'text-amber-400' : 'text-amber-700';
    const subTextColor = isDark ? 'text-gray-400' : 'text-gray-500';

    const player1Name = gameState.playerNames[0] || 'Player 1';
    const player2Name = gameState.playerNames[1] || 'Player 2';

    const drawInstruction = isSingleContactChoice
      ? `Choose ONE contact deck below.`
      : `Draw one Job Card from each Contact Deck listed below.`;
    const keepText = cardsToDraw >= contacts.length && contacts.length > 0
      ? 'any of the Job Cards drawn.'
      : `up to ${cardsToDraw} Job Cards.`;

    return (
        <div className={cls(cardBg, "p-4 md:p-6 rounded-lg border", cardBorder, "shadow-sm transition-colors duration-300 overflow-hidden animate-fade-in-up")}>
            <h4 className={cls("font-bold text-lg mb-3 pb-2 border-b", headerColor, isDark ? 'border-zinc-800' : 'border-gray-100')}>
                Starting Jobs: The Twin's Advantage
            </h4>
            <ol className={cls("list-decimal list-inside space-y-4 text-sm", textColor)}>
                <li>
                    <strong className={strongColor}>{player1Name} (The Twin): Draws Starting Jobs</strong>
                    <div className={cls("pl-4 mt-1 space-y-2 text-xs", subTextColor)}>
                        <p>As part of stealing the ship, the twin also gets the starting jobs. Follow the standard draw rules for this setup:</p>
                        <p className="font-semibold">{drawInstruction} You may keep {keepText}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                          {contacts.map(contact => (
                            <div key={contact} className={cls("text-center font-western p-2 rounded border font-bold", isDark ? 'bg-zinc-800 border-zinc-700 text-amber-400' : 'bg-gray-50 border-gray-200 text-firefly-brown')}>
                              {contact}
                            </div>
                          ))}
                        </div>
                    </div>
                </li>
                 <li>
                    <strong className={strongColor}>{player2Name} (You): No Starting Jobs</strong>
                     <p className={cls("pl-4 mt-1 text-xs", subTextColor)}>
                        You start with no jobs and must find work in the 'Verse.
                    </p>
                </li>
            </ol>
        </div>
    );
};


export const RuiningItJobsStep = ({ step }: StepComponentProps): React.ReactElement => {
    const { overrides = {} } = step;
    
    // Explicitly force standard mode here to get the contact list data, even though
    // the global state might be 'no_jobs' due to the story card.
    const effectiveOverrides = { ...overrides, jobMode: 'standard' } as const;

    const { 
        contactList
    } = useJobSetupDetails(effectiveOverrides);

    const contacts = contactList?.contacts || [];
    const isSingleContactChoice = contactList?.isSingleContactChoice || false;
    const cardsToDraw = contactList?.cardsToDraw || 0;

    return (
        <div className="space-y-6">
            <RuiningItJobInstructions
                contacts={contacts}
                cardsToDraw={cardsToDraw}
                isSingleContactChoice={isSingleContactChoice}
            />
        </div>
    );
};
