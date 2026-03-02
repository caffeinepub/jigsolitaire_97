import { cellKey, type TileData, type GridSize } from "./tileEngine";

// Fisher-Yates shuffle that guarantees no tile stays in its original position (derangement)
export function createDerangement(
  tiles: TileData[],
  gridSize: GridSize,
): Map<string, TileData> {
  const positions: { row: number; col: number }[] = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      positions.push({ row: r, col: c });
    }
  }

  // Build a tile lookup by correct position
  const tileByPos = new Map<string, TileData>();
  for (const tile of tiles) {
    tileByPos.set(cellKey(tile.row, tile.col), tile);
  }

  // Shuffle positions using Fisher-Yates
  const shuffled = [...positions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Fix any tiles that ended up in their original position
  for (let i = 0; i < shuffled.length; i++) {
    if (
      shuffled[i].row === positions[i].row &&
      shuffled[i].col === positions[i].col
    ) {
      // Swap with the next position (wrapping around)
      const swapIdx = (i + 1) % shuffled.length;
      [shuffled[i], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[i]];
    }
  }

  // Build the board: each grid position gets the tile that was originally at shuffled[i]
  const board = new Map<string, TileData>();
  for (let i = 0; i < positions.length; i++) {
    const targetPos = positions[i];
    const sourcePos = shuffled[i];
    const tile = tileByPos.get(cellKey(sourcePos.row, sourcePos.col))!;
    board.set(cellKey(targetPos.row, targetPos.col), tile);
  }

  return board;
}
