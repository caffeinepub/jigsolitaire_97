import { useState } from "react";
import { ArrowLeft, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PUZZLE_IMAGES, type ThemeId } from "../utils/puzzleImages";
import { getThemeMeta } from "../utils/themes";
import {
  getPuzzleDifficulty,
  getPuzzleGridSize,
  DIFFICULTY_LABEL,
  TIMED_MODE_STORAGE_KEY,
} from "../utils/constants";
import type { ThemeData } from "../hooks/useQueries";
import type { GridSize } from "../utils/tileEngine";
import { useAudio } from "../hooks/useAudio";
import { PuzzleRow } from "./PuzzleRow";

interface PuzzleListProps {
  themeId: ThemeId;
  themeData: ThemeData | undefined;
  onSelectPuzzle: (params: {
    themeId: ThemeId;
    imageId: number;
    puzzleName: string;
    gridSize: GridSize;
    puzzleIndex: number;
    timedMode: boolean;
  }) => void;
  onBack: () => void;
}

export function PuzzleList({
  themeId,
  themeData,
  onSelectPuzzle,
  onBack,
}: PuzzleListProps) {
  const { playBack, playNavigate, playToggle } = useAudio();
  const theme = getThemeMeta(themeId);
  const puzzles = PUZZLE_IMAGES[themeId];
  const puzzleResults = themeData?.puzzleResults ?? [];
  const completedCount = puzzleResults.length;

  const [timedMode, setTimedMode] = useState(
    () => localStorage.getItem(TIMED_MODE_STORAGE_KEY) === "true",
  );

  const handleTimedToggle = (checked: boolean) => {
    playToggle();
    setTimedMode(checked);
    localStorage.setItem(TIMED_MODE_STORAGE_KEY, String(checked));
  };

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-0 py-4">
      <div className="w-full max-w-lg mx-auto mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 px-2"
          onClick={() => {
            playBack();
            onBack();
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h2 className="text-lg font-display font-semibold text-foreground pr-2">
          {theme?.name ?? "Puzzles"}
        </h2>
      </div>

      {/* Timed mode toggle */}
      <div className="w-full max-w-lg mx-auto mb-3">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <Timer
              className={cn(
                "w-4 h-4",
                timedMode ? "text-primary" : "text-muted-foreground",
              )}
            />
            <div>
              <p className="font-medium text-sm">Timed Challenge</p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Complete quickly for +10 bonus coins
              </p>
            </div>
          </div>
          <Switch checked={timedMode} onCheckedChange={handleTimedToggle} />
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto flex flex-col gap-2.5">
        {puzzles.map((puzzle, index) => {
          const result = index < completedCount ? puzzleResults[index] : null;
          const isCompleted = result !== null;
          const isUnlocked = index <= completedCount;
          const isLocked = !isUnlocked;
          const stars = result?.stars ?? 0;
          const bestTime = result?.bestTime ?? 0;
          const difficulty = getPuzzleDifficulty(index);
          const gridSize = getPuzzleGridSize(index);

          return (
            <PuzzleRow
              key={index}
              index={index}
              imageId={puzzle.imageId}
              name={puzzle.name}
              difficulty={DIFFICULTY_LABEL[difficulty]}
              gridSize={gridSize}
              stars={stars}
              bestTime={bestTime}
              showBestTime={timedMode}
              isCompleted={isCompleted}
              isLocked={isLocked}
              onSelect={() => {
                playNavigate();
                onSelectPuzzle({
                  themeId,
                  imageId: puzzle.imageId,
                  puzzleName: puzzle.name,
                  gridSize,
                  puzzleIndex: index,
                  timedMode,
                });
              }}
            />
          );
        })}
      </div>
    </main>
  );
}
