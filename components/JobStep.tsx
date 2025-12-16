


import React, { useState, useMemo } from 'react';
import { Step } from '../types';
import { STORY_CARDS } from '../data/storyCards';
import { determineJobMode } from '../utils';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { InlineExpansionIcon } from './InlineExpansionIcon';
import { useTheme } from './ThemeContext';
import { Button } from './Button';
import { useGameState } from '../hooks/useGameState';
import { STEP_IDS, CHALLENGE_IDS, STORY_TITLES, CONTACT_NAMES } from '../constants';

interface JobStepProps {
  step: Step;
}

const threeGoalStories = [
  "Bank Job",
  "Black Market Beagles",
  "Double Duty",
  "First Time in the Captain's Chair",
  "Fruity Oat Bar",
  "Goin' Reaver",
  "Harken's Folly",
  "Hospital Rescue",
  "How It All Started",
  "Jail Break",
  "Miranda",
  "Niska's Holiday",
  "Old Friends And New",
  "Patience's War",
  "Reap The Whirlwind",
  "Red Skies Over Ransom",
  "Running On Empty",
  "Shadows Over Duul",
  "The King Of All Londinium",
  "The Magnificent Crew",
  "The Old Man And The Dragons",
  "The Rumrunner's Seasonal",
  "The Smuggly Bustle",
  "The Wobbly Headed Doll Caper"
].sort();

