import { cn } from "@/lib/utils";

const DRAG_CELL_KEY = "application/x-cell-key";

interface BoardCellProps {
  cellKey: string;
  imageDataUrl: string;
  isSelected: boolean;
  isLocked: boolean;
  isDragOver: boolean;
  isJustSwapped: boolean;
  isJustLocked: boolean;
  isShaking: boolean;
  onClick: () => void;
  onSwapDrop: (sourceCellKey: string) => void;
  onDragOverChange: (isOver: boolean) => void;
  onTouchDragStart: (e: React.TouchEvent) => void;
}

export function BoardCell({
  cellKey,
  imageDataUrl,
  isSelected,
  isLocked,
  isDragOver,
  isJustSwapped,
  isJustLocked,
  isShaking,
  onClick,
  onSwapDrop,
  onDragOverChange,
  onTouchDragStart,
}: BoardCellProps) {
  return (
    <div
      role="button"
      tabIndex={isLocked ? -1 : 0}
      data-cell-key={cellKey}
      draggable={!isLocked}
      className={cn(
        "relative aspect-square overflow-hidden transition-all duration-150 focus:outline-none select-none",
        isLocked && "cursor-default",
        !isLocked && "ring-1 ring-border/50",
        isSelected && !isLocked && "ring-2 ring-primary scale-95",
        isDragOver &&
          !isLocked &&
          !isSelected &&
          "ring-2 ring-primary/50 brightness-110",
        !isSelected &&
          !isLocked &&
          !isDragOver &&
          "hover:brightness-90 cursor-grab active:cursor-grabbing",
        isJustSwapped && "animate-tile-swap",
        isJustLocked && "animate-tile-lock",
        isShaking && "animate-tile-shake",
      )}
      onClick={onClick}
      onDragStart={(e) => {
        if (isLocked) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData(DRAG_CELL_KEY, cellKey);
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragOver={(e) => {
        if (isLocked) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        onDragOverChange(true);
      }}
      onDragLeave={() => onDragOverChange(false)}
      onDrop={(e) => {
        e.preventDefault();
        onDragOverChange(false);
        const sourceKey = e.dataTransfer.getData(DRAG_CELL_KEY);
        if (sourceKey && sourceKey !== cellKey) {
          onSwapDrop(sourceKey);
        }
      }}
      onTouchStart={(e) => {
        if (!isLocked) onTouchDragStart(e);
      }}
    >
      <img
        src={imageDataUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        draggable={false}
      />
    </div>
  );
}
