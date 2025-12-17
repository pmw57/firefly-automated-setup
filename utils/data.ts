import { StoryCardConfig, StoryFlag } from '../types';

export const hasFlag = (config: StoryCardConfig | undefined, flag: StoryFlag): boolean => {
    return config?.flags?.includes(flag) ?? false;
};
