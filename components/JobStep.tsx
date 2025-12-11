import React from 'react';
import { GameState, Step } from '../types';
import { STORY_CARDS } from '../constants';
import { determineJobMode } from '../utils';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { InlineExpansionIcon } from './InlineExpansionIcon';

interface JobStepProps {
  step: Step;
  gameState: GameState;
}

export const JobStep: React.FC<JobStepProps> = ({ step, gameState }) => {
  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];
  const stepId = step.data?.id || step.id;

  const jobMode = determineJobMode(activeStoryCard, overrides);
  const { forbiddenStartingContact, allowedStartingContacts, removePiracyJobs, smugglersBluesSetup, removeJobDecks, sharedHandSetup } = activeStoryCard.setupConfig || {};

  const renderJobInstructions = () => {
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
           if (overrides.browncoatJobMode) {
               return (
                   <SpecialRuleBlock source="scenario" title="Setup Override">
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
           return (
               <SpecialRuleBlock source="story" title="Story Override">
                   <p className="mb-2">In reverse player order, each player chooses <strong>3 different Contact Decks</strong>.</p>
                   <p className="mb-2">Draw the top Job Card from each chosen deck.</p>
                   {forbiddenStartingContact === 'Niska' && <p className="text-red-600 text-sm font-bold">Note: Mr. Universe is excluded.</p>}
                   <p className="opacity-75 mt-2">Players may discard any starting jobs they do not want.</p>
               </SpecialRuleBlock>
           );
       }
       
       // 2. Scenario Overrides

       if (jobMode === 'times_jobs') {
           return (
               <SpecialRuleBlock source="scenario" title="Setup Override">
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
           contacts = ['Harken', 'Amnon Duul', 'Patience'];
       } else {
           // Standard Logic (Also used for Rim Jobs where decks are modified but procedure is standard)
           // This also serves as the base for Alliance High Alert
           contacts = ['Harken', 'Badger', 'Amnon Duul', 'Patience', 'Niska'];
       }

       // High Alert Logic: Remove Harken from standard list
       if (jobMode === 'high_alert_jobs') {
           contacts = contacts.filter(c => c !== 'Harken');
       }

       // Apply Filters (Forbidden / Allowed)
       if (forbiddenStartingContact) {
           contacts = contacts.filter(c => c !== forbiddenStartingContact);
       }
       if (allowedStartingContacts && allowedStartingContacts.length > 0) {
           contacts = contacts.filter(c => allowedStartingContacts.includes(c));
       }

       // Calculate total job cards to determine if discard warning is needed.
       // Note: Caper cards (from buttons_jobs) do NOT count towards the Job Card Hand Limit.
       const totalJobCards = contacts.length;
       
       const showStoryOverride = (forbiddenStartingContact || (allowedStartingContacts && allowedStartingContacts.length > 0));

       return (
           <div className="bg-white p-4 rounded border border-gray-200">
               {showStoryOverride && activeStoryCard.setupDescription && (
                   <SpecialRuleBlock source="story" title="Story Override">
                       {activeStoryCard.setupDescription}
                   </SpecialRuleBlock>
               )}

               {jobMode === 'high_alert_jobs' && (
                   <SpecialRuleBlock source="scenario" title="Setup Override">
                       <strong>Harken is unavailable.</strong> The Harken Contact Deck is removed for this scenario.
                   </SpecialRuleBlock>
               )}

               {jobMode === 'awful_jobs' && (
                   <SpecialRuleBlock source="scenario" title="Setup Override">
                       {forbiddenStartingContact === 'Harken' ? (
                           <>
                               <strong>Limited Contacts.</strong> This scenario normally draws from Harken, Amnon Duul, and Patience.
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
                   <SpecialRuleBlock source="scenario" title="Setup Override">
                        <strong>Specific Contacts:</strong> Draw from Amnon Duul, Lord Harrow, and Magistrate Higgins.
                        <br/>
                        <strong>Caper Bonus:</strong> Draw 1 Caper Card.
                   </SpecialRuleBlock>
               )}

               {gameState.scenarioValue === 'TheRimsTheThing' && (
                   <SpecialRuleBlock source="scenario" title="Setup Override">
                       <strong>Modified Contact Decks.</strong> The Contact Decks contain only cards from the Blue Sun and Kalidasa expansions.
                   </SpecialRuleBlock>
               )}

               <p className="mb-3 font-bold text-gray-700">Draw 1 Job Card from each:</p>
               <div className="flex flex-wrap gap-2 mb-4">
                   {contacts.map(contact => (
                       <span key={contact} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm border border-gray-300 shadow-sm font-medium">
                           {contact}
                       </span>
                   ))}
               </div>
               
               <p className="text-sm text-gray-600 border-t pt-2 mt-2">
                  Discard any unwanted jobs. {totalJobCards > 3 && <span>Keep a hand of <strong>up to three</strong> Job Cards.</span>}
               </p>
           </div>
       );
  };

  return (
      <div className="space-y-4">
          {stepId.includes('D_RIM_JOBS') ? (
             <SpecialRuleBlock source="scenario" title="Setup Override">
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

                {renderJobInstructions()}
                
                {smugglersBluesSetup && (
                     <SpecialRuleBlock source="story" title="Story Override">
                        Place a $2000 bill under Amnon Duul, Patience, Badger, and Niska's Contact Decks.
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