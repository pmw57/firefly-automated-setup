// This file contains core, low-level type definitions for content structures
// that are used across UI, rules, and data layers.

export type ThemeColor = 'steelBlue' | 'black' | 'darkSlateBlue' | 'deepBrown' | 'rebeccaPurple' | 'cordovan' | 'darkOliveGreen' | 'saddleBrown' | 'teal' | 'dark' | 'cyan' | 'tan' | 'mediumPurple' | 'gamblingGreen' | 'darkGoldenRod';

export type StructuredContentPart =
  | string
  | { type: 'strong'; content: string }
  | { type: 'action'; content: string }
  | { type: 'br' }
  | { type: 'list'; items: StructuredContent[] }
  | { type: 'numbered-list'; items: StructuredContent[] }
  | { type: 'paragraph'; content: StructuredContent }
  | { type: 'paragraph-small-italic'; content: StructuredContent }
  | { type: 'warning-box'; content: StructuredContent }
  | { type: 'sub-list'; items: { ship: string; color: ThemeColor }[] }
  | { type: 'placeholder'; id: string };

export type StructuredContent = StructuredContentPart[];

export interface SpecialRule {
    source: 'story' | 'setupCard' | 'expansion' | 'warning' | 'info';
    title?: string;
    content: StructuredContent;
    badge?: string;
    // The `page` and `manual` properties are optional for compatibility with the PageReference component.
    page?: string | number;
    manual?: string;
    flags?: string[];
    // Controls where this rule content appears relative to the standard component content
    position?: 'before' | 'after';
    // Visual properties for board setup components
    icon?: string;
    locationTitle?: string;
    locationSubtitle?: string;
}