import { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getThemeMeta, type ThemeMeta, type Category } from "../utils/themes";
import { PUZZLE_IMAGES, getImageUrl } from "../utils/puzzleImages";
import type { ThemeData } from "../hooks/useQueries";

export interface GalleryCategorySectionProps {
  category: Category;
  themeProgress: [string, ThemeData][];
  onSelectPhoto: (photo: { imageId: number; name: string }) => void;
  onToggle: () => void;
}

function getThemeData(
  themeId: string,
  themeProgress: [string, ThemeData][],
): ThemeData | undefined {
  return themeProgress.find(([id]) => id === themeId)?.[1];
}

export function GalleryCategorySection({
  category,
  themeProgress,
  onSelectPhoto,
  onToggle,
}: GalleryCategorySectionProps) {
  const [open, setOpen] = useState(false);

  const themes = category.themeIds
    .map((id) => getThemeMeta(id))
    .filter((t): t is ThemeMeta => t !== undefined);

  const totalPhotos = themes.reduce(
    (sum, t) => sum + PUZZLE_IMAGES[t.id].length,
    0,
  );
  const collectedPhotos = themes.reduce((sum, t) => {
    const data = getThemeData(t.id, themeProgress);
    return sum + (data?.puzzleResults.length ?? 0);
  }, 0);
  const progressPct =
    totalPhotos > 0 ? (collectedPhotos / totalPhotos) * 100 : 0;

  const Icon = category.icon;

  return (
    <Collapsible
      open={open}
      onOpenChange={(v) => {
        onToggle();
        setOpen(v);
      }}
    >
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:bg-accent/50 transition-colors text-left">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 text-primary shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-display font-semibold text-sm text-foreground truncate">
                {category.name}
              </p>
              <span className="text-xs text-muted-foreground tabular-nums shrink-0 ml-2">
                {collectedPhotos}/{totalPhotos}
              </span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  progressPct >= 100 ? "bg-primary" : "bg-chart-3",
                )}
                style={{ width: `${Math.min(progressPct, 100)}%` }}
              />
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pt-2 pb-1 space-y-4">
          {themes.map((theme) => {
            const data = getThemeData(theme.id, themeProgress);
            const completed = data?.puzzleResults.length ?? 0;
            const puzzles = PUZZLE_IMAGES[theme.id];

            return (
              <div key={theme.id}>
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="font-display font-semibold text-xs text-foreground">
                    {theme.name}
                  </h4>
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {completed}/{puzzles.length}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {puzzles.map((puzzle, index) => {
                    const isUnlocked = index < completed;

                    return isUnlocked ? (
                      <button
                        key={puzzle.imageId}
                        onClick={() =>
                          onSelectPhoto({
                            imageId: puzzle.imageId,
                            name: puzzle.name,
                          })
                        }
                        className={cn(
                          "group relative aspect-square rounded-lg overflow-hidden",
                          "border border-border bg-card shadow-xs",
                          "transition-all active:scale-[0.96]",
                          "hover:shadow-md hover:border-primary/40",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        )}
                      >
                        <img
                          src={getImageUrl(puzzle.imageId)}
                          alt={puzzle.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                      </button>
                    ) : (
                      <div
                        key={puzzle.imageId}
                        className="relative aspect-square rounded-lg overflow-hidden border border-border/60 bg-muted/60"
                      >
                        <Lock className="absolute inset-0 m-auto w-3.5 h-3.5 text-muted-foreground/30" />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
