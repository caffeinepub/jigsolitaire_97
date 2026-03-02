import { format } from "date-fns";
import type { GridSize } from "./tileEngine";
import type { ThemeId } from "./puzzleImages";
import { ALL_THEME_IDS, PUZZLE_IMAGES } from "./puzzleImages";

export interface DailyPuzzle {
  themeId: ThemeId;
  imageId: number;
  name: string;
  gridSize: GridSize;
}

// Format a Date as "YYYY-MM-DD" in UTC
// Offsets to UTC before formatting so date-fns `format` produces the UTC date string
function formatUTCDate(date: Date): string {
  const utc = new Date(date.getTime() + date.getTimezoneOffset() * 60_000);
  return format(utc, "yyyy-MM-dd");
}

// Simple deterministic hash from a string to a positive integer
function hashDateString(dateStr: string): number {
  let hash = 5381;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 33) ^ dateStr.charCodeAt(i);
  }
  return Math.abs(hash);
}

// Daily grid sizes cycle to keep variety
const DAILY_GRID_SIZES: GridSize[] = [3, 4, 5, 4];

// Flat pool of all puzzles for even distribution across the full content library
const ALL_PUZZLES: {
  themeId: ThemeId;
  puzzle: { imageId: number; name: string };
}[] = [];
for (const themeId of ALL_THEME_IDS) {
  for (const puzzle of PUZZLE_IMAGES[themeId]) {
    ALL_PUZZLES.push({ themeId, puzzle });
  }
}

export function getDailyPuzzle(date: Date = new Date()): DailyPuzzle {
  const dateStr = formatUTCDate(date);
  const hash = hashDateString(dateStr);

  // Pick from the flat pool of all puzzles (52 themes × 5 = 260 puzzles)
  const entry = ALL_PUZZLES[hash % ALL_PUZZLES.length];

  // Grid size from a separate part of the hash
  const gridSize =
    DAILY_GRID_SIZES[
      Math.floor(hash / ALL_PUZZLES.length) % DAILY_GRID_SIZES.length
    ];

  return {
    themeId: entry.themeId,
    imageId: entry.puzzle.imageId,
    name: entry.puzzle.name,
    gridSize,
  };
}

// Today's UTC date key for daily completion tracking
export function getTodayDateKey(): string {
  return formatUTCDate(new Date());
}
