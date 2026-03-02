import { useState, useEffect, useCallback } from "react";
import type { GridSize, TileData } from "../utils/tileEngine";
import {
  sliceImageIntoTiles,
  generateFallbackTiles,
} from "../utils/tileEngine";
import {
  preloadImage,
  preloadImageFromUrl,
  type ThemeId,
} from "../utils/puzzleImages";
import { Skeleton } from "@/components/ui/skeleton";
import { useStartPuzzle } from "../hooks/useQueries";
import { GameBoard } from "./GameBoard";
import { toast } from "sonner";

interface GameScreenProps {
  themeId: ThemeId;
  imageId: number;
  puzzleName: string;
  gridSize: GridSize;
  puzzleIndex: number;
  timedMode: boolean;
  onBack: () => void;
  onNextPuzzle: (() => void) | null;
  dailyMode?: boolean;
  customMode?: boolean;
  customImageUrl?: string;
}

export function GameScreen({
  themeId,
  imageId,
  puzzleName,
  gridSize,
  puzzleIndex,
  timedMode,
  onBack,
  onNextPuzzle,
  dailyMode,
  customMode,
  customImageUrl,
}: GameScreenProps) {
  const [tiles, setTiles] = useState<TileData[] | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const { mutate: startPuzzle } = useStartPuzzle();

  const loadPuzzle = useCallback(async () => {
    setTiles(null);
    setUsedFallback(false);
    try {
      const img =
        customMode && customImageUrl
          ? await preloadImageFromUrl(customImageUrl)
          : await preloadImage(imageId);
      const sliced = sliceImageIntoTiles(img, gridSize);
      setTiles(sliced);
    } catch {
      toast.error("Image failed to load. Using placeholder tiles.");
      setTiles(generateFallbackTiles(gridSize));
      setUsedFallback(true);
    }
  }, [imageId, gridSize, customMode, customImageUrl]);

  useEffect(() => {
    loadPuzzle();
  }, [loadPuzzle]);

  // Call startPuzzle when tiles are loaded (skip for daily and custom puzzles)
  useEffect(() => {
    if (tiles && !dailyMode && !customMode) {
      startPuzzle({ themeId, puzzleIndex, gridSize });
    }
  }, [
    tiles,
    themeId,
    puzzleIndex,
    gridSize,
    startPuzzle,
    dailyMode,
    customMode,
  ]);

  if (!tiles) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
        <Skeleton className="w-full max-w-[500px] aspect-square rounded-lg" />
        <p className="text-sm text-muted-foreground">Loading puzzle...</p>
      </div>
    );
  }

  return (
    <GameBoard
      tiles={tiles}
      themeId={themeId}
      imageId={imageId}
      puzzleName={puzzleName}
      gridSize={gridSize}
      puzzleIndex={puzzleIndex}
      timedMode={timedMode}
      onBack={onBack}
      onNextPuzzle={onNextPuzzle}
      dailyMode={dailyMode}
      customMode={customMode}
      customImageUrl={customImageUrl}
      usedFallback={usedFallback}
    />
  );
}
