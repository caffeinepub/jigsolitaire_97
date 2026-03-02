import { useState, useRef } from "react";
import { ArrowLeft, Camera, Grid3X3, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetUserImages,
  useUploadImage,
  useRenameImage,
  useDeleteImage,
  type CustomImage,
} from "../hooks/useQueries";
import { processImage, validateImageFile } from "../utils/imageProcessor";
import type { GridSize } from "../utils/tileEngine";
import { useAudio } from "../hooks/useAudio";
import { PhotoTile } from "./PhotoTile";

const GRID_OPTIONS: { size: GridSize; label: string; description: string }[] = [
  { size: 3, label: "3x3", description: "Easy" },
  { size: 4, label: "4x4", description: "Medium" },
  { size: 5, label: "5x5", description: "Hard" },
];

interface CustomPhotosProps {
  onBack: () => void;
  onPlayImage: (image: CustomImage, gridSize: GridSize) => void;
}

export function CustomPhotos({ onBack, onPlayImage }: CustomPhotosProps) {
  const { playBack, playTap, playNavigate } = useAudio();
  const { data: images, isLoading, isError } = useGetUserImages();
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();
  const { mutate: renameImage, isPending: isRenaming } = useRenameImage();
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteImage();
  const [imageToDelete, setImageToDelete] = useState<CustomImage | null>(null);
  const [imageToRename, setImageToRename] = useState<CustomImage | null>(null);
  const [renameName, setRenameName] = useState("");
  const [imageToPlay, setImageToPlay] = useState<CustomImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected
    e.target.value = "";

    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const toastId = toast.loading("Processing image...");

    try {
      const processed = await processImage(file);

      toast.loading("Uploading...", { id: toastId });

      uploadImage(
        {
          name: processed.name,
          bytes: processed.bytes,
          onProgress: (pct) => {
            toast.loading(`Uploading... ${Math.round(pct)}%`, { id: toastId });
          },
        },
        {
          onSuccess: () => {
            toast.success("Photo uploaded", { id: toastId });
          },
          onError: (err) => {
            toast.error(err.message || "Upload failed", { id: toastId });
          },
        },
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to process image",
        { id: toastId },
      );
    }
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageToRename) return;
    const trimmed = renameName.trim();
    if (!trimmed) return;
    renameImage(
      { imageId: imageToRename.id, newName: trimmed },
      {
        onSuccess: () => {
          toast.success("Photo renamed");
          setImageToRename(null);
        },
        onError: () => {
          toast.error("Failed to rename photo");
        },
      },
    );
  };

  const handleDelete = () => {
    if (!imageToDelete) return;
    deleteImage(imageToDelete.id, {
      onSuccess: () => {
        toast.success("Photo deleted");
        setImageToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete photo");
      },
    });
  };

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-0 py-4">
      <div className="w-full max-w-lg mx-auto mb-4 flex items-center justify-between">
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
          <Camera className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground tabular-nums">
            {images?.length ?? 0}/50 Photos
          </span>
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-destructive">
            Failed to load photos.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {/* Upload button tile */}
            <button
              onClick={() => {
                playTap();
                fileInputRef.current?.click();
              }}
              disabled={isUploading || (images && images.length >= 50)}
              className={cn(
                "aspect-square rounded-lg border-2 border-dashed border-border",
                "flex flex-col items-center justify-center gap-1.5",
                "transition-all text-muted-foreground",
                "hover:border-primary/50 hover:text-primary hover:bg-primary/5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-muted-foreground disabled:hover:bg-transparent",
              )}
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Plus className="h-6 w-6" />
              )}
              <span className="text-[10px] font-medium">
                {isUploading ? "Uploading" : "Add Photo"}
              </span>
            </button>

            {images?.map((image) => (
              <PhotoTile
                key={image.id}
                image={image}
                onPlay={() => setImageToPlay(image)}
                onRename={() => {
                  setImageToRename(image);
                  setRenameName(image.name);
                }}
                onDelete={() => setImageToDelete(image)}
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && images?.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Upload your own photos to create custom puzzles
          </p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Rename dialog */}
      <Dialog
        open={!!imageToRename}
        onOpenChange={(open) => !open && !isRenaming && setImageToRename(null)}
      >
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Rename Photo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRename} className="flex flex-col gap-3 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="rename-input">Name</Label>
              <Input
                id="rename-input"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                maxLength={50}
                autoFocus
                disabled={isRenaming}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isRenaming}
                onClick={() => setImageToRename(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isRenaming || !renameName.trim()}>
                {isRenaming && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isRenaming ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Grid size picker */}
      <Dialog
        open={!!imageToPlay}
        onOpenChange={(open) => !open && setImageToPlay(null)}
      >
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-center">Choose Difficulty</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-2">
            {GRID_OPTIONS.map((opt) => (
              <Button
                key={opt.size}
                variant="outline"
                className="h-12 justify-between px-4"
                onClick={() => {
                  if (imageToPlay) {
                    playNavigate();
                    onPlayImage(imageToPlay, opt.size);
                    setImageToPlay(null);
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{opt.label}</span>
                </span>
                <span className="text-sm text-muted-foreground">
                  {opt.description}
                </span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!imageToDelete}
        onOpenChange={(open) => !open && !isDeleting && setImageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &ldquo;{imageToDelete?.name}&rdquo;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
