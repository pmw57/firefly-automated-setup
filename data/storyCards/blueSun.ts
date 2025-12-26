
// FIX: Changed import from '../../types' to '../../types/index' to fix module resolution ambiguity.
import { StoryCardDef } from '../../types/index';

export const BLUE_SUN_STORIES: StoryCardDef[] = [
  {
    title: "Any Port In A Storm",
    intro: "The Alliance has got a burr in their collective britches: patrols have been tripled and strict enforcement of penal codes is in effect. Times such as these can make for strange bedfellows and safe harbor is where you can find it. Any port in a storm...",
    requiredExpansion: "blue",
    sourceUrl: "https://boardgamegeek.com/image/2785044/gerryrailbaron"
  },
  {
    title: "The Great Recession",
    intro: "Life on the raggedy edge can be a hard slog. Paying work is precious enough in the good times, but when things get lean the competition for jobs can get downright unsavory. Make hay while the sun shines or get left in the dust, beggin' for scraps.",
    requiredExpansion: "blue",
    sourceUrl: "https://boardgamegeek.com/image/2785041/gerryrailbaron"
  },
];