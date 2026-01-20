import { StoryCardDef } from '../../types';

export const PIRATES_STORIES: StoryCardDef[] = [
  {
    title: "...Another Man's Treasure",
    isPvP: true,
    intro: "Wealth can be measured in many ways. In some parts of the 'Verse Alliance credits ain't worth the paper they're printed on. For those regions, a more practical measure of wealth is required. Hoard a mountain of trade goods and spare parts, through any means necessary. Break contracts, steal from your rivals or just pick the bones. Anything goes!",
    requiredExpansion: "pirates",
    sourceUrl: "https://boardgamegeek.com/image/2785046/gerryrailbaron",
    setupDescription: "Choose Havens. Havens must be in Border Space. After taking starting Jobs, pull all remaining Piracy Jobs from the Contact Decks and place them in their discard piles. Reshuffle the Contact Decks.",
    tags: ['pvp'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft_placement',
        rule: { 
          content: ['⚠️ Restriction: Havens must be placed in Border Space.'],
          position: 'before'
        },
        source: 'story', 
        sourceName: "...Another Man's Treasure"
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: "Salvager's Stash",
          content: ["Choose Havens. Havens must be in Border Space."],
          flags: ['isHavenPlacement']
        },
        source: 'story', 
        sourceName: "...Another Man's Treasure"
      },
      { type: 'addFlag', flag: 'hasConditionalHavenPageReference', source: 'story', sourceName: "...Another Man's Treasure" },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Remove Piracy Jobs',
          content: ["After taking starting Jobs, pull all remaining Piracy Jobs from the Contact Decks and place them in their discard piles. Reshuffle the Contact Decks."]
        },
        source: 'story', 
        sourceName: "...Another Man's Treasure"
      },
      {
        type: 'setJobStepContent',
        position: 'after',
        content: [
          { type: 'strong', content: 'Remove Piracy Jobs' },
          {
            type: 'numbered-list',
            items: [
              ['Pull all remaining ', { type: 'strong', content: 'Piracy Jobs' }, ' from the Contact Decks.'],
              ['Place them in their ', { type: 'strong', content: 'discard piles' }, '.'],
              ['Reshuffle the Contact Decks.']
            ]
          }
        ],
        source: 'story',
        sourceName: "...Another Man's Treasure"
      }
    ]
  },
  {
    title: "Jail Break",
    intro: "Your friend has been pinched by the Alliance and you don't intend to let 'em twist. Bad plan's better than no plan...",
    requiredExpansion: "pirates",
    sourceUrl: "https://boardgamegeek.com/image/2785045/gerryrailbaron",
    tags: [
      "jailbreak"
    ],
    setupDescription: "During Leader selection, players also choose any card from the Bounty Deck. Pair each chosen Bounty with its associated Wanted Crew card and place the two cards next to the 'Verse;s Most Wanted List. They are prisoners of the Alliance!"
  },
  {
    title: "The Choices We Make",
    isPvP: true,
    intro: "The 'Verse is full of people trying to carve themselves a little slice, however they can. Even a good man can get turned about from time to time. The straight and narrow can get a might twisted when walkin' the raggedy edge. In the end, the mark a person leaves all comes down to the choices they make.",
    requiredExpansion: "pirates",
    sourceUrl: "https://boardgamegeek.com/image/2785051/gerryrailbaron",
    tags: ['pvp'],
    setupDescription: "After taking starting jobs, pull all remaining Piracy Jobs from the Contact Decks and place them in their discard piles."
  },
];