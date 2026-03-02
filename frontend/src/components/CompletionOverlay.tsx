import { useState } from "react";
import type { CompletionResult } from "../hooks/useQueries";
import type { GridSize } from "../utils/tileEngine";
import { getAchievementDef } from "../utils/achievements";
import { AchievementCard } from "./AchievementCard";
import { CompletionCard } from "./CompletionCard";

interface CompletionOverlayProps {
  imageUrl: string;
  puzzleName: string;
  moveCount: number;
  hintsUsed: number;
  timeSec: number;
  timedMode: boolean;
  gridSize: GridSize;
  puzzleIndex: number;
  completionResult: CompletionResult | null;
  hasNextPuzzle: boolean;
  onNextPuzzle: () => void;
  onBackToLevels: () => void;
  dailyMode?: boolean;
  customMode?: boolean;
}

export function CompletionOverlay({
  imageUrl,
  puzzleName,
  moveCount,
  hintsUsed,
  timeSec,
  timedMode,
  gridSize,
  puzzleIndex,
  completionResult,
  hasNextPuzzle,
  onNextPuzzle,
  onBackToLevels,
  dailyMode,
  customMode,
}: CompletionOverlayProps) {
  const achievements = completionResult?.newAchievements ?? [];
  const [achievementIndex, setAchievementIndex] = useState(0);
  const showingAchievements =
    achievements.length > 0 && achievementIndex < achievements.length;

  const currentAchievement = showingAchievements
    ? getAchievementDef(achievements[achievementIndex])
    : null;

  const handleAdvance = () => {
    setAchievementIndex((i) => i + 1);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      {/* Warm glow behind the card */}
      {completionResult && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full bg-chart-3/15 blur-3xl animate-completion-glow" />
        </div>
      )}

      {showingAchievements && currentAchievement ? (
        <AchievementCard
          key={achievementIndex}
          achievement={currentAchievement}
          index={achievementIndex}
          total={achievements.length}
          onContinue={handleAdvance}
        />
      ) : (
        <CompletionCard
          imageUrl={imageUrl}
          puzzleName={puzzleName}
          moveCount={moveCount}
          hintsUsed={hintsUsed}
          timeSec={timeSec}
          timedMode={timedMode}
          gridSize={gridSize}
          puzzleIndex={puzzleIndex}
          completionResult={completionResult}
          hasNextPuzzle={hasNextPuzzle}
          onNextPuzzle={onNextPuzzle}
          onBackToLevels={onBackToLevels}
          dailyMode={dailyMode}
          customMode={customMode}
        />
      )}
    </div>
  );
}
