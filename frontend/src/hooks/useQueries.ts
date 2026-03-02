import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";
import { ExternalBlob, type UserImage as RawUserImage } from "../backend";

// Frontend types (bigint → number conversions)
export interface PuzzleResult {
  stars: number;
  bestTime: number;
}

export interface ThemeData {
  puzzleResults: PuzzleResult[];
}

export interface UserProgress {
  coins: number;
  hints: number;
  lastHintRegenTime: number;
  themeProgress: [string, ThemeData][];
  achievements: string[];
  lastDailyDay: number;
}

export interface CompletionResult {
  coinsEarned: number;
  stars: number;
  isFirstTime: boolean;
  newAchievements: string[];
}

function convertThemeData(raw: {
  puzzleResults: { stars: bigint; bestTime: bigint }[];
}): ThemeData {
  return {
    puzzleResults: raw.puzzleResults.map((r) => ({
      stars: Number(r.stars),
      bestTime: Number(r.bestTime),
    })),
  };
}

function convertProgress(raw: {
  coins: bigint;
  hints: bigint;
  lastHintRegenTime: bigint;
  themeProgress: [
    string,
    { puzzleResults: { stars: bigint; bestTime: bigint }[] },
  ][];
  achievements: string[];
  lastDailyDay: bigint;
}): UserProgress {
  return {
    coins: Number(raw.coins),
    hints: Number(raw.hints),
    lastHintRegenTime: Number(raw.lastHintRegenTime),
    themeProgress: raw.themeProgress.map(([id, data]) => [
      id,
      convertThemeData(data),
    ]),
    achievements: raw.achievements,
    lastDailyDay: Number(raw.lastDailyDay),
  };
}

// Profile hooks
export function useProfile() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ["profile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getProfile();
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSetProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.setProfile(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", identity?.getPrincipal().toString()],
      });
    },
  });
}

// Game hooks
export function useGetProgress() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserProgress>({
    queryKey: ["progress", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const raw = await actor.getProgress();
      return convertProgress(raw);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useStartPuzzle() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      themeId,
      puzzleIndex,
      gridSize,
    }: {
      themeId: string;
      puzzleIndex: number;
      gridSize: number;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.startPuzzle(themeId, BigInt(puzzleIndex), BigInt(gridSize));
    },
  });
}

export function useCompletePuzzle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      themeId,
      puzzleIndex,
      hintsUsed,
      timeSec,
      gridSize,
      moves,
      timedCompletion,
    }: {
      themeId: string;
      puzzleIndex: number;
      hintsUsed: number;
      timeSec: number;
      gridSize: number;
      moves: number;
      timedCompletion: boolean;
    }): Promise<CompletionResult> => {
      if (!actor) throw new Error("Actor not ready");
      const [coinsEarned, stars, isFirstTime, newAchievements] =
        await actor.completePuzzle(
          themeId,
          BigInt(puzzleIndex),
          BigInt(hintsUsed),
          BigInt(timeSec),
          BigInt(gridSize),
          BigInt(moves),
          timedCompletion,
        );
      return {
        coinsEarned: Number(coinsEarned),
        stars: Number(stars),
        isFirstTime,
        newAchievements: newAchievements as string[],
      };
    },
    onMutate: async () => {
      const queryKey = ["progress", identity?.getPrincipal().toString()];
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });
      // Snapshot previous value for rollback
      const previousProgress = queryClient.getQueryData<UserProgress>(queryKey);
      return { previousProgress };
    },
    onSuccess: (result) => {
      const queryKey = ["progress", identity?.getPrincipal().toString()];
      // Immediately update cached coins so the header reflects the new total
      queryClient.setQueryData<UserProgress>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, coins: old.coins + result.coinsEarned };
      });
    },
    onError: (_err, _variables, context) => {
      const queryKey = ["progress", identity?.getPrincipal().toString()];
      // Rollback to snapshot on failure
      if (context?.previousProgress) {
        queryClient.setQueryData(queryKey, context.previousProgress);
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["progress", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useConsumeHint() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      await actor.useHint();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["progress", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useBuyHint() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      await actor.buyHint();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["progress", identity?.getPrincipal().toString()],
      });
    },
  });
}

export interface DailyCompletionResult {
  coinsEarned: number;
  stars: number;
}

export function useCompleteDailyPuzzle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      hintsUsed,
      timeSec,
      gridSize,
      moves,
    }: {
      hintsUsed: number;
      timeSec: number;
      gridSize: number;
      moves: number;
    }): Promise<DailyCompletionResult> => {
      if (!actor) throw new Error("Actor not ready");
      const [coinsEarned, stars] = await actor.completeDailyPuzzle(
        BigInt(hintsUsed),
        BigInt(timeSec),
        BigInt(gridSize),
        BigInt(moves),
      );
      return {
        coinsEarned: Number(coinsEarned),
        stars: Number(stars),
      };
    },
    onSuccess: (result) => {
      const queryKey = ["progress", identity?.getPrincipal().toString()];
      queryClient.setQueryData<UserProgress>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, coins: old.coins + result.coinsEarned };
      });
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

// Custom image types
export interface CustomImage {
  id: number;
  name: string;
  blob: ExternalBlob;
  createdAt: number;
}

function convertUserImage(raw: RawUserImage): CustomImage {
  return {
    id: Number(raw.id),
    name: raw.name,
    blob: raw.blob,
    createdAt: Number(raw.createdAt),
  };
}

// Custom image hooks
export function useGetUserImages() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CustomImage[]>({
    queryKey: ["userImages", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const raw = await actor.getMyImages();
      return raw.map(convertUserImage);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useUploadImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      name,
      bytes,
      onProgress,
    }: {
      name: string;
      bytes: Uint8Array<ArrayBuffer>;
      onProgress?: (pct: number) => void;
    }): Promise<CustomImage> => {
      if (!actor) throw new Error("Actor not ready");
      const blob = ExternalBlob.fromBytes(bytes);
      if (onProgress) {
        blob.withUploadProgress(onProgress);
      }
      const raw = await actor.uploadImage(name, blob);
      return convertUserImage(raw);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userImages", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useRenameImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      imageId,
      newName,
    }: {
      imageId: number;
      newName: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.renameImage(BigInt(imageId), newName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userImages", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useDeleteImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (imageId: number) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.deleteImage(BigInt(imageId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userImages", identity?.getPrincipal().toString()],
      });
    },
  });
}
