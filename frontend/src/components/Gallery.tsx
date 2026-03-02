import { useState } from "react";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CATEGORIES } from "../utils/themes";
import {
  PUZZLE_IMAGES,
  getImageUrl,
  ALL_THEME_IDS,
} from "../utils/puzzleImages";
import type { ThemeData } from "../hooks/useQueries";
import { useAudio } from "../hooks/useAudio";
import { GalleryCategorySection } from "./GalleryCategorySection";

interface GalleryProps {
  themeProgress: [string, ThemeData][];
  onBack: () => void;
}

export function Gallery({ themeProgress, onBack }: GalleryProps) {
  const { playBack, playTap } = useAudio();
  const [selectedPhoto, setSelectedPhoto] = useState<{
    imageId: number;
    name: string;
  } | null>(null);

  const totalPuzzles = ALL_THEME_IDS.reduce(
    (sum, id) => sum + PUZZLE_IMAGES[id].length,
    0,
  );
  const totalCollected = themeProgress.reduce(
    (sum, [, data]) => sum + data.puzzleResults.length,
    0,
  );

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-0 py-4">
      <div className="w-full max-w-2xl mx-auto mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 px-2"
          onClick={() => {
            playBack();
            onBack();
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center gap-2 pr-2">
          <ImageIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground tabular-nums">
            {totalCollected}/{totalPuzzles} Collected
          </span>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
        {CATEGORIES.map((category) => (
          <GalleryCategorySection
            key={category.id}
            category={category}
            themeProgress={themeProgress}
            onSelectPhoto={(photo) => {
              playTap();
              setSelectedPhoto(photo);
            }}
            onToggle={playTap}
          />
        ))}
      </div>

      <Dialog
        open={!!selectedPhoto}
        onOpenChange={(open) => !open && setSelectedPhoto(null)}
      >
        <DialogContent className="max-w-xs sm:max-w-sm p-5">
          <DialogHeader>
            <DialogTitle className="font-display">
              {selectedPhoto?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <img
              src={getImageUrl(selectedPhoto.imageId)}
              alt={selectedPhoto.name}
              className="block w-full max-h-[55dvh] object-contain rounded-lg"
              draggable={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