export const JobStep: React.FC<JobStepProps> = ({ step }) => {
  const { gameState } = useGameState();
  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];
  const stepId = step.data?.id || step.id;
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { isCampaign } = gameState;

  const jobMode = determineJobMode(activeStoryCard, overrides);
  const { forbiddenStartingContact, allowedStartingContacts, smugglersBluesSetup, lonelySmugglerSetup, removeJobDecks, sharedHandSetup, primeContactDecks } = activeStoryCard.setupConfig || {};

  const activeChallenges = useMemo(() => 
    activeStoryCard.challengeOptions?.filter(
      opt => gameState.challengeOptions[opt.id]
    ) || [], 
  [activeStoryCard.challengeOptions, gameState.challengeOptions]);
  
  const isSingleContactChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.SINGLE_CONTACT];
  const isDontPrimeChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.DONT_PRIME_CONTACTS];
  const isHeroesAndMisfits = activeStoryCard.title === STORY_TITLES.HEROES_AND_MISFITS;
  const [showGoalList, setShowGoalList] = useState(false);

  const cardBg = isDark ? 'bg-black/60' : 'bg-white';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const pillBg = isDark ? 'bg-zinc-800' : 'bg-gray-100';
  const pillText = isDark ? 'text-gray-300' : 'text-gray-900';
  const pillBorder = isDark ? 'border-zinc-700' : 'border-gray-300';
  const dividerBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const noteText = isDark ? 'text-gray-400' : 'text-gray-700';

  return (
      <div className="space-y-4">
          {isCampaign && (
            <SpecialRuleBlock source="story" title="Campaign Rules: Jobs & Contacts">
              <p>For each Contact you were Solid with at the end of the last game, remove 2 of your completed Jobs from play.</p>
              <p className="mt-2">Keep any remaining completed Jobs; you begin the game <strong>Solid with those Contacts</strong>.</p>
            </SpecialRuleBlock>
          )}

          {stepId.includes(STEP_IDS.D_RIM_JOBS) ? (
             <SpecialRuleBlock source="setupCard" title="Setup Card Override">
               <p className="leading-relaxed mb-2">
                 Separate the Job Cards from the <InlineExpansionIcon type="blue" /> and <InlineExpansionIcon type="kalidasa" /> expansions (marked with their icons).
               </p>
               <p className="leading-relaxed">
                 <strong>Rebuild the Contact Decks</strong> using <em>only</em> these expansion cards. 
                 The standard Contact Decks (Harken, Badger, etc.) are still in play, but they will be significantly thinner as the Core Game cards are removed.
               </p>
             </SpecialRuleBlock>
          ) : (
             <>
                {sharedHandSetup && (
                    <SpecialRuleBlock source="story" title="Story Override">
                         <p>
                             Place <strong>one Job from each Contact</strong> face up on top of its deck. 
                             These face up Jobs form a shared hand of Inactive Jobs that everyone may use.
                         </p>
                    </SpecialRuleBlock>
                )}

                {isHeroesAndMisfits && (
                   <SpecialRuleBlock source="story" title="Adventure Deck Setup">
                       <p className="mb-2">Shuffle all <strong>3-Goal Story Cards</strong> into a single deck.</p>
                       <Button onClick={() => setShowGoalList(!showGoalList)} className="text-xs py-1 px-3 mb-2 bg-amber-600 hover:bg-amber-700">
                         {showGoalList ? "Hide" : "Show"} Qualifying Stories
                       </Button>
                       {showGoalList && (
                          <div className={`mt-2 p-3 rounded border text-sm max-h-60 overflow-y-auto custom-scrollbar ${isDark ? 'bg-black/30 border-amber-800' : 'bg-white/50 border-amber-200'}`}>
                             <p className="mb-2 font-bold opacity-80">Qualifying 3-Goal Story Cards:</p>
                             <ul className="list-disc ml-5 space-y-1">
                                {threeGoalStories.map(s => <li key={s}>{s}</li>)}
                             </ul>
                          </div>
                       )}
                   </SpecialRuleBlock>
                )}

                {(() => {
                    // 1. Story Card Modes (Highest Priority)
                    if (removeJobDecks) {
                        return (
                            <SpecialRuleBlock source="story" title="Setup Restriction">
                                <p><strong>Remove all Job Card decks from the game.</strong></p>
                                <p>There's no time for working other Jobs.</p>
                            </SpecialRuleBlock>
                        );
                    }

                    if (jobMode === 'caper_start') {
                        return (
                            <SpecialRuleBlock source="story" title="Story Override">
                                <p><strong>Do not deal Starting Jobs.</strong></p>
                                <p>Each player begins the game with <strong>one Caper Card</strong> instead.</p>
                            </SpecialRuleBlock>
                        );
                    }

                    // Special Handling for 'no_jobs' to distinguish source
                    if (jobMode === 'no_jobs') {
                        if (primeContactDecks && !isDontPrimeChallenge) {
                            return (
                                <SpecialRuleBlock source="story" title="Story Override">
                                    <p><strong>No Starting Jobs are dealt.</strong></p>
                                    <p className="mt-2">Instead, <strong>prime the Contact Decks</strong>:</p>
                                    <ul className="list-disc ml-5 mt-1 text-sm">
                                        <li>Reveal the top <strong>3 cards</strong> of each Contact Deck.</li>
                                        <li>Place the revealed Job Cards in their discard piles.</li>
                                    </ul>
                                </SpecialRuleBlock>
                            );
                        }
                        
                        if (isDontPrimeChallenge) {
                            return (
                                <SpecialRuleBlock source="warning" title="Challenge Active">
                                    <p><strong>No Starting Jobs.</strong></p>
                                    <p className="mt-1"><strong>Do not prime the Contact Decks.</strong> (Challenge Override)</p>
                                </SpecialRuleBlock>
                            );
                        }

                        if (overrides.browncoatJobMode) {
                            return (
                                <SpecialRuleBlock source="setupCard" title="Setup Card Override">
                                    <p><strong>No Starting Jobs.</strong></p>
                                    <p>Crews must find work on their own out in the black.</p>
                                </SpecialRuleBlock>
                            );
                        }
                        return (
                            <SpecialRuleBlock source="story" title="Story Override">
                                <p><strong>Do not take Starting Jobs.</strong></p>
                            </SpecialRuleBlock>
                        );
                    }

                    if (jobMode === 'wind_takes_us') {
                        return (
                            <SpecialRuleBlock source="story" title="Story Override">
                                <p className="mb-2">Each player chooses <strong>one Contact Deck</strong> of their choice:</p>
                                <ul className="list-disc ml-5 mb-3 text-sm">
                                    <li>Draw <strong>{gameState.playerCount <= 3 ? '4' : '3'} Jobs</strong> from that deck.</li>
                                    <li>Place a <strong>Goal Token</strong> at the drop-off/destination sector of each Job.</li>
                                    <li>Return all Jobs to the deck and reshuffle.</li>
                                </ul>
                                <p className="font-bold text-red-700">Do not deal Starting Jobs.</p>
                            </SpecialRuleBlock>
                        );
                    }
                    
                    if (jobMode === 'draft_choice') {
                        if (isSingleContactChallenge) {
                            return (
                                <SpecialRuleBlock source="story" title="Story Override (Challenge Active)">
                                    <p className="mb-2">In reverse player order, each player chooses <strong>1 Contact Deck</strong> (instead of 3).</p>
                                    <p className="mb-2">Draw the top <strong>3 Job Cards</strong> from that deck.</p>
                                    {forbiddenStartingContact === CONTACT_NAMES.NISKA && <p className="text-red-600 text-sm font-bold">Note: Mr. Universe is excluded.</p>}
                                    <p className="opacity-75 mt-2">Players may discard any starting jobs they do not want.</p>
                                </SpecialRuleBlock>
                            );
                        }
                        return (
                            <SpecialRuleBlock source="story" title="Story Override">
                                <p className="mb-2">In reverse player order, each player chooses <strong>3 different Contact Decks</strong>.</p>
                                <p className="mb-2">Draw the top Job Card from each chosen deck.</p>
                                {forbiddenStartingContact === CONTACT_NAMES.NISKA && <p className="text-red-600 text-sm font-bold">Note: Mr. Universe is excluded.</p>}
                                <p className="opacity-75 mt-2">Players may discard any starting jobs they do not want.</p>
                            </SpecialRuleBlock>
                        );
                    }
                    
                    // 2. Setup Card Overrides
                    if (jobMode === 'times_jobs') {
                        return (
                            <SpecialRuleBlock source="setupCard" title="Setup Card Override">
                                <p>Each player draws <strong>3 jobs</strong> from <strong>one Contact Deck</strong> of their choice.</p>
                                <p className="text-sm italic opacity-80 mt-1">Players may draw from the same Contact.</p>
                                <p className="opacity-75 mt-2">Players may discard any starting jobs they do not want.</p>
                            </SpecialRuleBlock>
                        );
                    }

                    // Contact List Logic for Standard / Specific Lists
                    let contacts: string[] = [];
                    if (jobMode === 'buttons_jobs') {
                        contacts = ['Amnon Duul', 'Lord Harrow', 'Magistrate Higgins'];
                    } else if (jobMode === 'awful_jobs') {
                        contacts = [CONTACT_NAMES.HARKEN, 'Amnon Duul', 'Patience'];
                    } else {
                        contacts = [CONTACT_NAMES.HARKEN, 'Badger', 'Amnon Duul', 'Patience', CONTACT_NAMES.NISKA];
                    }

                    // High Alert Logic: Remove Harken from standard list
                    if (jobMode === 'high_alert_jobs') {
                        contacts = contacts.filter(c => c !== CONTACT_NAMES.HARKEN);
                    }

                    // Apply Filters (Forbidden / Allowed)
                    if (forbiddenStartingContact) {
                        contacts = contacts.filter(c => c !== forbiddenStartingContact);
                    }
                    if (allowedStartingContacts && allowedStartingContacts.length > 0) {
                        contacts = contacts.filter(c => allowedStartingContacts.includes(c));
                    }

                    const totalJobCards = contacts.length;
                    const showStoryOverride = (forbiddenStartingContact || (allowedStartingContacts && allowedStartingContacts.length > 0));

                    return (
                        <div className={`${cardBg} p-6 rounded-lg border ${cardBorder} shadow-sm transition-colors duration-300`}>
                            {showStoryOverride && activeStoryCard.setupDescription && (
                                <SpecialRuleBlock source="story" title="Story Override">
                                    {activeStoryCard.setupDescription}
                                </SpecialRuleBlock>
                            )}
                            {jobMode === 'high_alert_jobs' && (
                                <SpecialRuleBlock source="setupCard" title="Setup Card Override">
                                    <strong>Harken is unavailable.</strong> The Harken Contact Deck is removed for this setup card.
                                </SpecialRuleBlock>
                            )}
                            {jobMode === 'awful_jobs' && (
                                <SpecialRuleBlock source="setupCard" title="Setup Card Override">
                                    {forbiddenStartingContact === CONTACT_NAMES.HARKEN ? (
                                        <>
                                            <strong>Limited Contacts.</strong> This setup card normally draws from Harken, Amnon Duul, and Patience.
                                            <div className="mt-1 text-amber-800 font-bold text-xs">
                                                ⚠️ Story Card Conflict: Harken is unavailable. Draw from Amnon Duul and Patience only.
                                            </div>
                                        </>
                                    ) : (
                                        <><strong>Limited Contacts.</strong> Starting Jobs are drawn only from Harken, Amnon Duul, and Patience.</>
                                    )}
                                </SpecialRuleBlock>
                            )}
                            {jobMode === 'buttons_jobs' && (
                                <SpecialRuleBlock source="setupCard" title="Setup Card Override">
                                    <strong>Specific Contacts:</strong> Draw from Amnon Duul, Lord Harrow, and Magistrate Higgins.
                                    <br/>
                                    <strong>Caper Bonus:</strong> Draw 1 Caper Card.
                                </SpecialRuleBlock>
                            )}
                            {gameState.setupCardId === STEP_IDS.D_RIM_JOBS && (
                                <SpecialRuleBlock source="setupCard" title="Setup Card Override">
                                    <strong>Modified Contact Decks.</strong> The Contact Decks contain only cards from the Blue Sun and Kalidasa expansions.
                                </SpecialRuleBlock>
                            )}
                            {isSingleContactChallenge ? (
                                <>
                                    <SpecialRuleBlock source="warning" title="Challenge Active">
                                        <p><strong>Single Contact Only:</strong> You may only work for one contact.</p>
                                    </SpecialRuleBlock>
                                    <p className={`mb-4 font-bold ${textColor} text-lg`}>Choose 1 Contact from the available list:</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {contacts.map(contact => (
                                            <span key={contact} className={`px-3 py-1 ${pillBg} ${pillText} rounded-full text-sm border ${pillBorder} shadow-sm font-bold`}>
                                                {contact}
                                            </span>
                                        ))}
                                    </div>
                                    <p className={`text-lg font-bold ${isDark ? 'text-amber-400' : 'text-amber-800'} mb-2`}>
                                        Draw 3 Job Cards from your chosen contact.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className={`mb-4 font-bold ${textColor} text-lg`}>Draw 1 Job Card from each:</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {contacts.map(contact => (
                                            <span key={contact} className={`px-3 py-1 ${pillBg} ${pillText} rounded-full text-sm border ${pillBorder} shadow-sm font-bold`}>
                                                {contact}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                            <p className={`text-sm ${noteText} border-t ${dividerBorder} pt-3 mt-2 italic`}>
                                Discard any unwanted jobs. {totalJobCards > 3 && !isSingleContactChallenge && <span>Keep a hand of <strong>up to three</strong> Job Cards.</span>}
                            </p>
                        </div>
                    );
                })()}
                
                {activeChallenges.length > 0 && (
                   <SpecialRuleBlock source="warning" title="Story Directives (Challenges)">
                      <ul className="list-disc ml-5 space-y-1 text-sm">
                          {activeChallenges.map(opt => (
                              <li key={opt.id}>{opt.label}</li>
                          ))}
                      </ul>
                      <p className="mt-2 text-xs italic opacity-80">These restrictions apply throughout the game.</p>
                   </SpecialRuleBlock>
                )}

                {smugglersBluesSetup && (
                     <SpecialRuleBlock source="story" title="Story Override">
                        Place a $2000 bill under Amnon Duul, Patience, Badger, and Niska's Contact Decks.
                     </SpecialRuleBlock>
                )}

                {lonelySmugglerSetup && (
                     <SpecialRuleBlock source="story" title="Story Override">
                        Place a <strong>Goal Token</strong> on the Contact Decks for <strong>Amnon Duul, Patience, Badger, and Niska</strong>.
                     </SpecialRuleBlock>
                )}

                {activeStoryCard.setupConfig?.removePiracyJobs && (
                    <SpecialRuleBlock source="story" title="Story Override">
                        Pull all remaining Piracy Jobs from the Contact Decks and discard them. Reshuffle.
                    </SpecialRuleBlock>
                )}
             </>
          )}
      </div>
  );
};
