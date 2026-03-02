import { useState } from "react";
import { Coins, Pencil, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAudio } from "../hooks/useAudio";
import { ProfileSetupDialog } from "./ProfileSetupDialog";
import { SettingsDialog } from "./SettingsDialog";

interface HeaderProps {
  coins?: number;
  userName: string;
}

export function Header({ coins = 0, userName }: HeaderProps) {
  const queryClient = useQueryClient();
  const { clear } = useInternetIdentity();
  const { playTap, playModalOpen } = useAudio();
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = () => {
    queryClient.clear();
    clear();
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/60">
        <div className="flex items-center h-14 px-3 gap-2">
          {/* Left: brand */}
          <span className="font-display font-bold text-lg select-none">
            <span className="text-primary">Jig</span>
            <span className="text-foreground">solitaire</span>
          </span>

          <div className="flex-1" />

          {/* Right: coins, settings, avatar */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5">
              <Coins className="h-4 w-4 text-chart-3" />
              <span className="text-sm font-semibold tabular-nums">
                {coins}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary"
              onClick={() => {
                playModalOpen();
                setSettingsOpen(true);
              }}
            >
              <Settings className="h-[18px] w-[18px]" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0"
                >
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Welcome, {userName}!</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    playTap();
                    setEditNameOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile Name
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    playTap();
                    handleLogout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <ProfileSetupDialog
        open={editNameOpen}
        onOpenChange={setEditNameOpen}
        currentName={userName}
      />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
