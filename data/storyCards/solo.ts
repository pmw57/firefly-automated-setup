import { StoryCardDef } from '../../types';
import { SETUP_CARD_IDS, CONTACT_NAMES } from '../ids';
import { createStoryRules } from './utils';

export const SOLO_STORIES: StoryCardDef[] = [
  {
    title: "And That Makes Us Mighty",
    intro: "Feeling disrespected, broke, and in a bad mood, you finally decide to do something about it. But how many of your problems can you solve at once?",
    isSolo: true,
    goals: [
      {
        title: "Earn Their Respect",
        description: "End the game with at least 5 different Contacts."
      },
      {
        title: "Flush with Cash",
        description: "End the game with at least $15,000."
      },
      {
        title: "Let Off Some Steam",
        description: "Successfully Proceed past 20 more Misbehave cards by the end of the game."
      }
    ],
    rules: createStoryRules("And That Makes Us Mighty", [
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Post-Priming Draft',
          content: [
            { type: 'paragraph', content: ["After Priming the Pump, you may select up to ", { type: 'strong', content: '4 Crew cards' }, " that were revealed, up to a total value of ", { type: 'strong', content: '$1000' }, "."] },
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Multiple Goals',
          content: [ "In addition to selecting one Goal, you must try to complete as many Goals as possible by the end of the game." ]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/filepage/278719/solo-and-co-op-story-cards-focusing-on-the-crew-of",
    requiredExpansion: "community"
  },
  {
    title: "Ariel",
    intro: "When River slashes Jayne's chest, Simon decides it's time to get serious about treating her. He hires the crew of Serenity to get him and River into a high-tech hospital on Ariel so he can see what the Alliance did to her.",
    setupDescription: "Continue with the crew and items you acquired after completing Out of Gas. Requires EXPLOSIVES.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 10,
    campaignSetupNotes: ['EXPLOSIVES_REQUIRED']
  },
  {
    title: "Awful Lonely In The Big Black",
    intro: "It takes a brave soul to sail the Big Black alone... Pick your goal and test your skills.",
    sourceUrl: "https://web.archive.org/web/20220226163627/https://www.flamesofwar.com/Portals/0/all_images/GF9/Firefly/Rulebooks/StoryCards/AwfulLonelyStoryCard.png",
    rules: createStoryRules("Awful Lonely In The Big Black", [
      { type: 'addFlag', flag: 'removePiracyJobs' },
      { type: 'addFlag', flag: 'soloCrewDraft' },
      { type: 'addFlag', flag: 'soloGameTimer' }
    ]),
    goals: [
      { title: "Goal 1: The Good", description: "Making Connections: End the game Solid with 5 different Contacts." },
      { title: "Goal 2: The Bad", description: "Crime Does Pay: End the game with $15,000 or more." },
      { title: "Goal 3: The Ugly", description: "No Rest For The Wicked: Successfully Proceed past 20 or more Misbehave cards. Set aside Misbehave Cards you Proceed past to track your progress." }
    ],
    isSolo: true
  },
  {
    title: "Beholden to Niska",
    intro: "You have gotten a loan from Niska to buy your first ship. Niska will expect favors and to be paid back (with interest) in a timely manner. Failure to do so will result in legal confiscation of your ship, and illegal confiscation of your life!",
    isSolo: true,
    rules: createStoryRules("Beholden to Niska", [
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Game Timer',
          content: ["Game lasts for ", { type: 'strong', content: '30 turns' }, " (plus a final \"No Fly Action\" turn)."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Start Location',
          content: ["Start at the ", { type: 'strong', content: 'Osiris ShipWorks' }, " with a Leader and a Ship."]
        }
      },
      { type: 'setJobMode', mode: 'no_jobs' },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'No Priming',
          content: [{ type: 'strong', content: 'Do not "Prime the Pump"' }, " during setup."]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/filepage/129108/beholden-to-niska-firefly-solitaire-story-card-by",
    requiredExpansion: "community"
  },
  {
    title: "Bushwhacked",
    intro: "Serenity encounters a drifting spaceship of  a type which was converted to transport settlers to the Outer Planets. Mal decides to check out the derelict in order to either help survivors or loot the dead.",
    setupDescription: "Continue with the crew and items you acquired after completing The Train Job.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 4
  },
  {
    title: "Christmas Delivery",
    intro: "The 'Verse is just too big for one man to provide joy for all of the good little boys and girls. He needs your help and you'd better not misbehave!",
    requiredExpansion: "community",
    isSolo: true,
    setupDescription: "The same as Awful Lonely in the Big Black",
    rules: createStoryRules("Christmas Delivery", [
      { type: 'addFlag', flag: 'removePiracyJobs' },
      { type: 'addFlag', flag: 'soloCrewDraft' },
      { type: 'addFlag', flag: 'soloGameTimer' }
    ]),
    sourceUrl: "https://boardgamegeek.com/thread/1076227/article/14229639#14229639"
  },
  {
    title: "A Fistful Of Scoundrels",
    intro: "A captain is only as good as his reputation. And you never know when the winds might change, so best to be on terms with as many folks as possible.",
    setupDescription: "Roots In The Community: Each time you gain Solid with a Contact, recover 2 Game Length Tokens.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860502/sjliver",
    rules: createStoryRules("A Fistful Of Scoundrels", [
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'primeContacts' },
      { type: 'setJobMode', mode: 'no_jobs' }
    ]),
    challengeOptions: [
      { id: 'dont_prime_contacts', label: "Don't prime the Contact decks." },
      { id: 'illegal_jobs_only', label: "Work only Illegal Jobs." },
      { id: 'recover_1_glt', label: "Only recover 1 Game Length Token each time you become Solid." },
      { id: 'caper_first', label: "Complete a Caper before gaining any Solid Rep." }
    ],
    advancedRule: {
      id: "adv_alt_alliance_contacts",
      title: "Alternate Alliance Contacts"
    }
  },
  {
    title: "For A Few Credits More",
    intro: "Money can't buy happiness, but empty pockets can't buy nothin'.",
    setupDescription: "No Starting Jobs (Prime Contact Decks). Start with 1 random Alliance Alert.",
    requiredExpansion: "tenth",
    additionalRequirements: ["crime"],
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860501/sjliver",
    rules: createStoryRules("For A Few Credits More", [
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'addFlag', flag: 'startWithAlertCard' },
      { type: 'primeContacts' },
      { type: 'setJobMode', mode: 'no_jobs' }
    ]),
    challengeOptions: [
      { id: 'one_job_per_contact', label: "Work no more than one Job per Contact." },
      { id: 'legal_jobs_only', label: "Work only Legal Jobs, including Bounties." },
      { id: 'single_contact', label: "Work for a single Contact only." },
      { id: 'pay_on_botch', label: "Pay your Crew whenever you Botch. Otherwise, Disgruntle them." }
    ],
    advancedRule: {
      id: "adv_alt_corvette_contacts",
      title: "Alternate Corvette Contacts"
    }
  },
  {
    title: "Goin' Reaver",
    intro: "Captain ain't been the same since we pulled 'em out of that Alliance black ops site: cagey, paranoid... rageful. We can't figure it out soon, it's gonna get real bad.",
    setupDescription: "Place Reaver Alert Tokens in Motherlode (Red Sun) and Uroboros Belt (Blue Sun).",
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
      title: "Wolf At Your Door"
    }
  },
  {
    title: "Heart of Gold",
    intro: "Aboard Serenity, a crew member receives a distress call from a friend, Nandi, owner of a border moon bordello. Nandi asks for help dealing with a landowner named Burgess, who is victimizing one of her employees.",
    setupDescription: "Continue with the crew and items you acquired after completing The Message.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 14
  },
  {
    title: "The Hero of Canton",
    intro: "You can't do that to my people. Can't crush them under your heel. I'll strap on my hat, and in 20 rounds flat, steal every Mudder Boss Higgins has to steal.",
    isSolo: true,
    rules: createStoryRules("The Hero of Canton", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Hero Assignment',
          content: ["Start play with ", { type: 'strong', content: "Cap'n Jayne" }, " as your Leader, ", { type: 'strong', content: "Jayne's Cunning Hat" }, ", and ", { type: 'strong', content: "Vera" }, "."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Starting Gear Cost',
          content: ["Subtract the cost of Vera from your Starting Cash."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Mudder Deck',
          content: [
            { type: 'paragraph', content: ["Pull all Mudders and Stitch from the Supply decks."] },
            { type: 'paragraph', content: ["Shuffle them all together and place them face up as the Mudder deck. If the Foreman or Stitch is the top card after a shuffle, reshuffle the deck."] },
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Game Timer',
          content: ["Use ", { type: 'strong', content: "20 Disgruntle tokens" }, " as the game length timer."]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/filepage/288785/the-hero-of-canton-solo-story-card",
    requiredExpansion: "community"
  },
  {
    title: "Heroes & Misfits",
    intro: "Legends whisper the tales of the ship that could outrun Alliance Cruisers and Reavers alike. A ship that carried a rag-tag crew, each a misfit, each a hero. Now, it's time for you to make your own legacy.",
    setupDescription: "Starting Resources: Begin play at Persephone with Malcolm and Serenity (with Expanded Crew Quarters), Zoë, Wash, Jayne, Kaylee, Simon Tam, River Tam, Inara, Shepherd Book, and $2000. Alliance Alerts: Start with one random Alliance Alert in play. Adventure Deck: Shuffle all 3-Goal story cards into a single deck.",
    requiredExpansion: "tenth",
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860504/sjliver",
    rules: createStoryRules("Heroes & Misfits", [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 2000, description: "Story Funds" },
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'addFlag', flag: 'startWithAlertCard' },
      { type: 'setShipPlacement', location: 'persephone' },
      { type: 'addFlag', flag: 'isHeroesAndMisfits' }
    ]),
    challengeOptions: [
      { id: 'heroes_custom_setup', label: "Why should Mal have all the fun? Pick the Leader, Ship, and Supply Planet of your choice. Begin the game with $2000 and a full compliment of your favourite crew from the show or game." }
    ],
    advancedRule: {
      id: "adv_contact_quirks_work",
      title: "Contact Quirks - Work"
    }
  },
  {
    title: "Hunt For The Arc",
    intro: "The Joan of Arc, one of the great colony ships that left Earth-That-Was hundreds of years ago, never arrived at its destination. Filled with priceless Earth artifacts, the huge vessel has long been rumored to be floating out beyond Alliance space, just waiting to make some lucky crew filthy rich. It's haunted you, become an obsession, but you pored over star charts and history books for years, and now you might just have a notion where she 'bides. Find the Arc and successfully deliver her to the Alliance for a hefty sum, or fence her to a criminal boss to become financially set for life...",
    requiredExpansion: "community",
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/thread/1049419/hunt-for-the-arc-a-solo-adventure",
    setupDescription: "Place a Reaver ship in the Border Space sector directly below Valentine, instead of its usual position.",
    rules: createStoryRules("Hunt For The Arc", [
      { type: 'addFlag', flag: 'huntForTheArcReaverPlacement', reaverShipCount: 1 }
    ])
  },
  {
    title: "Jaynestown",
    intro: "On Higgins' Moon, Inara meets the son of Magistrate Higgins. The rest of the crew is in search of loot. Meanwhile, One of the crew worries that his past misdeeds on Higgins' Moon might catch up with him.",
    setupDescription: "Continue with the crew and items you acquired after completing Our Mrs. Reynolds. You may want to get Jayne some negotiation gear, or things could go badly.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 8,
    campaignSetupNotes: ['SUGGEST_NEGOTIATION_GEAR']
  },
  {
    title: "Jubal's Early Years",
    intro: "Not much is know about Jubal's past.",
    isSolo: true,
    goals: [
      {
        "title": "Hunt the Verse's Most Wanted",
        "description": "During Setup, mark 3 random bounties (not Cortex Alerts). Deliver the 3 marked bounties."
      }
    ],
    rules: createStoryRules("Jubal's Early Years", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Leader Assignment',
          content: ["Start play with ", { type: 'strong', content: "Jubal Early" }, " as your Leader. Remove Serenity's crew from the Bounty and Supply Decks."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'allianceReaver',
        rule: {
          title: 'Active Bounties',
          content: ["The Bounty deck is placed face up. All bounties are active."]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/filepage/289736/jubals-story-solo-cards",
    requiredExpansion: "community"
  },
  {
    title: "Jubal's Mighty Roar",
    intro: "Bounty Hunting's been 'round since long before you was born and it'll be 'round long after you're gone. So, why not cash in some of them high priced Bounties. I hear there's a young girl that'll fetch a nice price.",
    isSolo: true,
    requiredExpansion: "community",
    rating: 3,
    rules: createStoryRules("Jubal's Mighty Roar", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Fixed Assignment',
          content: [
            {
              type: 'paragraph',
              content: ['Start play with the following fixed assignment:']
            },
            {
              type: 'list',
              items: [
                ['Leader: ', { type: 'strong', content: 'Jubal Early' }],
                ['Ship: ', { type: 'strong', content: 'The Interceptor' }],
                ['Gear: ', { type: 'strong', content: "Early's Pistol & Early's Combat Armor" }],
              ]
            }
          ]
        }
      },
      {
        type: 'modifyResource',
        resource: 'credits',
        method: 'add',
        value: -1600,
        description: "Cost of Starting Gear"
      },
      {
        type: 'addSpecialRule',
        category: 'allianceReaver',
        rule: {
          title: 'Special Token Placement',
          content: [
            'Place the ',
            { type: 'strong', content: 'Serenity ship token' },
            ' on any non-planetary sector within the ',
            { type: 'strong', content: 'Georgia system' },
            '.'
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Deck Preparation Overrides',
          content: [
            {
              type: 'list',
              items: [
                ['Find and remove all of ', { type: 'strong', content: "Serenity's crew cards" }, ' from the various Supply Decks and set them aside.'],
                ['The Bounty Deck is placed ', { type: 'strong', content: 'face up' }, ', and ', { type: 'strong', content: 'all Bounties are considered active' }, ' from the start of the game.'],
              ]
            }
          ]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/thread/3399878/jubals-mighty-roar"
  },
  {
    title: "The Lonely Smuggler's Blues",
    intro: "Sometimes, it gets lonely in the Black, but it's a good way to dodge the law when you're haulin' goods that might draw the wrong kind of attention.",
    setupDescription: "Place 3 Contraband on each Supply Planet except Persephone and Space bazaar. Place a Goal Token on the Contact Decks for Amnon Duul, Patience, Badger, and Niska. Do not deal Starting Jobs. Begin play at Londinium. Start with one random Alliance Alert Card in play.",
    requiredExpansion: "tenth",
    additionalRequirements: ["crime"],
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860503/sjliver",
    rules: createStoryRules("The Lonely Smuggler's Blues", [
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'addFlag', flag: 'lonelySmugglerSetup' },
      { type: 'setShipPlacement', location: 'londinium' },
      { type: 'addFlag', flag: 'startWithAlertCard' },
      { type: 'setJobMode', mode: 'no_jobs' }
    ]),
    advancedRule: {
      id: "adv_lone_targets",
      title: "Lone Targets"
    }
  },
  {
    title: "The Message",
    intro: "Amnon Duul has a crate for Mal. Inside is the body of Tracey, a man Mal knew during the war. The crew take the crate aboard Serenity and plan to take it home for burial, but now corrupt police are in pursuit.",
    setupDescription: "Continue with the crew and items you acquired after completing Trash. Start the Story at the Space Bazaar. Suggested: Fully Equipped Med Bay. Take Jayne's \"Cunning\" Hat.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 13,
    campaignSetupNotes: ['START_AT_SPACE_BAZAAR', 'SUGGEST_MED_BAY_AND_HAT']
  },
  {
    title: "Objects in Space",
    intro: "With the crew asleep, Jubel Early, a bounty hunter, sneaks aboard Serenity. He has been paid to abduct River Tam. He locks most of the crew in their cabins. However, River has disappeared.",
    setupDescription: "Continue with the crew and items you acquired after completing Heart of Gold. This Story can take place in any sector. If a named Crew is missing, choose another Crew.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 15,
    campaignSetupNotes: ['ANY_SECTOR_PLACEMENT_WITH_CREW_NOTE']
  },
  {
    title: "Once Upon A Time In The Big Black",
    intro: "Robin Hood, Ching Shih, Billy the Kid, Al Capone, Bori Khan. Test your mettle to tell a tale to match the legends.",
    setupDescription: "Special Rules: Collect Misbehave cards from completed Jobs (sideboard). 'Alliance Operatives' cannot be collected. Action: Spend $6000 to recover 1 Game Length Token (once/turn).",
    requiredExpansion: "tenth",
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/image/8860506/sjliver",
    rules: createStoryRules("Once Upon A Time In The Big Black", [
      { type: 'addFlag', flag: 'soloGameTimer' }
    ]),
    challengeOptions: [
      { id: 'no_immoral', label: "Don't work Immoral Jobs." },
      { id: 'no_capers', label: "No Capers allowed!" },
      { id: 'no_aces', label: "Don't use Aces." },
      { id: 'universe_challenge', label: "Attach a Mr. Universe Challenge Card to every Job." }
    ],
    advancedRule: {
      id: "adv_alt_reaver_contacts",
      title: "Alternate Reaver Contacts"
    }
  },
  {
    title: "Our Mrs. Reynolds",
    intro: "The crew of Serenity have agrees to help rid a settlement on Triumph of its bandit problem. The community can't pay, but promises the crew a big party and whatever other presents they can give.",
    setupDescription: "Continue with the crew and items you acquired after completing Safe Suggested: Mal's Pretty Floral Bonnet & Vera.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 7,
    campaignSetupNotes: ['SUGGEST_BONNET_VERA']
  },
  {
    title: "Out of Gas",
    intro: "Something has gone terribly wrong on Serenity. Remember that compression coil that Kaylee's always going on about? Well it busted, and we are driftin'. And in deep space too. Can things get any worse?",
    setupDescription: "Continue with the crew and items you acquired after completing Jaynestown. This Story can take place in any empty sector.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 9,
    campaignSetupNotes: ['ANY_SECTOR_PLACEMENT']
  },
  {
    title: "Racing A Pale Horse",
    intro: "The Operative has your scent. He's closing in on your home, and nothing can stop him. Well, maybe nothing except Glücklich Jiã's prototype next-gen artillery cannon...",
    setupDescription: "Place your Haven at Deadwood, Blue Sun. If you end your turn at your Haven, remove Disgruntled from all Crew. Do not use a Timer for this game.",
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
      title: "Automated Movement"
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
      { type: 'addFlag', flag: 'startWithAlertCard' }
    ]),
    advancedRule: {
      id: "adv_contact_quirks_deal",
      title: "Contact Quirks - Deal"
    }
  },
  {
    title: "Safe",
    intro: "The crew of Serenity find themselves on Jiangyin, where Mal is selling livestock to the Grange Brothers. Just as business is about to be concluded, the law shows up. To complicate things more, Simon and River are missing.",
    setupDescription: "Continue with the crew and items you acquired after completing Shindig. Requires FAKE ID.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 6,
    campaignSetupNotes: ['FAKE_ID_REQUIRED']
  },
  {
    title: "Seeds Of Rebellion",
    intro: "The New Resistance is ready to open up some eyes and change a few hearts. They need a savvy captain to deliver key personnel to the heart of Alliance space.",
    setupDescription: "Harken Forbidden: You may not deal with, or be Solid with Harken. Resistance Missions: Place Harken's 7 Immoral Transport Jobs in a separate discard pile to represent New Resistance Missions.",
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
      title: "Lost Little Lambs"
    }
  },
  {
    title: "Serenity Movie Part 1",
    intro: "Against Simon's objections, Mal takes River along on a bank robbery because, in his words, \"She might see trouble before it's coming\". Just as the crew reach the vault, the town is attacked by Reavers.",
    setupDescription: "Continue with the crew and items you acquired after completing Objects in Space. Remove Inara and Shepherd Book from the game. Requires Transport.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 16,
    campaignSetupNotes: ['REMOVE_INARA_AND_BOOK', 'TRANSPORT_REQUIRED']
  },
  {
    title: "Serenity Movie Part 2",
    intro: "On Miranda a weak distress beacon leads the crew to a research shuttle and a recording that shows Miranda was an Alliance population control experiment that went horribly wrong, killing millions and creating the Reavers!",
    setupDescription: "Continue with the crew and items you acquired after completing Serenity Movie Part 1. Remove Disgruntled Tokens from all crew. Inara rejoins the crew at this point.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 17,
    campaignSetupNotes: ['INARA_REJOINS', 'REMOVE_DISGRUNTLED']
  },
  {
    title: "Serenity Movie Part 3",
    intro: "On Miranda a weak distress beacon leads the crew to a research shuttle and a recording that shows Miranda was an Alliance population control experiment that went horribly wrong, killing millions and creating the Reavers!",
    setupDescription: "Continue with the crew and items you acquired after completing Serenity Movie Part 2. Fully Equipped Med Bay may not be used. Suggested: Simon's Surgical Kit.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 18,
    campaignSetupNotes: ['NO_MED_BAY_SUGGEST_KIT']
  },
  {
    title: "Serenity Part 1",
    intro: "Mal Reynolds and the crew of the Firefly Class Transport Serenity are involved in illegally slavaging crates off an abandoned spaceship for Badger, a small-time crime boss on the planet persephone.",
    setupDescription: "Set up Serenity at Valentine with Malcolm, Zoe, Wash, Kaylee, Jaune, 1 Fuel, $500, Cry Baby, Expanded Crew Quarters. Load 2 Contra, then turn over a Nav Card.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 1,
    campaignSetupNotes: [
      'SERENITY_PART_1_CREW',
      'SERENITY_PART_1_RESOURCES',
      'SERENITY_PART_1_JOBS'
    ]
  },
  {
    title: "Serenity Part 2",
    intro: "Mal Reynolds and the crew of the Firefly Class Transport Serenity are despereately trying to sell contraband they found on an abandoned spaceship. Arriving at Whitefall, they need to deal with Patience.",
    setupDescription: "Continue with the crew and items you acquired after completing Serenity Part 1.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 2
  },
  {
    title: "Shindig",
    intro: "The crew of Serenity attends a high society ball - a \"Shindig\" Badger wants Mal to deal with Sir Warrick Harrow. Everything goes smoothly until Mal inadvertently challenges someone to a duel.",
    setupDescription: "Continue with the crew and items you acquired after completing Bushwhacked. Suggested: Kaylee's Fluffy Pink Dress. Required: Mal must wear FANCY DUDS throughout.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 5,
    campaignSetupNotes: ['SUGGEST_FANCY_DUDS']
  },
  {
    title: "They're Part Of My Crew",
    intro: "We all know Mal's got a good aim when it comes to misnehavin'. We also know Mal's stepped on quite a few tows with his misbehavin'. There's more than a few folk like to see him and his crew behind bars or six feet under. Regardless of who or what comes at Serenity, Mal's gonna do what he's always done. Protect his crew.",
    isSolo: true,
    goals: [
      {
        title: "Free Your Crew",
        description: "Once the 7-turn timer is up, you must immediately fly to Londinium and proceed past 5 negotiation skill checks to free your crew from the Alliance prison. If you are successful, you have won the game."
      }
    ],
    rules: createStoryRules("They're Part Of My Crew", [
      { 
        type: 'modifyResource', 
        resource: 'credits', 
        method: 'set', 
        value: 1000, 
        description: "Story Funds" 
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: "Story Setup",
          content: [
            { type: 'paragraph', content: ['Use ', { type: 'strong', content: 'Malcolm' }, ' as your Leader and ', { type: 'strong', content: 'Serenity' }, ' as your ship.'] },
            { type: 'paragraph', content: ['Your starting crew is: ', { type: 'strong', content: 'Zoë, Wash, Jayne, Kaylee, Inara, Book, Simon, and River' }, '.'] },
            { type: 'paragraph', content: ['Take 1 ', { type: 'strong', content: 'Expanded Crew Quarters' }, ' from the Osiris Supply Deck.'] }
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: "Disgruntled Timer",
          content: [
            { type: 'paragraph', content: ['Collect ', { type: 'strong', content: '7 Disgruntled tokens' }, '. These will be used as a special game timer.'] },
            { type: 'paragraph', content: ['Discard 1 token at the start of each of your turns.'] },
          ]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/filepage/278719/solo-and-co-op-story-cards-focusing-on-the-crew-of",
    requiredExpansion: "community",
    requiredSetupCardId: SETUP_CARD_IDS.STANDARD,
  },
  {
    title: "The Train Job",
    intro: "Unification Day: six years since the Alliance won the war. The crew of Serenity are on a moon of Ariel in the White Sun system. Mal and the crew are relaxing in a local bar.",
    setupDescription: "Continue with the crew and items you acquired after completing Serenity Part 2. If you have the credits, a Fully Equipped Med Bay might also come in handy.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 3,
    campaignSetupNotes: ['SUGGEST_MED_BAY']
  },
  {
    title: "Trash",
    intro: "While overseeing a cargo transfer for a smuggling job, Mal runs into Saffron. Guns are drawn, but Saffron convinces Mal to get in on her plan t steal the Lassiter Laser Pistol - a priceless artifact.",
    setupDescription: "Continue with the crew and items you acquired after completing War Stories. Before starting, pick up Saffron on Newhope. Requires HACKING RIG.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 12,
    campaignSetupNotes: ['PICK_UP_SAFFRON', 'HACKING_RIG_REQUIRED']
  },
  {
    title: "War Stories",
    intro: "After a simple business deal goes badly wrong, Mal and Wash find themselves in the hands of Adelai Niska, who is still holding a grudge from an earlier encounter. The rest of the crew must mount a rescue.",
    setupDescription: "Continue with the crew and items you acquired after completing Ariel. Requires EXPLOSIVES.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 11,
    campaignSetupNotes: ['EXPLOSIVES_REQUIRED']
  },
  {
    title: "War Stories",
    intro: "Remember when Malcolm put Niska's man through an engine? Well, Niska remembers and now he's lookin' to kill some folk.",
    isSolo: true,
    setupDescription: "Fixed Assignment: Serenity's Crew. Game Timer (15 Disgruntled tokens). No starting cash. Niska jobs unavailable. Uses Standard Setup.",
    sourceUrl: "https://boardgamegeek.com/thread/3019475/war-stories-and-oh-captain-my-captain-story-cards",
    requiredExpansion: "community",
    rules: createStoryRules("War Stories", [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 0, description: "Story Funds" },
      { type: 'forbidContact', contact: CONTACT_NAMES.NISKA },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: "Fixed Assignment: Serenity's Crew",
          content: [
            { type: 'paragraph', content: ["Your assignment for this story is fixed. You do not perform the standard draft."] },
            {
              type: 'list',
              items: [
                ['Ship: ', { type: 'strong', content: 'Serenity' }],
                ['Leader: ', { type: 'strong', content: 'Malcolm Reynolds' }],
                ['Ship Upgrade: Equip one ', { type: 'strong', content: 'Expanded Crew Quarters' }, ' from the Osiris Supply Deck.'],
                ['Crew: Start play with the 9 original Serenity crew members.'],
              ]
            }
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Game Timer',
          content: ["Use ", { type: 'strong', content: '15 Disgruntled tokens' }, " as the game length timer. Discard one at the start of your turn."]
        }
      }
    ]),
    requiredSetupCardId: SETUP_CARD_IDS.STANDARD
  }
];
