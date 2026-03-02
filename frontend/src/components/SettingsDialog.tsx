import { Volume2, Music, Sun, Moon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useSoundEnabled, useMusicEnabled, useAudio } from "../hooks/useAudio";
import { ensureAudioContext } from "../utils/sounds";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [soundEnabled, setSoundEnabled] = useSoundEnabled();
  const [musicEnabled, setMusicEnabled] = useMusicEnabled();
  const { playToggle } = useAudio();

  const handleSoundToggle = async (checked: boolean) => {
    if (checked) {
      await ensureAudioContext();
      setSoundEnabled(checked);
      playToggle();
    } else {
      playToggle();
      setSoundEnabled(checked);
    }
  };

  const handleMusicToggle = async (checked: boolean) => {
    if (checked) {
      await ensureAudioContext();
    }
    setMusicEnabled(checked);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Sound Effects</p>
                <p className="text-xs text-muted-foreground">
                  Tile clicks and swap sounds
                </p>
              </div>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={handleSoundToggle}
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Music className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Music</p>
                <p className="text-xs text-muted-foreground">
                  Relaxing ambient background music
                </p>
              </div>
            </div>
            <Switch
              checked={musicEnabled}
              onCheckedChange={handleMusicToggle}
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <div>
                <p className="font-medium text-sm">Dark Mode</p>
                <p className="text-xs text-muted-foreground">
                  Switch between light and dark theme
                </p>
              </div>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={(checked) => {
                playToggle();
                setTheme(checked ? "dark" : "light");
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
