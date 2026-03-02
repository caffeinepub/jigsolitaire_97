import type { GridSize } from "./tileEngine";

export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTY_GRID_SIZE: Record<Difficulty, GridSize> = {
  easy: 3,
  medium: 4,
  hard: 5,
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

// Puzzles 1-2: Easy, 3-4: Medium, 5: Hard
const PUZZLE_DIFFICULTY_PROGRESSION: Difficulty[] = [
  "easy",
  "easy",
  "medium",
  "medium",
  "hard",
];

export function getPuzzleDifficulty(puzzleIndex: number): Difficulty {
  return PUZZLE_DIFFICULTY_PROGRESSION[puzzleIndex] ?? "hard";
}

export function getPuzzleGridSize(puzzleIndex: number): GridSize {
  return DIFFICULTY_GRID_SIZE[getPuzzleDifficulty(puzzleIndex)];
}

// Time thresholds for bonus coins (seconds)
export const TIME_THRESHOLDS: Record<GridSize, number> = {
  3: 60,
  4: 120,
  5: 180,
};

export const TIMED_MODE_STORAGE_KEY = "jigsolitaire-timed-mode";
export const SOUND_ENABLED_STORAGE_KEY = "jigsolitaire-sound-enabled";
export const MUSIC_ENABLED_STORAGE_KEY = "jigsolitaire-music-enabled";

export const HINT_COST = 100;
export const MAX_HINTS = 5;

// Theme unlock helpers
export function getTotalStars(
  themeProgress: [string, { puzzleResults: { stars: number }[] }][],
): number {
  let total = 0;
  for (const [, data] of themeProgress) {
    for (const r of data.puzzleResults) {
      total += r.stars;
    }
  }
  return total;
}
