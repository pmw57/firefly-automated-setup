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
               <SpecialRuleBlock source="story" title="Special Story Setup">
                   <p><strong>Do not deal Starting Jobs.</strong></p>
                   <p>Each player begins the game with <strong>one Caper Card</strong> instead.</p>
               </SpecialRuleBlock>
           );
       }
       if (jobMode === 'no_jobs') {
           return <div className="p-4 bg-gray-100 rounded text-center font-bold text-gray-600 border border-gray-200">Do not take Starting Jobs.</div>;
       }
       if (jobMode === 'wind_takes_us') {
           return (
               <SpecialRuleBlock source="story" title="Where The Wind Takes Us">
                   {overrides.rimJobMode ? (
                      <p className="mb-2">Each player chooses one <strong>Blue Sun or Kalidasa</strong> Contact Deck:</p>
                   ) : (
                      <p className="mb-2">Each player chooses <strong>one Contact Deck</strong> of their choice:</p>
                   )}
                   <ul className="list-disc ml-5 mb-3 text-sm">
                       <li>Draw <strong>{gameState.playerCount <= 3 ? '4' : '3'} Jobs</strong> from that deck.</li>
                       <li>Place a <strong>Goal Token</strong> at the drop-off/destination sector of each Job.</li>
                       <li>Return all Jobs to the deck and reshuffle.</li>
                   </ul>
                   <p className="font-bold text-red-700">Do not deal Starting Jobs.</p>
                   
                   {overrides.rimJobMode && (
                       <div className="mt-3 pt-3 border-t border-blue-200">
                           <p className="text-xs font-bold text-blue-800 uppercase mb-1">Valid Decks (Rim Setup):</p>
                           <div className="flex flex-wrap gap-2">
                               {['Fanty & Mingo', 'Lord Harrow', 'Mr. Universe', 'Magistrate Higgins'].map(c => (
                                   <span key={c} className="text-xs bg-white px-2 py-1 rounded border border-blue-100">{c}</span>
                               ))}
                           </div>
                       </div>
                   )}
               </SpecialRuleBlock>
           );
       }
       if (jobMode === 'draft_choice') {
           return (
               <SpecialRuleBlock source="story" title="Draft Choice">
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
               <SpecialRuleBlock source="scenario" title="Time's Not On Our Side">
                   <p>Each player draws <strong>3 jobs</strong> from <strong>one Contact Deck</strong> of their choice.</p>
                   <p className="text-sm italic opacity-80 mt-1">Players may draw from the same Contact.</p>
                   <p className="opacity-75 mt-2">Players may discard any starting jobs they do not want.</p>
               </SpecialRuleBlock>
           );
       }

       // Contact List Logic for Standard / Specific Lists
       let contacts: string[] = [];
       
       if (jobMode === 'rim_jobs') {
           // The Rim's The Thing logic
           if (gameState.expansions.blue) contacts.push('Fanty & Mingo', 'Lord Harrow');
           if (gameState.expansions.kalidasa) contacts.push('Magistrate Higgins', 'Mr. Universe');
       } else if (jobMode === 'buttons_jobs') {
           contacts = ['Amnon Duul', 'Lord Harrow', 'Magistrate Higgins'];
       } else if (jobMode === 'awful_jobs') {
           contacts = ['Harken', 'Amnon Duul', 'Patience'];
       } else if (jobMode === 'high_alert_jobs') {
           // Any contact EXCEPT Harken
           return (
               <SpecialRuleBlock source="scenario" title="Alliance High Alert">
                   <p className="mb-2"><strong>Do not use Harken.</strong></p>
                   <p>Draw <strong>3 starting jobs</strong> from <strong>any combination</strong> of other Contacts.</p>
                   <p className="opacity-75 mt-2">Players may discard any starting jobs they do not want.</p>
               </SpecialRuleBlock>
           );
       } else {
           // Standard Logic
           contacts = ['Harken', 'Badger', 'Amnon Duul', 'Patience', 'Niska'];
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

       return (
           <div className="bg-white p-4 rounded border border-gray-200">
               <p className="mb-3 font-bold text-gray-700">Draw 1 Job Card from each:</p>
               <div className="flex flex-wrap gap-2 mb-4">
                   {contacts.map(contact => (
                       <span key={contact} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm border border-gray-300 shadow-sm font-medium">
                           {contact}
                       </span>
                   ))}
               </div>
               
               {/* Specific Extra Instruction for Buttons */}
               {jobMode === 'buttons_jobs' && <p className="mb-2 text-sm font-bold text-purple-700">+ Draw 1 Caper Card</p>}

               <p className="text-sm text-gray-600 border-t pt-2 mt-2">
                  Discard any unwanted jobs. {totalJobCards > 3 && <span>Keep a hand of <strong>up to three</strong> Job Cards.</span>}
               </p>
           </div>
       );
  };

  return (
      <div className="space-y-4">
          {stepId.includes('D_RIM_JOBS') ? (
             <SpecialRuleBlock source="scenario" title="Rim Space Jobs">
               <p className="leading-relaxed">
                 Separate the Job Cards from the <InlineExpansionIcon type="blue" /> and <InlineExpansionIcon type="kalidasa" /> expansions. 
                 These are marked with a specific icon. Use <strong>only these cards</strong> as your Contact Decks. 
                 The Job Cards from the core game will not be used.
               </p>
             </SpecialRuleBlock>
          ) : (
             <>
                {sharedHandSetup && (
                    <SpecialRuleBlock source="story" title="Setup: Shared Hand">
                         <p>
                             Place <strong>one Job from each Contact</strong> face up on top of its deck. 
                             These face up Jobs form a shared hand of Inactive Jobs that everyone may use.
                         </p>
                    </SpecialRuleBlock>
                )}

                {renderJobInstructions()}
                
                {smugglersBluesSetup && (
                     <SpecialRuleBlock source="story" title="Contraband Seed">
                        Place a $2000 bill under Amnon Duul, Patience, Badger, and Niska's Contact Decks.
                     </SpecialRuleBlock>
                )}

                {removePiracyJobs && (
                    <SpecialRuleBlock source="story" title="Cleanup">
                        Pull all remaining Piracy Jobs from the Contact Decks and discard them. Reshuffle.
                    </SpecialRuleBlock>
                )}
             </>
          )}
      </div>
  );
};