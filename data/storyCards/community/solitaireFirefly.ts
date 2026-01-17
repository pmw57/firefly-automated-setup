import { StoryCardDef } from '../../../types';

export const SOLITAIRE_FIREFLY_STORIES: StoryCardDef[] = [
  {
    title: "Ariel",
    intro: "When River slashes Jayne's chest, Simon decides it's time to get serious about treating her. He hires the crew of Serenity to get him and River into a high-tech hospital on Ariel so he can see what the Alliance did to her.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 10,
    campaignSetupNotes: ['EXPLOSIVES_REQUIRED'],
    tags: ['community', 'classic_heist', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Out of Gas. Requires EXPLOSIVES."]
        },
        source: 'story', 
        sourceName: "Ariel"
      }
    ]
  },
  {
    title: "Bushwhacked",
    intro: "Serenity encounters a drifting spaceship of  a type which was converted to transport settlers to the Outer Planets. Mal decides to check out the derelict in order to either help survivors or loot the dead.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 4,
    tags: ['community', 'mystery', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing The Train Job."]
        },
        source: 'story', 
        sourceName: "Bushwhacked"
      }
    ]
  },
  {
    title: "Heart of Gold",
    intro: "Aboard Serenity, a crew member receives a distress call from a friend, Nandi, owner of a border moon bordello. Nandi asks for help dealing with a landowner named Burgess, who is victimizing one of her employees.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 14,
    tags: ['community', 'faction_war', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing The Message."]
        },
        source: 'story', 
        sourceName: "Heart of Gold"
      }
    ]
  },
  {
    title: "Jaynestown",
    intro: "On Higgins' Moon, Inara meets the son of Magistrate Higgins. The rest of the crew is in search of loot. Meanwhile, One of the crew worries that his past misdeeds on Higgins' Moon might catch up with him.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 8,
    campaignSetupNotes: ['SUGGEST_NEGOTIATION_GEAR'],
    tags: ['community', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Our Mrs. Reynolds. You may want to get Jayne some negotiation gear, or things could go badly."]
        },
        source: 'story', 
        sourceName: "Jaynestown"
      }
    ]
  },
  {
    title: "The Message",
    intro: "Amnon Duul has a crate for Mal. Inside is the body of Tracey, a man Mal knew during the war. The crew take the crate aboard Serenity and plan to take it home for burial, but now corrupt police are in pursuit.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 13,
    campaignSetupNotes: ['START_AT_SPACE_BAZAAR', 'SUGGEST_MED_BAY_AND_HAT'],
    tags: ['community', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Trash. Start the Story at the Space Bazaar. Suggested: Fully Equipped Med Bay. Take Jayne's \"Cunning\" Hat."]
        },
        source: 'story', 
        sourceName: "The Message"
      }
    ]
  },
  {
    title: "Objects in Space",
    intro: "With the crew asleep, Jubel Early, a bounty hunter, sneaks aboard Serenity. He has been paid to abduct River Tam. He locks most of the crew in their cabins. However, River has disappeared.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 15,
    campaignSetupNotes: ['ANY_SECTOR_PLACEMENT_WITH_CREW_NOTE'],
    tags: ['community', 'survival', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Heart of Gold. This Story can take place in any sector. If a named Crew is missing, choose another Crew."]
        },
        source: 'story', 
        sourceName: "Objects in Space"
      }
    ]
  },
  {
    title: "Our Mrs. Reynolds",
    intro: "The crew of Serenity have agrees to help rid a settlement on Triumph of its bandit problem. The community can't pay, but promises the crew a big party and whatever other presents they can give.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 7,
    campaignSetupNotes: ['SUGGEST_BONNET_VERA'],
    tags: ['community', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Safe Suggested: Mal's Pretty Floral Bonnet & Vera."]
        },
        source: 'story', 
        sourceName: "Our Mrs. Reynolds"
      }
    ]
  },
  {
    title: "Out of Gas",
    intro: "Something has gone terribly wrong on Serenity. Remember that compression coil that Kaylee's always going on about? Well it busted, and we are driftin'. And in deep space too. Can things get any worse?",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 9,
    campaignSetupNotes: ['ANY_SECTOR_PLACEMENT'],
    tags: ['community', 'survival', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Jaynestown. This Story can take place in any empty sector."]
        },
        source: 'story', 
        sourceName: "Out of Gas"
      }
    ]
  },
  {
    title: "Safe",
    intro: "The crew of Serenity find themselves on Jiangyin, where Mal is selling livestock to the Grange Brothers. Just as business is about to be concluded, the law shows up. To complicate things more, Simon and River are missing.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 6,
    campaignSetupNotes: ['FAKE_ID_REQUIRED'],
    tags: ['community', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Shindig. Requires FAKE ID."]
        },
        source: 'story', 
        sourceName: "Safe"
      }
    ]
  },
  {
    title: "Serenity Movie Part 1",
    intro: "Against Simon's objections, Mal takes River along on a bank robbery because, in his words, \"She might see trouble before it's coming\". Just as the crew reach the vault, the town is attacked by Reavers.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 16,
    campaignSetupNotes: ['REMOVE_INARA_AND_BOOK', 'TRANSPORT_REQUIRED'],
    tags: ['community', 'classic_heist', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Objects in Space. Remove Inara and Shepherd Book from the game. Requires Transport."]
        },
        source: 'story', 
        sourceName: "Serenity Movie Part 1"
      }
    ]
  },
  {
    title: "Serenity Movie Part 2",
    intro: "On Miranda a weak distress beacon leads the crew to a research shuttle and a recording that shows Miranda was an Alliance population control experiment that went horribly wrong, killing millions and creating the Reavers!",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 17,
    campaignSetupNotes: ['INARA_REJOINS', 'REMOVE_DISGRUNTLED'],
    tags: ['community', 'mystery', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Serenity Movie Part 1. Remove Disgruntled Tokens from all crew. Inara rejoins the crew at this point."]
        },
        source: 'story', 
        sourceName: "Serenity Movie Part 2"
      }
    ]
  },
  {
    title: "Serenity Movie Part 3",
    intro: "On Miranda a weak distress beacon leads the crew to a research shuttle and a recording that shows Miranda was an Alliance population control experiment that went horribly wrong, killing millions and creating the Reavers!",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 18,
    campaignSetupNotes: ['NO_MED_BAY_SUGGEST_KIT'],
    tags: ['community', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Serenity Movie Part 2. Fully Equipped Med Bay may not be used. Suggested: Simon's Surgical Kit."]
        },
        source: 'story', 
        sourceName: "Serenity Movie Part 3"
      }
    ]
  },
  {
    title: "Serenity Part 1",
    intro: "Mal Reynolds and the crew of the Firefly Class Transport Serenity are involved in illegally slavaging crates off an abandoned spaceship for Badger, a small-time crime boss on the planet persephone.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 1,
    tags: ['community', 'smugglers_run', 'character', 'against_the_black', 'solo'],
    campaignSetupNotes: [
      'SERENITY_PART_1_CREW',
      'SERENITY_PART_1_RESOURCES',
      'SERENITY_PART_1_JOBS'
    ],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Set up Serenity at Valentine with Malcolm, Zoe, Wash, Kaylee, Jaune, 1 Fuel, $500, Cry Baby, Expanded Crew Quarters. Load 2 Contra, then turn over a Nav Card."]
        },
        source: 'story', 
        sourceName: "Serenity Part 1"
      }
    ]
  },
  {
    title: "Serenity Part 2",
    intro: "Mal Reynolds and the crew of the Firefly Class Transport Serenity are despereately trying to sell contraband they found on an abandoned spaceship. Arriving at Whitefall, they need to deal with Patience.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 2,
    tags: ['community', 'smugglers_run', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Serenity Part 1."]
        },
        source: 'story', 
        sourceName: "Serenity Part 2"
      }
    ]
  },
  {
    title: "Shindig",
    intro: "The crew of Serenity attends a high society ball - a \"Shindig\" Badger wants Mal to deal with Sir Warrick Harrow. Everything goes smoothly until Mal inadvertently challenges someone to a duel.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 5,
    campaignSetupNotes: ['SUGGEST_FANCY_DUDS'],
    tags: ['community', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Bushwhacked. Suggested: Kaylee's Fluffy Pink Dress. Required: Mal must wear FANCY DUDS throughout."]
        },
        source: 'story', 
        sourceName: "Shindig"
      }
    ]
  },
  {
    title: "The Train Job",
    intro: "Unification Day: six years since the Alliance won the war. The crew of Serenity are on a moon of Ariel in the White Sun system. Mal and the crew are relaxing in a local bar.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 3,
    campaignSetupNotes: ['SUGGEST_MED_BAY'],
    tags: ['community', 'classic_heist', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Serenity Part 2. If you have the credits, a Fully Equipped Med Bay might also come in handy."]
        },
        source: 'story', 
        sourceName: "The Train Job"
      }
    ]
  },
  {
    title: "Trash",
    intro: "While overseeing a cargo transfer for a smuggling job, Mal runs into Saffron. Guns are drawn, but Saffron convinces Mal to get in on her plan t steal the Lassiter Laser Pistol - a priceless artifact.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 12,
    campaignSetupNotes: ['PICK_UP_SAFFRON', 'HACKING_RIG_REQUIRED'],
    tags: ['community', 'classic_heist', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing War Stories. Before starting, pick up Saffron on Newhope. Requires HACKING RIG."]
        },
        source: 'story', 
        sourceName: "Trash"
      }
    ]
  },
  {
    title: "War Stories",
    intro: "After a simple business deal goes badly wrong, Mal and Wash find themselves in the hands of Adelai Niska, who is still holding a grudge from an earlier encounter. The rest of the crew must mount a rescue.",
    sourceUrl: "https://boardgamegeek.com/filepage/114133/ten-percent-of-nothin-expansion",
    requiredExpansion: "community",
    isSolo: true,
    requiredFlag: 'isSolitaireFirefly',
    sortOrder: 11,
    campaignSetupNotes: ['EXPLOSIVES_REQUIRED'],
    tags: ['community', 'jailbreak', 'character', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: ["Continue with the crew and items you acquired after completing Ariel. Requires EXPLOSIVES."]
        },
        source: 'story', 
        sourceName: "War Stories"
      }
    ]
  },
];