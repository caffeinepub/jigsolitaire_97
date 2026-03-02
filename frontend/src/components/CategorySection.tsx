import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getThemeMeta, type ThemeMeta, type Category } from "../utils/themes";
import type { ThemeId } from "../utils/puzzleImages";
import type { ThemeData } from "../hooks/useQueries";
import { ThemeCard } from "./ThemeCard";

export interface CategorySectionProps {
  category: Category;
  themeProgress: [string, ThemeData][];
  totalStars: number;
  onSelectTheme: (themeId: ThemeId) => void;
  onToggle: () => void;
}

function getThemeProgress(
  themeId: string,
  themeProgress: [string, ThemeData][],
): ThemeData | undefined {
  const entry = themeProgress.find(([id]) => id === themeId);
  return entry?.[1];
}

export function CategorySection({
  category,
  themeProgress,
  totalStars,
  onSelectTheme,
  onToggle,
}: CategorySectionProps) {
  const [open, setOpen] = useState(true);

  const themes = category.themeIds
    .map((id) => getThemeMeta(id))
    .filter((t): t is ThemeMeta => t !== undefined);

  const totalPuzzles = themes.reduce((sum, t) => sum + t.puzzleCount, 0);
  const completedPuzzles = themes.reduce((sum, t) => {
    const progress = getThemeProgress(t.id, themeProgress);
    return sum + (progress?.puzzleResults.length ?? 0);
  }, 0);
  const progressPct =
    totalPuzzles > 0 ? (completedPuzzles / totalPuzzles) * 100 : 0;

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
                {completedPuzzles}/{totalPuzzles}
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
        <div className="pt-2 pb-1 -mx-4 sm:mx-0">
          <ScrollArea className="w-full pb-2">
            <div className="flex gap-3 px-4 sm:px-0">
              {themes.map((theme) => {
                const progress = getThemeProgress(theme.id, themeProgress);
                const completed = progress?.puzzleResults.length ?? 0;
                const unlocked = totalStars >= theme.unlockCost;
                return (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    completed={completed}
                    unlocked={unlocked}
                    totalStars={totalStars}
                    onSelect={() => unlocked && onSelectTheme(theme.id)}
                  />
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
