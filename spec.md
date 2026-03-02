# Jigsolitaire

## Overview

Jigsolitaire is a relaxing photo jigsaw puzzle game built on the Internet Computer. Players authenticate via Internet Identity and reconstruct beautiful photographs by swapping scrambled tiles on a grid. The game features 50 themed photo collections with 5 puzzles each (250 total), a star-based progression system, daily puzzles, achievements, a photo gallery, and custom photo uploads. All game logic (tile swapping, locking, scrambling) runs client-side; the Motoko backend persists progress, coins, hints, and achievements via orthogonal persistence.

## Authentication

- Users authenticate via Internet Identity with a popup login flow
- Anonymous access is not permitted for any backend operations
- Identity persists across sessions (30-day delegation lifetime)
- User data is isolated by principal
- On first login, users must set a display name before proceeding (non-dismissible dialog)

### Profile

- Name is required, cannot be empty
- Maximum 100 characters
- Displayed in the header with avatar dropdown for editing and logout

## Core Features

### Puzzle Gameplay

Players solve puzzles by swapping tiles to reconstruct a photo:

- Image is sliced into a grid of square tiles (3x3, 4x4, or 5x5) using canvas
- Tiles are scrambled into a derangement (no tile starts in its correct position)
- Two interaction modes:
  - **Tap-to-swap**: Tap a tile to select it (highlighted border), tap another to swap
  - **Drag-to-swap**: HTML5 drag-and-drop on desktop; touch drag with ghost element on mobile
- When a tile lands in its correct grid position, it locks in place with a glow and bounce animation
- Locked tiles cannot be moved; tapping a locked tile triggers a shake animation and sound
- Puzzle completes when all tiles are locked

### Difficulty Progression

Each theme has 5 puzzles with fixed difficulty:

| Puzzle | Difficulty | Grid Size |
| ------ | ---------- | --------- |
| 1-2    | Easy       | 3x3       |
| 3-4    | Medium     | 4x4       |
| 5      | Hard       | 5x5       |

Puzzles within a theme unlock sequentially — completing puzzle N unlocks puzzle N+1.

### Theme Progression

- 50 themes organized into 9 categories (Nature & Landscapes, Animals & Wildlife, Architecture & Cities, Art & Design, Food & Drink, Travel & Adventure, Seasons & Weather, Abstract & Creative, Lifestyle)
- Themes unlock based on total stars earned across all themes
- Unlock costs range from 0 (Nature, free) to 288 stars (Books)
- 6 progression tiers: Free/Cheap (0-16), Early (20-47), Mid (52-97), Mid-Late (103-163), Late (170-240), Endgame (248-288)

### Scoring

- **Stars**: Based on move count relative to optimal (grid size squared)
  - 3 stars: moves <= optimal
  - 2 stars: moves <= 2x optimal
  - 1 star: moves > 2x optimal
- **Coins**: 10 base + 10 no-hints bonus + 10 timed completion bonus (when under time threshold)
- **Theme completion bonus**: +50 coins when completing all 5 puzzles in a theme for the first time
- On replay, stars update only if the new result is better; coins are always awarded

### Timed Mode

- Optional per-player toggle on the puzzle list screen (persisted in localStorage)
- Elapsed timer displayed in the game toolbar when enabled
- Time bonus thresholds for +10 coins:
  - 3x3: 60 seconds
  - 4x4: 120 seconds
  - 5x5: 180 seconds
- Best times tracked per puzzle; updated only when timed and better than previous

### Hint System

- New players start with 3 hints, maximum 5 hints
- Using a hint auto-places a random wrong tile in its correct position
- The displaced tile may also land correctly (bonus lock)
- Hint actions cannot be undone
- Hint regeneration: 1 free hint every 2 hours (materialized on use/buy, not real-time)
- Buy hint: costs 100 coins (requires < 5 current hints)
- Buy hint dialog shows cost, current balance, and regeneration countdown timer

### Undo

- Counts as a move
- Clears after use (cannot undo twice)

### Preview Overlay

- Semi-transparent (30% opacity) full image overlaid on the puzzle board
- Toggled via toolbar button
- Disabled on Hard difficulty (5x5 puzzles)
- Disabled when using fallback tiles (image load failure)

### Reference Image

- Opens a dialog modal with the full puzzle image
- Accessible via toolbar eye icon
- Available on all difficulties

### Daily Puzzle

- One puzzle per day, deterministic for all users
- Selection: DJB2 hash of UTC date string ("YYYY-MM-DD") selects from a flat pool of all 260 puzzles
- Grid size cycles through [3, 4, 5, 4] based on hash
- One completion per day enforced by backend (`lastDailyDay` integer = day number since epoch)
- Coins: 10 base + 10 no-hints bonus (no timed bonus)
- Does not count toward theme progression or achievements
- "Completed" badge shown on home menu button when done today
- Bypasses theme unlock checks

### Gallery

- Grid of completed puzzle thumbnails grouped by category and theme
- Collapsible category sections with completion progress count (e.g., "12/25 photos")
- Completed puzzles show full image; uncompleted show blurred/locked placeholder
- Tapping a completed photo opens a full-size dialog
- Total collected count shown in header

