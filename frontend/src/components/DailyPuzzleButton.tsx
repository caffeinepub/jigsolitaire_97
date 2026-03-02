import { useState, useEffect } from "react";
import { intervalToDuration } from "date-fns";
import { CalendarCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function getTimeUntilMidnightUTC(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  const { hours = 0, minutes = 0 } = intervalToDuration({
    start: now,
    end: tomorrow,
  });

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

interface DailyPuzzleButtonProps {
  completed: boolean;
  onPlay: () => void;
}

export function DailyPuzzleButton({
  completed,
  onPlay,
}: DailyPuzzleButtonProps) {
  const [countdown, setCountdown] = useState(() =>
    completed ? getTimeUntilMidnightUTC() : "",
  );

  useEffect(() => {
    if (!completed) return;
    setCountdown(getTimeUntilMidnightUTC());
    const interval = setInterval(() => {
      setCountdown(getTimeUntilMidnightUTC());
    }, 60_000);
    return () => clearInterval(interval);
  }, [completed]);

  return (
    <div className="w-full flex flex-col items-center">
      <Button
        variant="outline"
        size="lg"
        disabled={completed}
        className={cn(
          "w-full h-12 rounded-xl font-display font-medium relative",
          completed
            ? "opacity-75 cursor-default"
            : "border-chart-3/30 bg-chart-3/5 text-foreground hover:bg-chart-3/10",
        )}
        onClick={onPlay}
      >
        {completed ? (
          <Check className="h-5 w-5 mr-2 text-chart-5" />
        ) : (
          <CalendarCheck className="h-5 w-5 mr-2 text-chart-3" />
        )}
        {completed ? "Completed" : "Daily Puzzle"}
      </Button>
      {completed && (
        <p className="text-[11px] text-muted-foreground mt-1.5 tabular-nums">
          Next in {countdown}
        </p>
      )}
    </div>
  );
}
