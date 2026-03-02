import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AchievementCardProps {
  achievement: {
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  index: number;
  total: number;
  onContinue: () => void;
}

export function AchievementCard({
  achievement,
  index,
  total,
  onContinue,
}: AchievementCardProps) {
  const Icon = achievement.icon;

  return (
    <div className="relative bg-card rounded-2xl shadow-2xl max-w-xs w-full animate-overlay-in">
      <div className="flex flex-col items-center gap-4 px-6 py-8">
        <p className="text-xs font-medium text-chart-3 uppercase tracking-wide">
          Achievement Unlocked
        </p>

        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/15">
          <Icon className="w-8 h-8 text-primary" />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-display font-bold text-foreground">
            {achievement.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {achievement.description}
          </p>
        </div>

        <Button className="w-full gap-1.5 mt-2" onClick={onContinue}>
          {index < total - 1 ? "Next" : "Continue"}
          <ChevronRight className="w-4 h-4" />
        </Button>

        {total > 1 && (
          <p className="text-[11px] text-muted-foreground tabular-nums">
            {index + 1} of {total}
          </p>
        )}
      </div>
    </div>
  );
}
