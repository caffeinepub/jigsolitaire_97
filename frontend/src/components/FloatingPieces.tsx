import { Puzzle } from "lucide-react";

interface FloatingPiece {
  x: string;
  y: string;
  size: number;
  rotate: number;
  delay: number;
}

interface FloatingPiecesProps {
  pieces: FloatingPiece[];
  opacity?: string;
}

export function FloatingPieces({
  pieces,
  opacity = "opacity-[0.08] dark:opacity-[0.12]",
}: FloatingPiecesProps) {
  return (
    <>
      {pieces.map((piece, i) => (
        <Puzzle
          key={i}
          size={piece.size}
          className={`absolute text-primary ${opacity} animate-float pointer-events-none`}
          strokeWidth={1.5}
          style={
            {
              left: piece.x,
              top: piece.y,
              "--float-rotate": `${piece.rotate}deg`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${5 + (i % 3) * 1.5}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}
