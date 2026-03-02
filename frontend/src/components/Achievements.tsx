import { ArrowLeft, Coins, Lock, Puzzle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ACHIEVEMENTS } from "../utils/achievements";
import { ALL_THEME_IDS, PUZZLE_IMAGES } from "../utils/puzzleImages";
import type { UserProgress } from "../hooks/useQueries";
import { useAudio } from "../hooks/useAudio";
import { StatCard } from "./StatCard";

interface AchievementsProps {
  progress: UserProgress | undefined;
  onBack: () => void;
}

export function Achievements({ progress, onBack }: AchievementsProps) {
  const { playBack } = useAudio();
  const earned = new Set(progress?.achievements ?? []);

  const puzzlesSolved =
    progress?.themeProgress.reduce(
      (sum, [, data]) => sum + data.puzzleResults.length,
      0,
    ) ?? 0;

  const themesCompleted =
    progress?.themeProgress.filter(
      ([id, data]) =>
        data.puzzleResults.length >=
        (PUZZLE_IMAGES[id as keyof typeof PUZZLE_IMAGES]?.length ?? 5),
    ).length ?? 0;

  const totalPuzzles = ALL_THEME_IDS.reduce(
    (sum, id) => sum + PUZZLE_IMAGES[id].length,
    0,
  );

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
        <div className="flex items-center gap-2 pr-2">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground tabular-nums">
            {earned.size}/{ACHIEVEMENTS.length} Earned
          </span>
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto space-y-6">
        {/* Stats dashboard */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            label="Puzzles"
            value={puzzlesSolved}
            total={totalPuzzles}
            icon={<Puzzle className="w-4 h-4 text-primary" />}
          />
          <StatCard
            label="Themes"
            value={themesCompleted}
            total={ALL_THEME_IDS.length}
            icon={<Trophy className="w-4 h-4 text-chart-3" />}
          />
          <StatCard
            label="Coins"
            value={progress?.coins ?? 0}
            icon={<Coins className="w-4 h-4 text-chart-3" />}
          />
        </div>

        {/* Badges grid */}
        <div>
          <h3 className="font-display font-semibold text-sm text-foreground mb-3">
            Badges
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const isEarned = earned.has(achievement.id);
              const Icon = achievement.icon;

              return (
                <div
                  key={achievement.id}
                  className={cn(
                    "relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
                    isEarned
                      ? "border-primary/30 bg-primary/5 shadow-xs"
                      : "border-border/60 bg-muted/40",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full",
                      isEarned
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground/30",
                    )}
                  >
                    {isEarned ? (
                      <Icon className="w-5 h-5" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-xs font-semibold leading-tight",
                        isEarned
                          ? "text-foreground"
                          : "text-muted-foreground/50",
                      )}
                    >
                      {isEarned ? achievement.name : "???"}
                    </p>
                    <p
                      className={cn(
                        "text-[11px] leading-snug mt-0.5",
                        isEarned
                          ? "text-muted-foreground"
                          : "text-muted-foreground/30",
                      )}
                    >
                      {isEarned ? achievement.description : "Locked"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
