interface StatCardProps {
  label: string;
  value: number;
  total?: number;
  icon: React.ReactNode;
}

export function StatCard({ label, value, total, icon }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3 shadow-xs">
      {icon}
      <span className="text-lg font-bold tabular-nums text-foreground">
        {value}
        {total !== undefined && (
          <span className="text-xs font-normal text-muted-foreground">
            /{total}
          </span>
        )}
      </span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