### Achievements

9 achievements, checked on `completePuzzle` (not daily puzzles):

| ID            | Name          | Trigger                                          |
| ------------- | ------------- | ------------------------------------------------ |
| first_steps   | First Steps   | Solve any puzzle for the first time              |
| theme_master  | Theme Master  | Complete all 5 puzzles in a theme                |
| speed_demon   | Speed Demon   | Complete any puzzle in under 60 seconds          |
| perfectionist | Perfectionist | Earn 3 stars on all 5 puzzles in a theme         |
| collector     | Collector     | Complete 10 puzzles across all themes            |
| hint_free     | Hint-Free     | Complete a hard puzzle (5x5) with 0 hints        |
| explorer      | Explorer      | Solve puzzles in 10 different themes             |
| globetrotter  | Globetrotter  | Complete all 5 puzzles in 25 themes              |
| completionist | Completionist | Complete every puzzle in every theme (50 themes) |

Newly unlocked achievements display as full-screen cards before the completion card.

### Custom Photo Upload

- Users upload JPEG, PNG, or WebP images (max 5MB raw)
- Client-side processing: center-crop to square, resize to 600x600, export as JPEG at 0.85 quality
- Stored via Caffeine blob storage (`Storage.ExternalBlob`)
- Maximum 50 images per user
- Image names: max 50 characters, derived from filename (extension stripped)
- Rename and delete supported with confirmation dialogs
- Grid size picker dialog (3x3/4x4/5x5) before playing
- Custom puzzles are freeplay: no coins awarded, no theme/achievement progress, no timed mode

## Backend Data Storage

### Types

- **`UserProfile`**: `{ name: Text }`
- **`PuzzleResult`**: `{ stars: Nat, bestTime: Nat }` — bestTime = 0 if never completed in timed mode
- **`ThemeData`**: `{ puzzleResults: [PuzzleResult] }` — array length = number of completed puzzles in theme
- **`UserProgress`**: `{ coins: Nat, hints: Nat, lastHintRegenTime: Int, themeProgress: [(ThemeId, ThemeData)], achievements: [Text], lastDailyDay: Nat }`
- **`UserImage`**: `{ id: Nat, name: Text, blob: Storage.ExternalBlob, createdAt: Int }`

### State

- `userProfiles`: `Map<Principal, UserProfile>`
- `gameProgress`: `Map<Principal, UserProgress>`
- `userImages`: `Map<Principal, Map<Nat, UserImage>>`
- `userNextImageId`: `Map<Principal, Nat>` — per-user ID counter

### Constants

- `TWO_HOURS`: 7,200,000,000,000 nanoseconds
- `MAX_HINTS`: 5
- `HINT_COST`: 100 coins
- `NANOS_PER_DAY`: 86,400,000,000,000 nanoseconds
- Time bonus thresholds: 60s (3x3), 120s (4x4), 180s (5x5)

### Default Progress

New users start with: 9999 coins, 3 hints, no theme progress, no achievements, lastDailyDay = 0.

## Backend Operations

| Endpoint                                                                                     | Type   | Description                                                              |
| -------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------ |
| `getProfile()`                                                                               | query  | Returns caller's profile or null                                         |
| `setProfile(name)`                                                                           | update | Sets display name (non-empty, max 100 chars)                             |
| `getProgress()`                                                                              | query  | Returns progress with materialized hint regen; defaults for new users    |
| `startPuzzle(themeId, puzzleIndex, gridSize)`                                                | update | Validates access (theme unlock + sequential puzzle unlock)               |
| `completePuzzle(themeId, puzzleIndex, hintsUsed, timeSec, gridSize, moves, timedCompletion)` | update | Returns `(coinsEarned, stars, isFirstTime, newAchievements)`             |
| `completeDailyPuzzle(hintsUsed, timeSec, gridSize, moves)`                                   | update | Returns `(coinsEarned, stars)`; enforces one per day                     |
| `useHint()`                                                                                  | update | Decrements hints (materializes regen first); traps if 0                  |
| `buyHint()`                                                                                  | update | Costs 100 coins; traps if insufficient coins or already at max (5) hints |
| `uploadImage(name, blob)`                                                                    | update | Stores image; traps if name empty/over 50 chars or over 50 images        |
| `getMyImages()`                                                                              | query  | Returns all caller's custom images                                       |
| `renameImage(imageId, newName)`                                                              | update | Updates image name; traps if not found or name invalid                   |
| `deleteImage(imageId)`                                                                       | update | Removes image entry; blob GC handled by infrastructure                   |

### Key Backend Logic

**Hint Regeneration** (`materializeHints`):

- Computes `regenCount = elapsed / TWO_HOURS`, caps total at MAX_HINTS
- When at max: resets regen timer to now (stops counting while full)
- When partial regen: advances timer by exactly `regenCount * TWO_HOURS` (not to now)
- Guards against time moving backward (elapsed < 0)

