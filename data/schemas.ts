
import { z } from 'zod';

// Dynamic list of valid expansion IDs for validation
const ExpansionIdEnum = z.enum([
    'base', 'breakin_atmo', 'big_damn_heroes', 'blue', 'kalidasa', 
    'pirates', 'crime', 'coachworks', 'tenth', 'aces_eights', 
    'white_lightning', 'cantankerous', 'huntingdons_bolt', 
    'black_market', 'still_flying', 'community', 'local_color'
]);

const RuleSourceEnum = z.enum(['story', 'setupCard', 'expansion', 'warning', 'info']);

// Basic Rule Schema (Simplified for validation purposes)
const SetupRuleSchema = z.object({
    type: z.string(),
    source: RuleSourceEnum.optional(), // Source is often injected at runtime, so optional in data
    sourceName: z.string().optional(),
    criteria: z.object({
        requireExpansion: ExpansionIdEnum.optional(),
        excludeExpansion: ExpansionIdEnum.optional()
    }).optional()
}).passthrough(); // Allow specific rule fields (mode, contacts, etc)

export const StoryCardSchema = z.object({
    title: z.string().min(1),
    intro: z.string(),
    setupDescription: z.string().optional(),
    requiredExpansion: ExpansionIdEnum.optional(),
    additionalRequirements: z.array(ExpansionIdEnum).optional(),
    sourceUrl: z.string().url().optional(),
    goals: z.array(z.object({
        title: z.string(),
        description: z.string()
    })).optional(),
    isSolo: z.boolean().optional(),
    isCoOp: z.boolean().optional(),
    isPvP: z.boolean().optional(),
    playerCount: z.union([z.number(), z.array(z.number())]).optional(),
    maxPlayerCount: z.number().optional(),
    challengeOptions: z.array(z.object({
        id: z.string(),
        label: z.string()
    })).optional(),
    rules: z.array(SetupRuleSchema).optional(),
    sortOrder: z.number().optional(),
    rating: z.number().min(0).max(5).optional(),
    tags: z.array(z.string()).optional()
});

export const SetupCardSchema = z.object({
    id: z.string(),
    label: z.string(),
    description: z.string().optional(),
    requiredExpansion: ExpansionIdEnum.optional(),
    steps: z.array(z.object({
        id: z.string(),
        title: z.string(),
        page: z.union([z.number(), z.string()]).optional(),
        manual: z.string().optional()
    })),
    mode: z.enum(['multiplayer', 'solo']).optional(),
    isCombinable: z.boolean().optional(),
    rules: z.array(SetupRuleSchema).optional()
});
