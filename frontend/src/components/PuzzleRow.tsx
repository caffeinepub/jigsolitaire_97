import { Clock, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "../utils/puzzleImages";
import type { GridSize } from "../utils/tileEngine";
import { formatTime } from "../utils/formatting";

interface PuzzleRowProps {
  index: number;
  imageId: number;
  name: string;
  difficulty: string;
  gridSize: GridSize;
  stars: number;
  bestTime: number;
  showBestTime: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  onSelect: () => void;
}

export function PuzzleRow({
  index,
  imageId,
  name,
  difficulty,
  gridSize,
  stars,
  bestTime,
  showBestTime,
  isCompleted,
  isLocked,
  onSelect,
}: PuzzleRowProps) {
  return (
    <button
      onClick={isLocked ? undefined : onSelect}
      disabled={isLocked}
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-left transition-all",
        isLocked
          ? "opacity-50 cursor-not-allowed border-border"
          : "border-border hover:border-primary/40 hover:shadow-sm active:scale-[0.98] cursor-pointer",
        isCompleted && "border-primary/20",
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
        {isLocked ? (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
        ) : (
          <img
            src={getImageUrl(imageId)}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-sm text-foreground truncate">
            {isLocked ? `Puzzle ${index + 1}` : name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] px-1.5 py-0 font-medium border-0",
              difficulty === "Easy" && "bg-chart-5/20 text-chart-5",
              difficulty === "Medium" && "bg-chart-3/20 text-chart-3",
              difficulty === "Hard" && "bg-destructive/15 text-destructive",
            )}
          >
            {difficulty}
          </Badge>
          <span className="text-[11px] text-muted-foreground">
            {gridSize}&times;{gridSize}
          </span>
        </div>
      </div>

      {/* Stars + best time / status */}
      <div className="shrink-0 flex flex-col items-end gap-0.5">
        {isCompleted ? (
          <>
            <div className="flex gap-0.5">
              {[1, 2, 3].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "w-4 h-4",
                    n <= stars
                      ? "fill-chart-3 text-chart-3"
                      : "text-muted-foreground/30",
                  )}
                />
              ))}
            </div>
            {showBestTime && bestTime > 0 && (
              <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="tabular-nums">{formatTime(bestTime)}</span>
              </div>
            )}
          </>
        ) : isLocked ? (
          <Lock className="w-4 h-4 text-muted-foreground/40" />
        ) : null}
      </div>
    </button>
  );
}
