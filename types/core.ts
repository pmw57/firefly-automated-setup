// This file contains core, low-level type definitions for content structures
// that are used across UI, rules, and data layers.

export type StructuredContentPart =
  | string
  | { type: 'strong'; content: string }
  | { type: 'action'; content: string }
  | { type: 'br' }
  | { type: 'list'; items: StructuredContent[] }
  | { type: 'numbered-list'; items: StructuredContent[] }
  | { type: 'paragraph'; content: StructuredContent }
  | { type: 'warning-box'; content: StructuredContent }
  | { type: 'sub-list'; items: { ship: string }[] };

export type StructuredContent = StructuredContentPart[];

export interface SpecialRule {
    source: 'story' | 'setupCard' | 'expansion' | 'warning' | 'info';
    title: string;
    content: StructuredContent;
}
