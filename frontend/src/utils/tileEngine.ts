export type GridSize = 3 | 4 | 5;

export interface TileData {
  id: number;
  row: number;
  col: number;
  imageDataUrl: string;
}

export function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

// Generate colored placeholder tiles when image fails to load
export function generateFallbackTiles(gridSize: GridSize): TileData[] {
  const tileSize = 120;
  const canvas = document.createElement("canvas");
  canvas.width = tileSize;
  canvas.height = tileSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas 2d context");

  const tiles: TileData[] = [];
  let id = 0;
  const total = gridSize * gridSize;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const hue = Math.round((id / total) * 360);
      const lightness = 45 + (id % 3) * 8;
      ctx.fillStyle = `hsl(${hue}, 60%, ${lightness}%)`;
      ctx.fillRect(0, 0, tileSize, tileSize);

      // Draw position number so tiles are distinguishable
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = `bold ${Math.round(tileSize * 0.4)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${id + 1}`, tileSize / 2, tileSize / 2);

      tiles.push({
        id,
        row,
        col,
        imageDataUrl: canvas.toDataURL("image/png"),
      });
      id++;
    }
  }

  return tiles;
}

export function sliceImageIntoTiles(
  image: HTMLImageElement,
  gridSize: GridSize,
): TileData[] {
  const tileWidth = Math.floor(image.naturalWidth / gridSize);
  const tileHeight = Math.floor(image.naturalHeight / gridSize);

  const canvas = document.createElement("canvas");
  canvas.width = tileWidth;
  canvas.height = tileHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas 2d context");
  }

  const tiles: TileData[] = [];
  let id = 0;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      ctx.clearRect(0, 0, tileWidth, tileHeight);
      ctx.drawImage(
        image,
        col * tileWidth,
        row * tileHeight,
        tileWidth,
        tileHeight,
        0,
        0,
        tileWidth,
        tileHeight,
      );

      tiles.push({
        id,
        row,
        col,
        imageDataUrl: canvas.toDataURL("image/png"),
      });

      id++;
    }
  }

  return tiles;
}
