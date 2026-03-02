import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  SOUND_ENABLED_STORAGE_KEY,
  MUSIC_ENABLED_STORAGE_KEY,
} from "../utils/constants";
import {
  playTileSelect as _playTileSelect,
  playTileSwap as _playTileSwap,
  playTileLock as _playTileLock,
  playPuzzleComplete as _playPuzzleComplete,
  playHintUsed as _playHintUsed,
  playLockedTap as _playLockedTap,
  playUndo as _playUndo,
  playNavigate as _playNavigate,
  playBack as _playBack,
  playTap as _playTap,
  playToggle as _playToggle,
  playModalOpen as _playModalOpen,
} from "../utils/sounds";
import { startMusic, stopMusic } from "../utils/music";

// Sound effects external store
let soundEnabled = true;
try {
  soundEnabled = localStorage.getItem(SOUND_ENABLED_STORAGE_KEY) !== "false";
} catch {
  // localStorage may be unavailable
}
const soundListeners = new Set<() => void>();

function soundSubscribe(cb: () => void) {
  soundListeners.add(cb);
  return () => soundListeners.delete(cb);
}

function getSoundSnapshot() {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  localStorage.setItem(SOUND_ENABLED_STORAGE_KEY, String(enabled));
  soundListeners.forEach((cb) => cb());
}

export function useSoundEnabled(): [boolean, (enabled: boolean) => void] {
  const enabled = useSyncExternalStore(soundSubscribe, getSoundSnapshot);
  return [enabled, setSoundEnabled];
}

// Music external store
let musicEnabled = true;
try {
  musicEnabled = localStorage.getItem(MUSIC_ENABLED_STORAGE_KEY) !== "false";
} catch {
  // localStorage may be unavailable
}
const musicListeners = new Set<() => void>();

function musicSubscribe(cb: () => void) {
  musicListeners.add(cb);
  return () => musicListeners.delete(cb);
}

function getMusicSnapshot() {
  return musicEnabled;
}

export function setMusicEnabled(enabled: boolean) {
  musicEnabled = enabled;
  localStorage.setItem(MUSIC_ENABLED_STORAGE_KEY, String(enabled));
  musicListeners.forEach((cb) => cb());
}

export function useMusicEnabled(): [boolean, (enabled: boolean) => void] {
  const enabled = useSyncExternalStore(musicSubscribe, getMusicSnapshot);

  useEffect(() => {
    if (enabled) {
      startMusic();
    } else {
      stopMusic();
    }
  }, [enabled]);

  return [enabled, setMusicEnabled];
}

export function useAudio() {
  const enabled = useSyncExternalStore(soundSubscribe, getSoundSnapshot);

  const playTileSelect = useCallback(() => {
    if (enabled) _playTileSelect();
  }, [enabled]);

  const playTileSwap = useCallback(() => {
    if (enabled) _playTileSwap();
  }, [enabled]);

  const playTileLock = useCallback(() => {
    if (enabled) _playTileLock();
  }, [enabled]);

  const playPuzzleComplete = useCallback(() => {
    if (enabled) _playPuzzleComplete();
  }, [enabled]);

  const playHintUsed = useCallback(() => {
    if (enabled) _playHintUsed();
  }, [enabled]);

  const playLockedTap = useCallback(() => {
    if (enabled) _playLockedTap();
  }, [enabled]);

  const playUndo = useCallback(() => {
    if (enabled) _playUndo();
  }, [enabled]);

  const playNavigate = useCallback(() => {
    if (enabled) _playNavigate();
  }, [enabled]);

  const playBack = useCallback(() => {
    if (enabled) _playBack();
  }, [enabled]);

  const playTap = useCallback(() => {
    if (enabled) _playTap();
  }, [enabled]);

  const playToggle = useCallback(() => {
    if (enabled) _playToggle();
  }, [enabled]);

  const playModalOpen = useCallback(() => {
    if (enabled) _playModalOpen();
  }, [enabled]);

  return {
    playTileSelect,
    playTileSwap,
    playTileLock,
    playPuzzleComplete,
    playHintUsed,
    playLockedTap,
    playUndo,
    playNavigate,
    playBack,
    playTap,
    playToggle,
    playModalOpen,
  };
}
