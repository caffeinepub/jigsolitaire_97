import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "../utils/themes";
import { getTotalStars } from "../utils/constants";
import type { ThemeId } from "../utils/puzzleImages";
import type { ThemeData } from "../hooks/useQueries";
import { useAudio } from "../hooks/useAudio";
import { CategorySection } from "./CategorySection";

interface ThemeSelectProps {
  themeProgress: [string, ThemeData][];
  onSelectTheme: (themeId: ThemeId) => void;
  onBack: () => void;
}

export function ThemeSelect({
  themeProgress,
  onSelectTheme,
  onBack,
}: ThemeSelectProps) {
  const totalStars = getTotalStars(themeProgress);
  const { playBack, playNavigate, playTap } = useAudio();

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-0 py-4">
      <div className="w-full max-w-2xl mx-auto mb-4 flex items-center justify-between">
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
        <div className="flex items-center gap-1 rounded-full bg-chart-3/10 px-3 py-1 text-sm font-semibold tabular-nums">
          <Star className="h-4 w-4 fill-chart-3 text-chart-3" />
          {totalStars}
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
        {CATEGORIES.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            themeProgress={themeProgress}
            totalStars={totalStars}
            onSelectTheme={(id) => {
              playNavigate();
              onSelectTheme(id);
            }}
            onToggle={playTap}
          />
        ))}
      </div>
    </main>
  );
}
