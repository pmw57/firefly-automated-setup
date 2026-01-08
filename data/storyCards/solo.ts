

import { StoryCardDef } from '../../types/index';
import { createStoryRules } from './utils';

export const SOLO_STORIES: StoryCardDef[] = [
  {
    title: "A Fistful Of Scoundrels",
    intro: "A captain is only as good as his reputation. And you never know when the winds might change, so best to be on terms with as many folks as possible.",
    setupDescription: "Starting Jobs: No Starting Jobs are dealt. Instead, prime the Contacts, revealing the top 3 cards of each. Place the revealed Job Cards in their discard piles.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860502/sjliver",
    rules: createStoryRules("A Fistful Of Scoundrels", [
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'primeContacts' },
      { type: 'setJobMode', mode: 'no_jobs' },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Story Override',
          content: ["Roots In The Community: Each time you gain Solid with a Contact, recover 2 Game Length Tokens."]
        }
      }
    ]),
    challengeOptions: [
      { id: 'dont_prime_contacts', label: "Don't prime the Contact decks." },
      { id: 'illegal_jobs_only', label: "Work only Illegal Jobs." },
      { id: 'recover_1_glt', label: "Only recover 1 Game Length Token each time you become Solid." },
      { id: 'caper_first', label: "Complete a Caper before gaining any Solid Rep." }
    ],
    advancedRule: {
      id: "adv_alt_alliance_contacts",
      title: "Alternate Alliance Contacts",
      description: "Changes which contacts are considered Alliance contacts.",
      disabledDescription: "This rule is on the back of the selected Story Card."
    }
  },
  {
    title: "Awful Lonely In The Big Black",
    intro: "It takes a brave soul to sail the Big Black alone... Pick your goal and test your skills.",
    setupDescription: "Setup follows the normal rules with the following exceptions: 1) In addition to selecting yout Leader, you may also select up to 4 crew cards from any deck - up to a total value of $1000. 2) Place a pile of exactly 20 Disgruntled Tokens to the side. These tokens will be used as Game Length Tokens.",
    sourceUrl: "https://web.archive.org/web/20220226163627/https://www.flamesofwar.com/Portals/0/all_images/GF9/Firefly/Rulebooks/StoryCards/AwfulLonelyStoryCard.png",
    rules: createStoryRules("Awful Lonely In The Big Black", [
      { type: 'addFlag', flag: 'soloCrewDraft' },
      { type: 'addFlag', flag: 'soloGameTimer' },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Assembling a Rag-Tag Crew',
          content: [
            {
              type: 'paragraph',
              content: [
                'In addition to selecting your Leader, you may also select up to ',
                { type: 'strong', content: '4 Crew cards' },
                ' from any deck, up to a total value of ',
                { type: 'strong', content: '$1000' },
                '.'
              ]
            }
          ]
        }
      }
    ]),
    goals: [
      { title: "Goal 1: The Good", description: "Making Connections: End the game Solid with 5 different Contacts." },
      { title: "Goal 2: The Bad", description: "Crime Does Pay: End the game with $15,000 or more." },
      { title: "Goal 3: The Ugly", description: "No Rest For The Wicked: Successfully Proceed past 20 or more Misbehave cards. Set aside Misbehave Cards you Proceed past to track your progress." }
    ],
    isSolo: true
  },
  {
    title: "For A Few Credits More",
    intro: "Money can't buy happiness, but empty pockets can't buy nothin'.",
    setupDescription: "Starting Jobs: No Starting Jobs are dealt. Instead, prime the Contact Decks, revealing the top 3 cards of each. Place the revealed Job Cards in their discard piles.",
    requiredExpansion: "tenth",
    additionalRequirements: ["crime"],
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860501/sjliver",
    rules: createStoryRules("For A Few Credits More", [
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'addFlag', flag: 'startWithAlertCard' },
      { type: 'primeContacts' },
      { type: 'setJobMode', mode: 'no_jobs' },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Alliance High Alert',
          content: ['Begin the game with one random Alliance Alert Card in play.']
        }
      }
    ]),
    challengeOptions: [
      { id: 'one_job_per_contact', label: "Work no more than one Job per Contact." },
      { id: 'legal_jobs_only', label: "Work only Legal Jobs, including Bounties." },
      { id: 'single_contact', label: "Work for a single Contact only." },
      { id: 'pay_on_botch', label: "Pay your Crew whenever you Botch. Otherwise, Disgruntle them." }
    ],
    advancedRule: {
      id: "adv_alt_corvette_contacts",
      title: "Alternate Corvette Contacts",
      description: "Changes which contacts are considered Corvette contacts.",
      disabledDescription: "This rule is on the back of the selected Story Card."
    }
  },
  {
    title: "Goin' Reaver",
    intro: "Captain ain't been the same since we pulled 'em out of that Alliance black ops site: cagey, paranoid... rageful. We can't figure it out soon, it's gonna get real bad.",
    setupDescription: "Place Reaver Alert Tokens in every sector in Motherlode, Redsun, and the Uroboros Belt, Blue Sun.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860508/sjliver",
    rules: createStoryRules("Goin' Reaver", [
      { type: 'addFlag', flag: 'placeReaverAlertsInMotherlodeAndUroboros' },
      { type: 'addFlag', flag: 'soloGameTimer' }
    ]),
    advancedRule: {
      id: "adv_wolf_at_your_door",
      title: "Wolf At Your Door",
      description: "An additional threat pursues you through the 'Verse.",
      disabledDescription: "This rule is on the back of the selected Story Card."
    }
  },
  {
    title: "Heroes & Misfits",
    intro: "Legends whisper the tales of the ship that could outrun Alliance Cruisers and Reavers alike. A ship that carried a rag-tag crew, each a misfit, each a hero. Now, it's time for you to make your own legacy.",
    setupDescription: "Starting Resources: Begin play at Persephone with Malcolm and Serenity (with Expanded Crew Quarters), Zoë, Wash, Jayne, Kaylee, Simon Tam, River Tam, Inara, Shepherd Book, and $2000. Alliance Alerts: Start with one random Alliance Alert in play. Shuggle all 3-Goal Story Cards into a single deck.",
    requiredExpansion: "tenth",
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860504/sjliver",
    rules: createStoryRules("Heroes & Misfits", [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 2000, description: "Story Funds" },
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'addFlag', flag: 'startWithAlertCard' },
      { type: 'setShipPlacement', location: 'persephone' },
      { type: 'addFlag', flag: 'isHeroesAndMisfits' },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Story Override',
          content: [
            { type: 'paragraph', content: [{ type: 'strong', content: 'Starting Resources:' }, ' Begin play at Persephone with Malcolm and Serenity (with Expanded Crew Quarters), Zoë, Wash, Jayne, Kaylee, Simon Tam, River Tam, Inara, Shepherd Book, and $2000.'] },
            { type: 'paragraph', content: [{ type: 'strong', content: 'Alliance Alerts:' }, ' Start with one random Alliance Alert in play.'] },
            { type: 'paragraph', content: [{ type: 'strong', content: 'Adventure Deck:' }, ' Shuffle all 3-Goal story cards into a single deck.'] }
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Alliance High Alert',
          content: ['Begin the game with one random Alliance Alert Card in play.']
        }
      }
    ]),
    challengeOptions: [
      { id: 'heroes_custom_setup', label: "Why should Mal have all the fun? Pick the Leader, Ship, and Supply Planet of your choice. Begin the game with $2000 and a full compliment of your favourite crew from the show or game." }
    ],
    advancedRule: {
      id: "adv_contact_quirks_work",
      title: "Contact Quirks - Work",
      description: "Contacts have additional requirements or penalties when taking jobs from them.",
      disabledDescription: "This rule is on the back of the selected Story Card."
    }
  },
  {
    title: "The Lonely Smuggler's Blues",
    intro: "Sometimes, it gets lonely in the Black, but it's a good way to dodge the law when you're haulin' goods that might draw the wrong kind of attention.",
    setupDescription: "Place 3 Contraband on each Supply Planet except Persephone and Space Bazaar. Place a Goal Token on the Contact Decks for Amnon Duul, Patience, Badger, and Niska. Do not deal Starting Jobs. Begin play at Londinium. Start with one random Alliance Alert Card in play.",
    requiredExpansion: "tenth",
    additionalRequirements: ["crime"],
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860503/sjliver",
    rules: createStoryRules("The Lonely Smuggler's Blues", [
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'addFlag', flag: 'lonelySmugglerSetup' },
      { type: 'setShipPlacement', location: 'londinium' },
      { type: 'addFlag', flag: 'startWithAlertCard' },
      { type: 'setJobMode', mode: 'no_jobs' },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Alliance High Alert',
          content: ['Begin the game with one random Alliance Alert Card in play.']
        }
      }
    ]),
    advancedRule: {
      id: "adv_lone_targets",
      title: "Lone Targets",
      description: "You are more vulnerable to threats when flying alone.",
      disabledDescription: "This rule is on the back of the selected Story Card."
    }
  },
  {
    title: "Once Upon A Time In The Black",
    intro: "Robin Hood. Ching Shih. Billy the Kid. Al Capone. Bori Khan. Test your mettle to tell a tale to match the legends.",
    requiredExpansion: "tenth",
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860506/sjliver",
    advancedRule: {
      id: "adv_alt_reaver_contacts",
      title: "Alternate Reaver Contacts",
      description: "Changes which contacts are associated with Reavers.",
      disabledDescription: "This rule is on the back of the selected Story Card."
    }
  },
  {
    title: "Racing A Pale Horse",
    intro: "The Operative has your scent. He's closing in on your home, and nothing can stop him. Well, maybe nothing except Glücklich Jiã's prototype next-gen artillery cannon...",
    setupDescription: "Place your Haven at Deadwood, Blue Sun. Do not use a Timer for this game.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860500/sjliver",
    rules: createStoryRules("Racing A Pale Horse", [
      { type: 'addFlag', flag: 'disableSoloTimer' },
      { 
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Setup: Haven',
          content: [{ type: 'strong', content: `Place your Haven at Deadwood (Blue Sun).` }, { type: 'br' }, `If you end your turn at your Haven, remove Disgruntled from all Crew.`]
        }
      }
    ]),
    advancedRule: {
      id: "adv_automated_movement",
      title: "Automated Movement",
      description: "When you draw 'Keep Flying', move an NPC ship one sector instead of drawing again.",
      disabledDescription: "This rule is on the back of the selected Story Card."
    }
  },
  {
    title: "The Raggedy Edge",
    intro: "It's a hard life out in the Black. See how long you can last before Reavers, the law, or bad luck catches up with you.",
    setupDescription: "Do not use a Timer for this game. Start with one random Alliance Alert Card in play. Begin play with 1 Goal Token.",
    requiredExpansion: "tenth",
    additionalRequirements: ["crime"],
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860505/sjliver",
    rules: createStoryRules("The Raggedy Edge", [
      { type: 'modifyResource', resource: 'goalTokens', method: 'add', value: 1, description: "Begin play with 1 Goal Token." },
      { type: 'addFlag', flag: 'disableSoloTimer' },
      { type: 'addFlag', flag: 'startWithAlertCard' },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Alliance High Alert',
          content: ['Begin the game with one random Alliance Alert Card in play.']
        }
      }
    ]),
    advancedRule: {
      id: "adv_contact_quirks_deal",
      title: "Contact Quirks - Deal",
      description: "Contacts have special rules when dealing with them.",
      disabledDescription: "This rule is on the back of the selected Story Card."
    }
  },
  {
    title: "Seeds Of Rebellion",
    intro: "The New Resistance is ready to open up some eyes and change a few hearts. They need a savvy captain to deliver key personnel to the heart of Alliance space.",
    setupDescription: "You may not deal with Harken. Place harken's 7 Immoral Transport Jobs in separate discard pile to represent New Resistance Missions. ",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860507/sjliver",
    rules: createStoryRules("Seeds Of Rebellion", [
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'forbidContact', contact: 'Harken' }
    ]),
    advancedRule: {
      id: "adv_lost_little_lambs",
      title: "Lost Little Lambs",
      description: "Rescuing crew has additional complications and risks.",
      disabledDescription: "This rule is on the back of the selected Story Card."
    }
  }
];