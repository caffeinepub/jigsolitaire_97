import { useRef, useCallback } from "react";
import type { TileData, GridSize } from "../utils/tileEngine";

interface UseTouchDragOptions {
  boardStateRef: React.RefObject<Map<string, TileData>>;
  boardRef: React.RefObject<HTMLDivElement | null>;
  gridSize: GridSize;
  performSwap: (keyA: string, keyB: string) => void;
  setSelectedCell: (cell: string | null) => void;
  setDragOverCell: (cell: string | null) => void;
}

export function useTouchDrag({
  boardStateRef,
  boardRef,
  gridSize,
  performSwap,
  setSelectedCell,
  setDragOverCell,
}: UseTouchDragOptions) {
  const touchDragRef = useRef<{
    sourceCellKey: string;
    ghost: HTMLDivElement;
  } | null>(null);

  const handleTouchDragStart = useCallback(
    (sourceCellKey: string, e: React.TouchEvent) => {
      const tile = boardStateRef.current.get(sourceCellKey);
      if (!tile) return;

      // Scale ghost to match actual cell size on screen
      const boardEl = boardRef.current;
      const cellSize = boardEl
        ? Math.round(boardEl.offsetWidth / gridSize)
        : 80;
      const ghostSize = Math.min(cellSize, 100);
      const halfGhost = ghostSize / 2;

      const touch = e.touches[0];
      const ghost = document.createElement("div");
      ghost.style.position = "fixed";
      ghost.style.width = `${ghostSize}px`;
      ghost.style.height = `${ghostSize}px`;
      ghost.style.zIndex = "9999";
      ghost.style.pointerEvents = "none";
      ghost.style.opacity = "0.85";
      ghost.style.borderRadius = "6px";
      ghost.style.overflow = "hidden";
      ghost.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
      ghost.style.left = `${touch.clientX - halfGhost}px`;
      ghost.style.top = `${touch.clientY - halfGhost}px`;

      const img = document.createElement("img");
      img.src = tile.imageDataUrl;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      ghost.appendChild(img);
      document.body.appendChild(ghost);

      touchDragRef.current = { sourceCellKey, ghost };

      const handleTouchMove = (ev: TouchEvent) => {
        const drag = touchDragRef.current;
        if (!drag) return;
        ev.preventDefault();

        const t = ev.touches[0];
        drag.ghost.style.left = `${t.clientX - halfGhost}px`;
        drag.ghost.style.top = `${t.clientY - halfGhost}px`;

        const el = document.elementFromPoint(t.clientX, t.clientY);
        const cell = el?.closest("[data-cell-key]") as HTMLElement | null;
        setDragOverCell(cell?.dataset.cellKey ?? null);
      };

      const handleTouchEnd = (ev: TouchEvent) => {
        const drag = touchDragRef.current;
        if (!drag) return;

        const t = ev.changedTouches[0];
        drag.ghost.remove();
        touchDragRef.current = null;
        setDragOverCell(null);

        const el = document.elementFromPoint(t.clientX, t.clientY);
        const cell = el?.closest("[data-cell-key]") as HTMLElement | null;
        const targetKey = cell?.dataset.cellKey;

        if (targetKey && targetKey !== drag.sourceCellKey) {
          performSwap(drag.sourceCellKey, targetKey);
          setSelectedCell(null);
        }

        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    },
    [
      boardStateRef,
      boardRef,
      gridSize,
      performSwap,
      setSelectedCell,
      setDragOverCell,
    ],
  );

  return { handleTouchDragStart };
}
