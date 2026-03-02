import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PuzzleBoard } from "./PuzzleBoard";
import { GameToolbar } from "./GameToolbar";
import { CompletionOverlay } from "./CompletionOverlay";
import { cellKey, type GridSize, type TileData } from "../utils/tileEngine";
import {
  getImageUrl,
  PUZZLE_IMAGES,
  type ThemeId,
} from "../utils/puzzleImages";
import { createDerangement } from "../utils/scramble";
import { getThemeMeta } from "../utils/themes";
import {
  getPuzzleDifficulty,
  DIFFICULTY_LABEL,
  TIME_THRESHOLDS,
} from "../utils/constants";
import {
  useCompletePuzzle,
  useCompleteDailyPuzzle,
  useConsumeHint,
  type CompletionResult,
} from "../hooks/useQueries";
import { useAudio } from "../hooks/useAudio";
import { useTouchDrag } from "../hooks/useTouchDrag";

export interface GameBoardProps {
  tiles: TileData[];
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
  usedFallback?: boolean;
}

export function GameBoard({
  tiles,
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
  usedFallback,
}: GameBoardProps) {
  const [boardState, setBoardState] = useState<Map<string, TileData>>(() =>
    createDerangement(tiles, gridSize),
  );
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [lockedCells, setLockedCells] = useState<Set<string>>(() => new Set());
  const [moveCount, setMoveCount] = useState(0);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);
  const [justSwappedCells, setJustSwappedCells] = useState<Set<string>>(
    () => new Set(),
  );
  const [justLockedCells, setJustLockedCells] = useState<Set<string>>(
    () => new Set(),
  );
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [completionResult, setCompletionResult] =
    useState<CompletionResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSwap, setLastSwap] = useState<{
    keyA: string;
    keyB: string;
    lockedBySwap: string[];
  } | null>(null);
  const [shakingCells, setShakingCells] = useState<Set<string>>(
    () => new Set(),
  );

  const { mutate: completePuzzle } = useCompletePuzzle();
  const { mutate: completeDailyPuzzle } = useCompleteDailyPuzzle();
  const { mutate: consumeHint, isPending: isConsumingHint } = useConsumeHint();
  const audio = useAudio();
  const startTimeRef = useRef(Date.now());
  const hintsUsedRef = useRef(0);

  const boardStateRef = useRef(boardState);
  boardStateRef.current = boardState;
  const lockedCellsRef = useRef(lockedCells);
  lockedCellsRef.current = lockedCells;

  const totalCells = gridSize * gridSize;

  const performSwap = useCallback(
    (keyA: string, keyB: string) => {
      if (keyA === keyB) return;
      const board = boardStateRef.current;
      const locked = lockedCellsRef.current;
      if (locked.has(keyA) || locked.has(keyB)) return;

      const tileA = board.get(keyA)!;
      const tileB = board.get(keyB)!;

      const next = new Map(board);
      next.set(keyA, tileB);
      next.set(keyB, tileA);
      setBoardState(next);

      setMoveCount((c) => c + 1);

      setJustSwappedCells(new Set([keyA, keyB]));
      setTimeout(() => setJustSwappedCells(new Set()), 250);

      const newLocked = new Set(locked);
      const [aRow, aCol] = keyA.split("-").map(Number);
      const [bRow, bCol] = keyB.split("-").map(Number);

      const newlyLocked: string[] = [];
      if (tileB.row === aRow && tileB.col === aCol) {
        newLocked.add(keyA);
        newlyLocked.push(keyA);
      }
      if (tileA.row === bRow && tileA.col === bCol) {
        newLocked.add(keyB);
        newlyLocked.push(keyB);
      }

      if (newlyLocked.length > 0) {
        setLockedCells(newLocked);
        setJustLockedCells(new Set(newlyLocked));
        setTimeout(() => setJustLockedCells(new Set()), 400);
        audio.playTileLock();
      } else {
        audio.playTileSwap();
      }

      setLastSwap({ keyA, keyB, lockedBySwap: newlyLocked });
    },
    [audio],
  );

  // Submit completion to backend when all cells are locked
  const completionSubmittedRef = useRef(false);
  const completionTimeRef = useRef(0);
  useEffect(() => {
    if (lockedCells.size === totalCells && !completionSubmittedRef.current) {
      completionSubmittedRef.current = true;
      audio.playPuzzleComplete();
      const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
      completionTimeRef.current = timedMode || dailyMode ? elapsedSec : 0;

      if (customMode) {
        setCompletionResult({
          coinsEarned: 0,
          stars: 0,
          isFirstTime: false,
          newAchievements: [],
        });
      } else if (dailyMode) {
        completeDailyPuzzle(
          {
            hintsUsed: hintsUsedRef.current,
            timeSec: elapsedSec,
            gridSize,
            moves: moveCount,
          },
          {
            onSuccess: (result) => {
              setCompletionResult({
                coinsEarned: result.coinsEarned,
                stars: result.stars,
                isFirstTime: true,
                newAchievements: [],
              });
            },
          },
        );
      } else {
        const threshold = TIME_THRESHOLDS[gridSize];
        const timedCompletion = timedMode && elapsedSec <= threshold;
        completePuzzle(
          {
            themeId,
            puzzleIndex,
            hintsUsed: hintsUsedRef.current,
            timeSec: timedMode ? elapsedSec : 0,
            gridSize,
            moves: moveCount,
            timedCompletion,
          },
          {
            onSuccess: (result) => {
              setCompletionResult(result);
            },
          },
        );
      }
    }
  }, [
    lockedCells,
    totalCells,
    themeId,
    puzzleIndex,
    gridSize,
    moveCount,
    timedMode,
    dailyMode,
    completePuzzle,
    completeDailyPuzzle,
  ]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const key = cellKey(row, col);
      if (lockedCellsRef.current.has(key)) {
        audio.playLockedTap();
        setShakingCells(new Set([key]));
        setTimeout(() => setShakingCells(new Set()), 300);
        return;
      }

      if (selectedCell === null) {
        audio.playTileSelect();
        setSelectedCell(key);
        return;
      }

      if (selectedCell === key) {
        setSelectedCell(null);
        return;
      }

      performSwap(selectedCell, key);
      setSelectedCell(null);
    },
    [selectedCell, performSwap, audio],
  );

  const handleSwapDrop = useCallback(
    (targetKey: string, sourceKey: string) => {
      performSwap(sourceKey, targetKey);
      setSelectedCell(null);
      setDragOverCell(null);
    },
    [performSwap],
  );

  const handleDragOverChange = useCallback((key: string, isOver: boolean) => {
    setDragOverCell(isOver ? key : null);
  }, []);

  const boardRef = useRef<HTMLDivElement>(null);

  const { handleTouchDragStart } = useTouchDrag({
    boardStateRef,
    boardRef,
    gridSize,
    performSwap,
    setSelectedCell,
    setDragOverCell,
  });

  const handleUseHint = useCallback(() => {
    const board = boardStateRef.current;
    const locked = lockedCellsRef.current;

    // Find all unlocked tiles in wrong positions
    const wrongTiles: { key: string; tile: TileData }[] = [];
    for (const [key, tile] of board) {
      if (locked.has(key)) continue;
      const [row, col] = key.split("-").map(Number);
      if (tile.row !== row || tile.col !== col) {
        wrongTiles.push({ key, tile });
      }
    }
    if (wrongTiles.length === 0) return;

    // Pick a random wrong tile and move it home
    const chosen = wrongTiles[Math.floor(Math.random() * wrongTiles.length)];
    const correctKey = cellKey(chosen.tile.row, chosen.tile.col);
    const displacedTile = board.get(correctKey)!;

    const next = new Map(board);
    next.set(correctKey, chosen.tile);
    next.set(chosen.key, displacedTile);
    setBoardState(next);

    // Lock the placed tile; check if displaced tile also landed correctly
    const newLocked = new Set(locked);
    const newlyLocked: string[] = [correctKey];
    newLocked.add(correctKey);

    const [dRow, dCol] = chosen.key.split("-").map(Number);
    if (displacedTile.row === dRow && displacedTile.col === dCol) {
      newLocked.add(chosen.key);
      newlyLocked.push(chosen.key);
    }

    setLockedCells(newLocked);
    setJustLockedCells(new Set(newlyLocked));
    setTimeout(() => setJustLockedCells(new Set()), 400);
    setSelectedCell(null);
    setMoveCount((c) => c + 1);

    hintsUsedRef.current += 1;
    consumeHint();
    setLastSwap(null);
    audio.playHintUsed();
  }, [consumeHint, audio]);

  const handleUndo = useCallback(() => {
    if (!lastSwap) return;
    const { keyA, keyB, lockedBySwap } = lastSwap;
    const board = boardStateRef.current;
    const locked = lockedCellsRef.current;

    const tileAtA = board.get(keyA)!;
    const tileAtB = board.get(keyB)!;
    const next = new Map(board);
    next.set(keyA, tileAtB);
    next.set(keyB, tileAtA);
    setBoardState(next);

    if (lockedBySwap.length > 0) {
      const newLocked = new Set(locked);
      for (const key of lockedBySwap) {
        newLocked.delete(key);
      }
      setLockedCells(newLocked);
    }

    setMoveCount((c) => c + 1);
    setSelectedCell(null);
    setLastSwap(null);
    audio.playUndo();
  }, [lastSwap, audio]);

  const imageUrl =
    customMode && customImageUrl ? customImageUrl : getImageUrl(imageId);
  const isComplete = lockedCells.size === totalCells;
  const themeMeta = getThemeMeta(themeId);
  const totalPuzzles = customMode ? 0 : PUZZLE_IMAGES[themeId].length;
  const difficulty = customMode
    ? ("easy" as const)
    : getPuzzleDifficulty(puzzleIndex);
  const isInProgress = moveCount > 0 && !isComplete;

  const handleBackClick = () => {
    if (isInProgress) {
      audio.playTap();
      setLeaveDialogOpen(true);
    } else {
      audio.playBack();
      onBack();
    }
  };

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-0 py-3 sm:py-4">
      {/* Top bar: back + level indicator */}
      <div className="w-full max-w-[500px] mx-auto mb-2 sm:mb-3 flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 px-2 h-10"
          onClick={handleBackClick}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {customMode ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-display font-semibold text-foreground">
              {puzzleName}
            </span>
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 font-medium border-0 bg-primary/15 text-primary"
            >
              {gridSize}x{gridSize}
            </Badge>
          </div>
        ) : dailyMode ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-display font-semibold text-foreground">
              Daily Puzzle
            </span>
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 font-medium border-0 bg-chart-3/20 text-chart-3"
            >
              {gridSize}x{gridSize}
            </Badge>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-display font-semibold text-foreground">
              {themeMeta?.name}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {puzzleIndex + 1}/{totalPuzzles}
            </span>
            <Badge
              variant="secondary"
              className={cn(
                "text-[10px] px-1.5 py-0 font-medium border-0",
                difficulty === "easy" && "bg-chart-5/20 text-chart-5",
                difficulty === "medium" && "bg-chart-3/20 text-chart-3",
                difficulty === "hard" && "bg-destructive/15 text-destructive",
              )}
            >
              {DIFFICULTY_LABEL[difficulty]}
            </Badge>
          </div>
        )}
      </div>

      {/* Board centered */}
      <div className="flex-1 flex flex-col items-center">
        <div ref={boardRef} className="relative w-full max-w-[500px]">
          <PuzzleBoard
            gridSize={gridSize}
            boardState={boardState}
            selectedCell={selectedCell}
            lockedCells={lockedCells}
            dragOverCell={dragOverCell}
            justSwappedCells={justSwappedCells}
            justLockedCells={justLockedCells}
            shakingCells={shakingCells}
            onCellClick={handleCellClick}
            onSwapDrop={handleSwapDrop}
            onDragOverChange={handleDragOverChange}
            onTouchDragStart={handleTouchDragStart}
          />
          {showPreview && difficulty !== "hard" && !usedFallback && (
            <img
              src={imageUrl}
              alt="Preview overlay"
              className="absolute inset-0 w-full h-full rounded-lg object-cover pointer-events-none opacity-30"
              draggable={false}
            />
          )}
        </div>

        <GameToolbar
          moveCount={moveCount}
          puzzleName={puzzleName}
          imageUrl={imageUrl}
          startTime={startTimeRef.current}
          isComplete={isComplete}
          timedMode={timedMode}
          showPreview={showPreview}
          previewDisabled={difficulty === "hard" || !!usedFallback}
          referenceDisabled={!!usedFallback}
          canUndo={!!lastSwap}
          hintPending={isConsumingHint}
          onUseHint={handleUseHint}
          onUndo={handleUndo}
          onTogglePreview={() => setShowPreview((p) => !p)}
        />
      </div>

      {/* Completion overlay */}
      {isComplete && (
        <CompletionOverlay
          imageUrl={imageUrl}
          puzzleName={puzzleName}
          moveCount={moveCount}
          hintsUsed={hintsUsedRef.current}
          timeSec={completionTimeRef.current}
          timedMode={customMode ? false : timedMode}
          gridSize={gridSize}
          puzzleIndex={puzzleIndex}
          completionResult={completionResult}
          hasNextPuzzle={!dailyMode && !customMode && !!onNextPuzzle}
          onNextPuzzle={onNextPuzzle ?? onBack}
          onBackToLevels={onBack}
          dailyMode={dailyMode}
          customMode={customMode}
        />
      )}

      {/* Leave puzzle confirmation */}
      <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave puzzle?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress on this puzzle will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Playing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                audio.playBack();
                onBack();
              }}
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
