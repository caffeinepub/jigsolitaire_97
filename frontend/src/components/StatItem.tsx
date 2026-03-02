import { cn } from "@/lib/utils";

export interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  iconClass?: string;
}

export function StatItem({
  icon: Icon,
  label,
  value,
  iconClass,
}: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Icon className={cn("h-4 w-4", iconClass)} />
      <span className="text-lg font-semibold tabular-nums leading-tight">
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
