import type { LucideIcon } from "lucide-react";
import {
  Footprints,
  Crown,
  Zap,
  Star,
  Images,
  ShieldCheck,
  Compass,
  Globe,
  Trophy,
} from "lucide-react";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_steps",
    name: "First Steps",
    description: "Solve your first puzzle",
    icon: Footprints,
  },
  {
    id: "theme_master",
    name: "Theme Master",
    description: "Complete all puzzles in a theme",
    icon: Crown,
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Complete a puzzle in under 60 seconds",
    icon: Zap,
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Earn 3 stars on all puzzles in a theme",
    icon: Star,
  },
  {
    id: "collector",
    name: "Collector",
    description: "Complete 10 puzzles across all themes",
    icon: Images,
  },
  {
    id: "hint_free",
    name: "Hint-Free",
    description: "Complete a hard puzzle without using hints",
    icon: ShieldCheck,
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Solve puzzles in 10 different themes",
    icon: Compass,
  },
  {
    id: "globetrotter",
    name: "Globetrotter",
    description: "Complete all puzzles in 25 themes",
    icon: Globe,
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Complete every puzzle in every theme",
    icon: Trophy,
  },
];

export function getAchievementDef(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
