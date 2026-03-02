import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useProfile, useGetProgress } from "../hooks/useQueries";
import { ProfileSetupDialog } from "./ProfileSetupDialog";
import { Header } from "./Header";
import { HomeMenu } from "./HomeMenu";
import { GameScreen } from "./GameScreen";
import { ThemeSelect } from "./ThemeSelect";
import { PuzzleList } from "./PuzzleList";
import { Gallery } from "./Gallery";
import { Achievements } from "./Achievements";
import { CustomPhotos } from "./CustomPhotos";
import type { CustomImage } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { PUZZLE_IMAGES, type ThemeId } from "../utils/puzzleImages";
import { getPuzzleGridSize, getTotalStars } from "../utils/constants";
import { getDailyPuzzle } from "../utils/dailyPuzzle";
import type { GridSize } from "../utils/tileEngine";

type Screen =
  | "home"
  | "themeSelect"
  | "puzzleList"
  | "game"
  | "gallery"
  | "achievements"
  | "dailyGame"
  | "customPhotos"
  | "customGame";

export function AuthenticatedApp() {
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isProfileError,
  } = useProfile();
  const { data: progress, isError: isProgressError } = useGetProgress();
  const hasProfile = profile && profile.name;

  const [screen, setScreen] = useState<Screen>("home");
  const [selectedTheme, setSelectedTheme] = useState<ThemeId | null>(null);
  const [gameParams, setGameParams] = useState<{
    themeId: ThemeId;
    imageId: number;
    puzzleName: string;
    gridSize: GridSize;
    puzzleIndex: number;
    timedMode: boolean;
  } | null>(null);
  const [customGameParams, setCustomGameParams] = useState<{
    image: CustomImage;
    gridSize: GridSize;
  } | null>(null);

  const stats = {
    coins: progress?.coins ?? 0,
    hints: progress?.hints ?? 0,
    puzzlesCompleted:
      progress?.themeProgress.reduce(
        (sum, [, data]) => sum + data.puzzleResults.length,
        0,
      ) ?? 0,
    totalStars: getTotalStars(progress?.themeProgress ?? []),
  };

  const handleHomeNavigate = (
    target: "play" | "daily" | "achievements" | "gallery" | "customPhotos",
  ) => {
    switch (target) {
      case "play":
        setScreen("themeSelect");
        break;
      case "daily":
        setScreen("dailyGame");
        break;
      case "achievements":
        setScreen("achievements");
        break;
      case "gallery":
        setScreen("gallery");
        break;
      case "customPhotos":
        setScreen("customPhotos");
        break;
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isProfileError || isProgressError) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive">
            {isProfileError
              ? "Failed to load profile."
              : "Failed to load game progress."}
          </p>
          <Button
            variant="link"
            size="sm"
            onClick={() => window.location.reload()}
            className="mt-2 text-muted-foreground"
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileSetupDialog open={!hasProfile} />
      {hasProfile && (
        <div className="min-h-dvh bg-background flex flex-col">
          <Header coins={stats.coins} userName={profile.name} />

          {screen === "home" && (
            <HomeMenu
              onNavigate={handleHomeNavigate}
              stats={stats}
              dailyCompleted={
                progress?.lastDailyDay === Math.floor(Date.now() / 86_400_000)
              }
            />
          )}

          {screen === "game" && gameParams && (
            <GameScreen
              themeId={gameParams.themeId}
              imageId={gameParams.imageId}
              puzzleName={gameParams.puzzleName}
              gridSize={gameParams.gridSize}
              puzzleIndex={gameParams.puzzleIndex}
              timedMode={gameParams.timedMode}
              onBack={() => setScreen("puzzleList")}
              onNextPuzzle={(() => {
                const puzzles = PUZZLE_IMAGES[gameParams.themeId];
                const nextIndex = gameParams.puzzleIndex + 1;
                if (nextIndex >= puzzles.length) return null;
                const next = puzzles[nextIndex];
                return () => {
                  setGameParams({
                    themeId: gameParams.themeId,
                    imageId: next.imageId,
                    puzzleName: next.name,
                    gridSize: getPuzzleGridSize(nextIndex),
                    puzzleIndex: nextIndex,
                    timedMode: gameParams.timedMode,
                  });
                };
              })()}
            />
          )}

          {screen === "themeSelect" && (
            <ThemeSelect
              themeProgress={progress?.themeProgress ?? []}
              onSelectTheme={(themeId) => {
                setSelectedTheme(themeId);
                setScreen("puzzleList");
              }}
              onBack={() => setScreen("home")}
            />
          )}

          {screen === "puzzleList" && selectedTheme && (
            <PuzzleList
              themeId={selectedTheme}
              themeData={
                progress?.themeProgress.find(
                  ([id]) => id === selectedTheme,
                )?.[1]
              }
              onSelectPuzzle={(params) => {
                setGameParams(params);
                setScreen("game");
              }}
              onBack={() => setScreen("themeSelect")}
            />
          )}

          {screen === "gallery" && (
            <Gallery
              themeProgress={progress?.themeProgress ?? []}
              onBack={() => setScreen("home")}
            />
          )}

          {screen === "achievements" && (
            <Achievements
              progress={progress}
              onBack={() => setScreen("home")}
            />
          )}

          {screen === "customPhotos" && (
            <CustomPhotos
              onBack={() => setScreen("home")}
              onPlayImage={(image, gridSize) => {
                setCustomGameParams({ image, gridSize });
                setScreen("customGame");
              }}
            />
          )}

          {screen === "customGame" && customGameParams && (
            <GameScreen
              themeId={"nature"}
              imageId={0}
              puzzleName={customGameParams.image.name}
              gridSize={customGameParams.gridSize}
              puzzleIndex={0}
              timedMode={false}
              onBack={() => setScreen("customPhotos")}
              onNextPuzzle={null}
              customMode
              customImageUrl={customGameParams.image.blob.getDirectURL()}
            />
          )}

          {screen === "dailyGame" &&
            (() => {
              const daily = getDailyPuzzle();
              return (
                <GameScreen
                  themeId={daily.themeId}
                  imageId={daily.imageId}
                  puzzleName={daily.name}
                  gridSize={daily.gridSize}
                  puzzleIndex={0}
                  timedMode={false}
                  onBack={() => setScreen("home")}
                  onNextPuzzle={null}
                  dailyMode
                />
              );
            })()}
        </div>
      )}
    </>
  );
}
