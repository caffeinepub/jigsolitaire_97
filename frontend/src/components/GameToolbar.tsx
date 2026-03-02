import { useState, useEffect } from "react";
import { intervalToDuration } from "date-fns";
import {
  Clock,
  Coins,
  Eye,
  Layers,
  Lightbulb,
  Loader2,
  Move,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetProgress, useBuyHint } from "../hooks/useQueries";
import { useAudio } from "../hooks/useAudio";
import { HINT_COST, MAX_HINTS } from "../utils/constants";
import { formatTime } from "../utils/formatting";

interface GameToolbarProps {
  moveCount: number;
  puzzleName: string;
  imageUrl: string;
  startTime: number;
  isComplete: boolean;
  timedMode: boolean;
  showPreview: boolean;
  previewDisabled: boolean;
  referenceDisabled?: boolean;
  canUndo: boolean;
  hintPending: boolean;
  onUseHint: () => void;
  onUndo: () => void;
  onTogglePreview: () => void;
}

function formatRegenCountdown(lastRegenTime: number): string | null {
  const TWO_HOURS_MS = 7_200_000;
  const now = Date.now();
  const lastRegenMs = Math.floor(lastRegenTime / 1_000_000);
  const nextRegenMs = lastRegenMs + TWO_HOURS_MS;
  const remaining = Math.max(0, Math.floor((nextRegenMs - now) / 1000));
  if (remaining <= 0) return null;
  const duration = intervalToDuration({ start: 0, end: remaining * 1000 });
  const h = duration.hours ?? 0;
  const m = duration.minutes ?? 0;
  const s = duration.seconds ?? 0;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function GameToolbar({
  moveCount,
  puzzleName,
  imageUrl,
  startTime,
  isComplete,
  timedMode,
  showPreview,
  previewDisabled,
  referenceDisabled,
  canUndo,
  hintPending,
  onUseHint,
  onUndo,
  onTogglePreview,
}: GameToolbarProps) {
  const { playTap, playModalOpen } = useAudio();
  const { data: progress, isError } = useGetProgress();
  const hints = progress?.hints ?? 0;
  const coins = progress?.coins ?? 0;

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load progress data");
    }
  }, [isError]);
  const { mutate: buyHint, isPending: isBuying } = useBuyHint();

  const [elapsed, setElapsed] = useState(0);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [regenCountdown, setRegenCountdown] = useState<string | null>(null);

  useEffect(() => {
    if (isComplete || !timedMode) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isComplete, timedMode]);

  // Update regen countdown every second when dialog is open
  useEffect(() => {
    if (!buyDialogOpen || !progress) return;
    const update = () => {
      setRegenCountdown(formatRegenCountdown(progress.lastHintRegenTime));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [buyDialogOpen, progress]);

  const handleHintClick = () => {
    if (hints > 0) {
      onUseHint();
    } else {
      playModalOpen();
      setBuyDialogOpen(true);
    }
  };

  const handleBuyHint = () => {
    buyHint(undefined, {
      onSuccess: () => {
        toast.success("Hint purchased!");
        setBuyDialogOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to buy hint");
      },
    });
  };

  const canAfford = coins >= HINT_COST;

  return (
    <>
      <div className="w-full max-w-[500px] mt-2 sm:mt-3 flex items-center justify-between px-1">
        {/* Stats */}
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-default">
                <Move className="w-4 h-4" />
                <span className="font-medium tabular-nums">{moveCount}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Moves</TooltipContent>
          </Tooltip>
          {timedMode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-default">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{formatTime(elapsed)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Elapsed time</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-10 w-10 sm:h-9 sm:w-auto sm:px-3 sm:gap-1.5",
                  !canUndo && "opacity-50",
                )}
                onClick={onUndo}
                disabled={!canUndo || isComplete}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={hints === 0 ? "secondary" : "outline"}
                size="icon"
                className="h-10 w-auto px-3 sm:h-9 gap-1.5"
                onClick={handleHintClick}
                disabled={isComplete || hintPending}
              >
                <Lightbulb
                  className={cn("h-4 w-4", hints === 0 && "text-chart-3")}
                />
                <span className="tabular-nums text-xs">{hints}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {hints > 0 ? "Use hint" : "Buy hint"}
            </TooltipContent>
          </Tooltip>

          {!previewDisabled && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showPreview ? "default" : "outline"}
                  size="icon"
                  className="h-10 w-10 sm:h-9 sm:w-9"
                  onClick={() => {
                    playTap();
                    onTogglePreview();
                  }}
                  disabled={isComplete}
                >
                  <Layers className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview overlay</TooltipContent>
            </Tooltip>
          )}

          {!referenceDisabled && (
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 sm:h-9 sm:w-9"
                      onClick={playModalOpen}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Reference image</TooltipContent>
              </Tooltip>
              <DialogContent className="max-w-xs sm:max-w-sm p-5">
                <DialogHeader>
                  <DialogTitle className="font-display">
                    {puzzleName}
                  </DialogTitle>
                </DialogHeader>
                <img
                  src={imageUrl}
                  alt="Puzzle reference"
                  className="block w-full max-h-[55dvh] object-contain rounded-lg"
                  draggable={false}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Buy Hint AlertDialog */}
      <AlertDialog
        open={buyDialogOpen}
        onOpenChange={(open) => !isBuying && setBuyDialogOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Buy a Hint?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>Place a tile in its correct position automatically.</p>
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-3 py-2">
                  <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-chart-3" />
                    Cost
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {HINT_COST} coins
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-3 py-2">
                  <span className="text-sm font-medium text-foreground">
                    Your balance
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      canAfford ? "text-foreground" : "text-destructive",
                    )}
                  >
                    {coins} coins
                  </span>
                </div>
                {!canAfford && (
                  <p className="text-xs text-destructive">
                    Not enough coins to purchase a hint.
                  </p>
                )}
                {regenCountdown && hints < MAX_HINTS && (
                  <p className="text-xs text-muted-foreground">
                    Free hint regenerates in {regenCountdown}
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBuying}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBuyHint}
              disabled={isBuying || !canAfford}
            >
              {isBuying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isBuying ? "Buying..." : "Buy Hint"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
