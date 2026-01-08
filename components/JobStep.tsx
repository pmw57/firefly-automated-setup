import React, { useMemo } from 'react';
import { OverrideNotificationBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { useJobSetupDetails } from '../hooks/useJobSetupDetails';
import { getCampaignNotesForStep } from '../utils/selectors/story';
import { StepComponentProps } from './StepContent';
import { SpecialRule } from '../types';
import { cls } from '../utils/style';

const SharedHandInstructions: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
    const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
    const headerColor = isDark ? 'text-blue-300' : 'text-blue-800';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-700';

    return (
        <div className={cls(cardBg, "p-4 md:p-6 rounded-lg border", cardBorder, "shadow-sm transition-colors duration-300 overflow-hidden animate-fade-in-up")}>
            <h4 className={cls("font-bold text-lg mb-3 pb-2 border-b", headerColor, isDark ? 'border-zinc-800' : 'border-gray-100')}>
                Shared Hand of Inactive Jobs
            </h4>
            <p className={cls("text-sm mb-4", textColor)}>
                No Starting Jobs are dealt. Instead, a shared pool of jobs is available to all players from the start of the game.
            </p>
            <ul className={cls("list-disc list-inside space-y-2 text-sm", textColor)}>
                <li>One <strong>face-up Job Card</strong> is placed on top of each Contact's deck. These form the shared hand of <strong>Inactive Jobs</strong>.</li>
                <li>Players may take a face-up Job from this shared hand by using a <strong>Deal Action</strong> at the Contact's location.</li>
                <li>When a shared Job is taken, it is immediately replaced with the next card from that Contact's deck.</li>
            </ul>
        </div>
    );
};

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

export const JobStep = ({ step }: StepComponentProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const { overrides = {} } = step;
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const { 
    contacts, 
    messages, 
    showStandardContactList, 
    isSingleContactChoice,
    cardsToDraw = 0,
    caperDrawCount,
    isContactListOverridden,
    isSharedHandMode,
    isRuiningItForEveryone,
  } = useJobSetupDetails(overrides);

  const sortedInfoBlocks = useMemo(() => {
    const blocks: SpecialRule[] = [];

    const campaignNotes = getCampaignNotesForStep(gameState, step.id);
    blocks.push(...campaignNotes.map(note => ({
      source: 'story' as const,
      title: 'Campaign Setup Note',
      content: note.content
    })));

    // Filter out Caper Bonus as it's handled by a dedicated component.
    blocks.push(...messages.filter(msg => msg.title !== 'Caper Bonus'));
    
    const order: Record<SpecialRule['source'], number> = {
        expansion: 1, setupCard: 2, story: 3, warning: 3, info: 4,
    };

    return blocks.sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99));
  }, [messages, gameState, step.id]);
  
  const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const sectionHeaderColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const sectionHeaderBorder = isDark ? 'border-zinc-800' : 'border-gray-100';
  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const contactColor = isDark ? 'text-amber-400' : 'text-firefly-brown';

  // Determine the correct phrasing for keeping jobs.
  const actualDrawCount = isSingleContactChoice ? 1 : contacts.length;
  const keepText = cardsToDraw >= actualDrawCount && actualDrawCount > 0
    ? 'any of the Job Cards drawn.'
    : `up to ${cardsToDraw} Job Cards.`;

  return (
    <div className="space-y-6">
      {sortedInfoBlocks.map((block, i) => <OverrideNotificationBlock key={`info-${i}`} {...block} />)}

      {isRuiningItForEveryone ? (
        <RuiningItJobInstructions
            contacts={contacts}
            cardsToDraw={cardsToDraw}
            isSingleContactChoice={isSingleContactChoice}
        />
      ) : (
        <>
            {isSharedHandMode && <SharedHandInstructions />}

            {caperDrawCount && (
                <OverrideNotificationBlock 
                    source="story" 
                    title="Caper Bonus" 
                    content={[`Draw ${caperDrawCount} Caper Card${caperDrawCount > 1 ? 's' : ''}.`]} 
                />
            )}

            {showStandardContactList && (
                <div className={cls(cardBg, "rounded-lg border", cardBorder, "shadow-sm transition-colors duration-300 overflow-hidden")}>
                <div className="p-4 md:p-6">
                    <h4 className={cls("font-bold text-lg mb-3 pb-2 border-b", sectionHeaderColor, sectionHeaderBorder)}>Starting Job Draw</h4>
                    <p className={cls("text-sm mb-4", textColor)}>
                    {isSingleContactChoice
                        ? `Choose ONE contact deck below.`
                        : `Draw one Job Card from each Contact Deck listed below.`
                    }
                    {` You may keep ${keepText}`}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {contacts.map(contact => (
                        <div key={contact} className={cls("text-center font-western p-3 rounded border font-bold", isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200', contactColor)}>
                        {contact}
                        </div>
                    ))}
                    </div>

                    {isContactListOverridden && (
                    <p className={cls("text-xs mt-4 italic", isDark ? 'text-gray-500' : 'text-gray-600')}>
                        Note: The list of available contacts has been modified by the current setup.
                    </p>
                    )}
                </div>
                </div>
            )}
        </>
      )}
    </div>
  );
};