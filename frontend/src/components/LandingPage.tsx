import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { ThemeToggle } from "./ThemeToggle";
import { FloatingPieces } from "./FloatingPieces";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const FLOATING_PIECES = [
  { x: "6%", y: "12%", size: 52, rotate: 18, delay: 0 },
  { x: "88%", y: "8%", size: 38, rotate: -25, delay: 1.6 },
  { x: "4%", y: "68%", size: 44, rotate: -40, delay: 2.4 },
  { x: "82%", y: "78%", size: 48, rotate: 12, delay: 1.0 },
  { x: "16%", y: "40%", size: 28, rotate: 55, delay: 0.5 },
  { x: "76%", y: "28%", size: 32, rotate: -55, delay: 2.0 },
];

interface TileConfig {
  color: string;
  rotation: number;
}

const GRID_COLS = 5;
const GRID_ROWS = 4;

const TILES: TileConfig[] = [
  { color: "--chart-1", rotation: -1.2 },
  { color: "--chart-3", rotation: 0.8 },
  { color: "--chart-5", rotation: -0.5 },
  { color: "--chart-2", rotation: 1.5 },
  { color: "--chart-4", rotation: -0.8 },
  { color: "--chart-4", rotation: 0.5 },
  { color: "--chart-2", rotation: -1.5 },
  { color: "--chart-1", rotation: 0.3 },
  { color: "--chart-5", rotation: -1.0 },
  { color: "--chart-3", rotation: 1.2 },
  { color: "--chart-2", rotation: 1.0 },
  { color: "--chart-5", rotation: -0.3 },
  { color: "--chart-3", rotation: 0.8 },
  { color: "--chart-1", rotation: -1.5 },
  { color: "--chart-4", rotation: 0.5 },
  { color: "--chart-3", rotation: -0.8 },
  { color: "--chart-1", rotation: 1.2 },
  { color: "--chart-4", rotation: -1.0 },
  { color: "--chart-2", rotation: 0.5 },
  { color: "--chart-5", rotation: -1.2 },
];

function getTileDelay(index: number): number {
  const row = Math.floor(index / GRID_COLS);
  const col = index % GRID_COLS;
  const centerRow = (GRID_ROWS - 1) / 2;
  const centerCol = (GRID_COLS - 1) / 2;
  const distance = Math.sqrt((row - centerRow) ** 2 + (col - centerCol) ** 2);
  return 0.5 + distance * 0.18;
}

export function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="h-dvh overflow-hidden bg-landing relative flex flex-col items-center justify-center px-6">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30">
        <ThemeToggle />
      </div>

      {/* Floating puzzle piece outlines */}
      <FloatingPieces pieces={FLOATING_PIECES} />

      {/* Warm ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full bg-landing-glow opacity-[0.06] dark:opacity-[0.04] blur-3xl" />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Title */}
        <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none animate-title-bounce select-none">
          <span className="text-primary">Jig</span>
          <span className="text-foreground">solitaire</span>
        </h1>

        {/* Tagline */}
        <p className="mt-3 sm:mt-5 text-muted-foreground text-sm sm:text-base tracking-[0.25em] uppercase font-light animate-fade-up-delay-1">
          piece by piece
        </p>

        {/* Puzzle mosaic - tiles pop in center-outward */}
        <div className="mt-8 sm:mt-12 grid grid-cols-5 gap-1.5 sm:gap-2">
          {TILES.map((tile, i) => (
            <div
              key={i}
              className="animate-tile-pop"
              style={{ animationDelay: `${getTileDelay(i)}s` }}
            >
              <div
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-md"
                style={{
                  backgroundColor: `var(${tile.color})`,
                  transform: `rotate(${tile.rotation}deg)`,
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 6px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)",
                }}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className="mt-8 sm:mt-12 rounded-full px-10 h-12 text-base font-display font-semibold shadow-lg animate-fade-up-delay-3"
          onClick={() => login()}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing in...
            </span>
          ) : (
            "Start Puzzling"
          )}
        </Button>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-4 sm:bottom-6 text-center text-muted-foreground text-sm">
        © 2026. Built with ❤️ using{" "}
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
