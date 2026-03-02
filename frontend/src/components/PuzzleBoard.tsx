import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { cellKey, type GridSize, type TileData } from "../utils/tileEngine";
import { BoardCell } from "./BoardCell";

interface PuzzleBoardProps {
  gridSize: GridSize;
  boardState: Map<string, TileData>;
  selectedCell: string | null;
  lockedCells: Set<string>;
  dragOverCell: string | null;
  justSwappedCells: Set<string>;
  justLockedCells: Set<string>;
  shakingCells: Set<string>;
  onCellClick: (row: number, col: number) => void;
  onSwapDrop: (targetKey: string, sourceKey: string) => void;
  onDragOverChange: (key: string, isOver: boolean) => void;
  onTouchDragStart: (cellKey: string, e: React.TouchEvent) => void;
}

export function PuzzleBoard({
  gridSize,
  boardState,
  selectedCell,
  lockedCells,
  dragOverCell,
  justSwappedCells,
  justLockedCells,
  shakingCells,
  onCellClick,
  onSwapDrop,
  onDragOverChange,
  onTouchDragStart,
}: PuzzleBoardProps) {
  const cells = useMemo(() => {
    const result: { row: number; col: number }[] = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        result.push({ row, col });
      }
    }
    return result;
  }, [gridSize]);

  return (
    <div
      className={cn(
        "grid w-full max-w-[500px] aspect-square rounded-lg overflow-hidden shadow-md bg-card border border-border",
      )}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {cells.map(({ row, col }) => {
        const key = cellKey(row, col);
        const tile = boardState.get(key);
        if (!tile) return null;
        return (
          <BoardCell
            key={key}
            cellKey={key}
            imageDataUrl={tile.imageDataUrl}
            isSelected={selectedCell === key}
            isLocked={lockedCells.has(key)}
            isDragOver={dragOverCell === key}
            isJustSwapped={justSwappedCells.has(key)}
            isJustLocked={justLockedCells.has(key)}
            isShaking={shakingCells.has(key)}
            onClick={() => onCellClick(row, col)}
            onSwapDrop={(sourceKey) => onSwapDrop(key, sourceKey)}
            onDragOverChange={(isOver) => onDragOverChange(key, isOver)}
            onTouchDragStart={(e) => onTouchDragStart(key, e)}
          />
        );
      })}
    </div>
  );
}
