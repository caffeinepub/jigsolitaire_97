import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomImage } from "../hooks/useQueries";

export interface PhotoTileProps {
  image: CustomImage;
  onPlay: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function PhotoTile({
  image,
  onPlay,
  onRename,
  onDelete,
}: PhotoTileProps) {
  return (
    <div className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-card shadow-xs">
      <button
        onClick={onPlay}
        className={cn(
          "w-full h-full",
          "transition-all active:scale-[0.96]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        )}
      >
        <img
          src={image.blob.getDirectURL()}
          alt={image.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </button>

      {/* Action buttons overlay */}
      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRename();
          }}
          className={cn(
            "p-1.5 rounded-full",
            "bg-black/50 text-white backdrop-blur-sm",
            "hover:bg-primary focus-visible:opacity-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={cn(
            "p-1.5 rounded-full",
            "bg-black/50 text-white backdrop-blur-sm",
            "hover:bg-destructive focus-visible:opacity-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* Name tooltip on hover */}
      <div
        className={cn(
          "absolute bottom-0 inset-x-0 px-1.5 py-1",
          "bg-gradient-to-t from-black/60 to-transparent",
          "opacity-0 group-hover:opacity-100 transition-opacity",
        )}
      >
        <p className="text-[10px] text-white truncate">{image.name}</p>
      </div>
    </div>
  );
}
