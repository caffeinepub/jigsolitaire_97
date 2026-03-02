import {
  Coins,
  Lightbulb,
  Trophy,
  Play,
  Award,
  Image,
  Camera,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DailyPuzzleButton } from "./DailyPuzzleButton";
import { FloatingPieces } from "./FloatingPieces";
import { StatItem } from "./StatItem";
import { useAudio } from "../hooks/useAudio";

const FLOATING_PIECES = [
  { x: "8%", y: "18%", size: 36, rotate: 22, delay: 0.3 },
  { x: "85%", y: "12%", size: 28, rotate: -30, delay: 1.8 },
  { x: "6%", y: "72%", size: 32, rotate: -45, delay: 2.2 },
  { x: "88%", y: "68%", size: 30, rotate: 15, delay: 1.0 },
];

interface HomeMenuProps {
  onNavigate: (
    screen: "play" | "daily" | "achievements" | "gallery" | "customPhotos",
  ) => void;
  stats: {
    coins: number;
    hints: number;
    puzzlesCompleted: number;
    totalStars: number;
  };
  dailyCompleted?: boolean;
}

export function HomeMenu({ onNavigate, stats, dailyCompleted }: HomeMenuProps) {
  const { playNavigate } = useAudio();

  const navigate = (
    screen: "play" | "daily" | "achievements" | "gallery" | "customPhotos",
  ) => {
    playNavigate();
    onNavigate(screen);
  };

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center px-6 py-8 overflow-hidden">
      {/* Floating puzzle pieces */}
      <FloatingPieces
        pieces={FLOATING_PIECES}
        opacity="opacity-[0.06] dark:opacity-[0.08]"
      />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xs">
        {/* Title */}
        <h1 className="font-display font-bold text-4xl sm:text-5xl leading-none select-none animate-fade-up">
          <span className="text-primary">Jig</span>
          <span className="text-foreground">solitaire</span>
        </h1>
        <p className="mt-2 text-muted-foreground text-xs tracking-[0.2em] uppercase font-light animate-fade-up-delay-1">
          piece by piece
        </p>

        {/* Menu buttons */}
        <div className="mt-10 w-full flex flex-col gap-3 animate-fade-up-delay-2">
          <Button
            size="lg"
            className="w-full h-14 rounded-xl text-base font-display font-semibold shadow-md"
            onClick={() => navigate("play")}
          >
            <Play className="h-5 w-5 mr-2 fill-current" />
            Play
          </Button>

          <DailyPuzzleButton
            completed={!!dailyCompleted}
            onPlay={() => navigate("daily")}
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-12 rounded-xl font-display font-medium"
              onClick={() => navigate("achievements")}
            >
              <Award className="h-5 w-5 mr-1.5" />
              Achievements
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-12 rounded-xl font-display font-medium"
              onClick={() => navigate("gallery")}
            >
              <Image className="h-5 w-5 mr-1.5" />
              Gallery
            </Button>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 rounded-xl font-display font-medium"
            onClick={() => navigate("customPhotos")}
          >
            <Camera className="h-5 w-5 mr-1.5" />
            My Photos
          </Button>
        </div>

        {/* Stats bar */}
        <div className="mt-6 w-full animate-fade-up-delay-2">
          <div className="flex items-center justify-around rounded-xl border border-border bg-card/60 backdrop-blur-sm px-4 py-3">
            <StatItem
              icon={Star}
              label="Stars"
              value={stats.totalStars}
              iconClass="text-chart-3"
            />
            <div className="w-px h-8 bg-border" />
            <StatItem
              icon={Coins}
              label="Coins"
              value={stats.coins}
              iconClass="text-chart-3"
            />
            <div className="w-px h-8 bg-border" />
            <StatItem
              icon={Lightbulb}
              label="Hints"
              value={stats.hints}
              iconClass="text-primary"
            />
            <div className="w-px h-8 bg-border" />
            <StatItem
              icon={Trophy}
              label="Solved"
              value={stats.puzzlesCompleted}
              iconClass="text-chart-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
