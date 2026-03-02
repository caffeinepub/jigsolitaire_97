import { intervalToDuration } from "date-fns";

export function formatTime(totalSeconds: number): string {
  const duration = intervalToDuration({ start: 0, end: totalSeconds * 1000 });
  const mins = duration.minutes ?? 0;
  const secs = duration.seconds ?? 0;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}
