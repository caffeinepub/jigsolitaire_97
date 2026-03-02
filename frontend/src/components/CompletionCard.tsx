import { ArrowRight, Clock, Coins, Loader2, Star, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CompletionResult } from "../hooks/useQueries";
import type { GridSize } from "../utils/tileEngine";
import { TIME_THRESHOLDS } from "../utils/constants";
import { formatTime } from "../utils/formatting";

export interface CompletionCardProps {
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

export function CompletionCard({
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
}: CompletionCardProps) {
  return (
    <div className="relative bg-card rounded-2xl shadow-2xl max-w-sm w-full max-h-[90dvh] animate-overlay-in">
      <ScrollArea className="max-h-[90dvh] rounded-2xl">
        {/* Completed image */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={imageUrl}
            alt={puzzleName}
            className="w-full max-h-[35dvh] object-cover"
          />
        </div>

        {/* Content */}
        <div className="px-5 pb-5 pt-4">
          <h2 className="text-xl font-display font-bold text-center mb-0.5">
            {customMode
              ? "Custom Puzzle Complete!"
              : dailyMode
                ? "Daily Puzzle Complete!"
                : "Puzzle Complete!"}
          </h2>
          <p className="text-xs text-muted-foreground text-center mb-3">
            {puzzleName}
          </p>
          {completionResult ? (
            <div className="flex flex-col items-center gap-3">
              {/* Stars (skip for custom mode) */}
              {!customMode && (
                <div className="flex gap-2">
                  {[1, 2, 3].map((n) => (
                    <Star
                      key={n}
                      className={cn(
                        "w-8 h-8 animate-star-pop",
                        n <= completionResult.stars
                          ? "fill-chart-3 text-chart-3"
                          : "text-muted-foreground/20",
                      )}
                      style={
                        {
                          "--star-delay": `${n * 0.15}s`,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="tabular-nums">{moveCount} moves</span>
                {(timedMode || dailyMode) && (
                  <span className="flex items-center gap-1 tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(timeSec)}
                  </span>
                )}
              </div>

              {/* Coin breakdown (skip for custom mode) */}
              {!customMode && (
                <div className="w-full text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Completion</span>
                    <span className="tabular-nums">+10</span>
                  </div>
                  <div
                    className={cn(
                      "flex justify-between",
                      hintsUsed > 0 && "line-through opacity-50",
                    )}
                  >
                    <span>No hints</span>
                    <span className="tabular-nums">+10</span>
                  </div>
                  {!dailyMode && timedMode && (
                    <div
                      className={cn(
                        "flex justify-between",
                        timeSec <= TIME_THRESHOLDS[gridSize]
                          ? "text-chart-3 font-medium"
                          : "line-through opacity-50",
                      )}
                    >
                      <span className="flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        Time bonus
                      </span>
                      <span className="tabular-nums">+10</span>
                    </div>
                  )}
                  {!dailyMode &&
                    puzzleIndex === 4 &&
                    completionResult.isFirstTime && (
                      <div className="flex justify-between text-primary font-medium">
                        <span>Theme complete!</span>
                        <span className="tabular-nums">+50</span>
                      </div>
                    )}
                  <div className="flex justify-between border-t border-border pt-1.5 mt-1.5 font-semibold text-foreground">
                    <span className="flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-chart-3" />
                      Total
                    </span>
                    <span className="tabular-nums">
                      +{completionResult.coinsEarned}
                    </span>
                  </div>
                </div>
              )}

              {!customMode && !dailyMode && completionResult.isFirstTime && (
                <p className="text-xs text-primary font-medium">
                  First time clear!
                </p>
              )}

              {dailyMode && (
                <p className="text-xs text-primary font-medium">
                  See you tomorrow!
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 w-full mt-1">
                <Button
                  variant={hasNextPuzzle ? "outline" : "default"}
                  className="flex-1"
                  onClick={onBackToLevels}
                >
                  {customMode
                    ? "Back to Photos"
                    : dailyMode
                      ? "Back to Menu"
                      : "Back to Levels"}
                </Button>
                {hasNextPuzzle && (
                  <Button className="flex-1 gap-1.5" onClick={onNextPuzzle}>
                    Next Puzzle
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 py-6">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Saving...</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