**Puzzle Access** (`requirePuzzleAccess`):

- Theme unlock: total stars across all themes must meet theme's unlock cost
- Sequential unlock: `puzzleIndex > 0` requires `puzzleResults.size() >= puzzleIndex`

**Puzzle Completion** (`completePuzzle`):

- First-time: `puzzleIndex >= puzzleResults.size()` — appends new result
- Replay: updates only if stars are better (`Nat.max`); best time updated only if timed and better
- Theme completion bonus (+50 coins) only on puzzle index 4 and first time
- Achievement diff: returns only newly awarded achievements

**Daily Puzzle** (`completeDailyPuzzle`):

- Day number = `Int.abs(Time.now()) / NANOS_PER_DAY`
- Traps if `lastDailyDay == today`
- No timed bonus; no theme progress updates

## User Interface

### Screens (React state machine, no URL router)

Navigation flow: `home → themeSelect → puzzleList → game → completion`

Also: `home → dailyGame`, `home → gallery`, `home → achievements`, `home → customPhotos → customGame`

### Auth Gate (App.tsx)

Four stages: initializing (spinner) → unauthenticated (landing page) → actor loading (spinner) → authenticated app

### Landing Page

- App title "Jigsolitaire" with "Jig" in primary color
- "piece by piece" tagline
- Mosaic grid animation and floating puzzle piece icons
- "Start Puzzling" button with loading state during login
- Theme toggle (light/dark)

### Home Menu

- Title "JIGSOLITAIRE" with animated floating pieces
- Navigation buttons: Play, Daily Puzzle (with "Completed" badge), Achievements, Gallery, My Photos
- Stats bar: Stars, Coins, Hints, Solved count

### Header

- Persistent across all authenticated screens
- Coins display
- Settings gear (opens settings dialog)
- Profile avatar dropdown (edit name, logout)

### Settings Dialog

- Sound effects toggle (localStorage-persisted)
- Music toggle (localStorage-persisted)
- Theme toggle (dark/light)

### Theme Select

- Themes grouped by category with collapsible sections
- Each theme card shows: thumbnail, name, completion progress, lock/unlock overlay with star cost

### Puzzle List

- 5 puzzle rows per theme
- Each row: thumbnail, puzzle name, difficulty badge (Easy/Medium/Hard), star rating, best time, lock icon
- Timed mode toggle (localStorage-persisted)

### Game Screen

- Image loading with fallback colored tiles on failure
- Top bar: back button, theme name, puzzle position (e.g., "3/5"), difficulty badge
- Puzzle board (CSS grid)
- Game toolbar: move counter, timer (timed mode), undo, hint, preview overlay, reference image
- Leave confirmation dialog when navigating away mid-puzzle

### Completion Overlay

- Achievement cards displayed sequentially (tap to advance), then completion card
- Completion card: full completed image, time, moves, stars (1-3), coins breakdown
- Buttons: "Next Puzzle" (if available) and "Back to Levels"
- Warm glow background animation

### Gallery

- Grouped by category with collapsible sections
- Completed puzzles: full image thumbnail, tappable to view full-size
- Uncompleted: blurred/locked placeholder
- Total collected count in header

### Achievements

- Stats dashboard with overall progress
- Badge grid showing all 9 achievements (earned vs locked state)

### Custom Photos

- Upload button with progress toast
- Photo grid (3-4 columns) with play, rename, delete actions per image
- Grid size picker dialog before playing
- Delete confirmation dialog
- Rename dialog with text input

## Design System

- **Aesthetic**: Warm, relaxing puzzle theme
- **Light mode**: Warm cream background (#faf6f0), teal primary (#5a9e8f)
- **Dark mode**: Dark navy background (#151a24), same teal primary
- **Fonts**: Fredoka (display), Geist (sans), Noto Serif Georgian (serif), JetBrains Mono (mono)
- **Animations**: Title bounce, tile pop spring, floating pieces, staggered fade-ups, completion glow, tile lock bounce, shake on locked tap
- **Audio**: Tone.js-based sound effects (select, swap, lock, complete, hint, undo, locked tap, navigation) and ambient background music
- **Components**: shadcn/ui (Button, Dialog, AlertDialog, Badge, Tooltip, Input, Label, ScrollArea) with next-themes

## Error Handling

- **Authentication**: Backend traps with "Not authenticated" for anonymous callers
- **Profile validation**: "Name cannot be empty", "Name must be 100 characters or fewer"
- **Puzzle access**: "Theme not unlocked", "Puzzle not unlocked" when requirements not met
- **Hints**: "No hints available" (use at 0), "Not enough coins" (buy with < 100 coins), "Already at max hints" (buy at 5)
- **Images**: "Name cannot be empty", "Name must be 50 characters or fewer", "Maximum of 50 images allowed", "Image not found"
- **Daily puzzle**: "Daily puzzle already completed today"
- **Grid size**: "Invalid grid size" (not 3, 4, or 5)
- **Frontend**: Query error states rendered with destructive text; mutations show toast notifications on success/error; AlertDialog buttons disabled during pending state
