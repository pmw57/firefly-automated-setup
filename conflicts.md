# Known Rule Conflicts

This document outlines the known combinations of Setup Cards and Story Cards that result in conflicting rules. When "Manual Conflict Resolution" is enabled in the Optional Rules, the app will allow you to choose which rule to follow. Otherwise, the Story Card's rule is given priority by default.

---

## 1. Starting Credits Conflicts

This conflict occurs when a Story Card sets an absolute starting credit amount (`startingCreditsOverride`), and is paired with "The Browncoat Way" Setup Card, which also sets a specific starting credit amount.

- **Setup Card:** `The Browncoat Way` (Rule: **$12,000 Starting Capitol**)
- **Conflicting Story Cards:**
    - `Heroes & Misfits` (Rule: **$2,000 Starting Capitol**)
    - `How It All Started` (Rule: **$500 Starting Capitol**)

---

## 2. Ship & Haven Placement Conflicts

This conflict occurs when the "Home Sweet Haven" Setup Card, which requires players to draft and place Havens to determine starting locations, is paired with a Story Card that dictates a single, fixed starting location for all players.

- **Setup Card:** `Home Sweet Haven` (Rule: *Players place their own Havens*)
- **Conflicting Story Cards:**
    - `Heroes & Misfits` (Rule: *Start at Persephone*)
    - `It's a Mad, Mad, Mad, Mad 'Verse!` (Rule: *Start at Persephone*)
    - `The Lonely Smuggler's Blues` (Rule: *Start at Londinium*)
    - `Smuggler's Blues` (Rule: *Start at Londinium*)
    - `Shadows Over Duul` (Rule: *Start at Border of Murphy*)

---

## 3. Starting Jobs Conflicts

This conflict occurs when a Setup Card and a Story Card both specify different rules for how starting jobs are determined.

#### Conflict Group A: Story Cards with Unique Job Mechanics

The following Setup Cards conflict with any Story Card that introduces a unique job mechanic (like starting with a Caper, placing Goal Tokens, or drafting Contact Decks):

- **Conflicting Story Cards:**
    - `A Rare Specimen Indeed` (Rule: *Start with 1 Caper Card*)
    - `Where The Wind Takes Us` (Rule: *Place Goal Tokens instead*)
    - `A Friend In Every Port` (Rule: *Draft Contact Decks*)

- **Setup Cards that conflict with the above:**
    - `The Browncoat Way` (Rule: *No Starting Jobs*)
    - `Time's Not On Our Side` (Rule: *Draw 3 from any 1 Contact*)
    - `Alliance High Alert` (Rule: *Draw 3 from any Contacts*)
    - `Ain't All Buttons & Charts` (Rule: *Draw from specific Contacts + Caper*)
    - `Awful Crowded In My Sky` (Rule: *Draw from specific Contacts*)
    - `The Rim's The Thing` (Rule: *Draw from Rim Contacts*)

#### Conflict Group B: Setup Cards vs. "No Jobs" Stories

The following Story Cards mandate *No Starting Jobs*. This conflicts with any Setup Card that *does* provide starting jobs.

- **Conflicting Story Cards:**
    - `Smuggler's Blues`
    - `It's All In Who You Know`
    - `The Magnificent Crew`

- **Setup Cards that conflict with the above:**
    - `Time's Not On Our Side`
    - `Alliance High Alert`
    - `Ain't All Buttons & Charts`
    - `Awful Crowded In My Sky`
    - `The Rim's The Thing`
    - (*Note: Does not conflict with `The Browncoat Way` as both result in no jobs.*)
