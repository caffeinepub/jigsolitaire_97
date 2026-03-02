import { Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getImageUrl } from "../utils/puzzleImages";
import type { ThemeMeta } from "../utils/themes";

export interface ThemeCardProps {
  theme: ThemeMeta;
  completed: number;
  unlocked: boolean;
  totalStars: number;
  onSelect: () => void;
}

export function ThemeCard({
  theme,
  completed,
  unlocked,
  totalStars,
  onSelect,
}: ThemeCardProps) {
  const isComplete = completed >= theme.puzzleCount;
  const starsNeeded = theme.unlockCost - totalStars;

  return (
    <button
      onClick={onSelect}
      disabled={!unlocked}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card",
        "shadow-sm transition-all shrink-0 snap-start",
        "w-40 sm:w-44",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "text-left",
        unlocked
          ? "active:scale-[0.97] hover:shadow-md hover:border-primary/40 cursor-pointer"
          : "cursor-not-allowed opacity-75",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={getImageUrl(theme.thumbnailImageId)}
          alt={theme.name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-300",
            unlocked ? "group-hover:scale-105" : "grayscale",
          )}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {unlocked ? (
          <div
            className={cn(
              "absolute top-2 right-2 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums backdrop-blur-sm",
              isComplete
                ? "bg-primary/90 text-primary-foreground"
                : "bg-black/40 text-white",
            )}
          >
            {completed}/{theme.puzzleCount}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <Lock className="h-5 w-5 text-white/80 mb-1" />
            <div className="flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-white">
              <Star className="h-3 w-3 fill-chart-3 text-chart-3" />
              {starsNeeded} more
            </div>
          </div>
        )}
      </div>

      <div className="px-2.5 py-2">
        <p className="font-display font-semibold text-xs text-foreground leading-tight truncate">
          {theme.name}
        </p>
        <p className="text-[10px] text-muted-foreground leading-snug mt-0.5 line-clamp-1">
          {theme.description}
        </p>
      </div>

      {unlocked && (
        <div className="mx-2.5 mb-2 h-1 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isComplete ? "bg-primary" : "bg-chart-3",
            )}
            style={{ width: `${(completed / theme.puzzleCount) * 100}%` }}
          />
        </div>
      )}
    </button>
  );
}
