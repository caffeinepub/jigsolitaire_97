import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ThemeData {
    puzzleResults: Array<PuzzleResult>;
}
export type ThemeId = string;
export interface UserImage {
    id: bigint;
    blob: ExternalBlob;
    name: string;
    createdAt: bigint;
}
export interface PuzzleResult {
    bestTime: bigint;
    stars: bigint;
}
export interface UserProgress {
    hints: bigint;
    coins: bigint;
    achievements: Array<string>;
    themeProgress: Array<[ThemeId, ThemeData]>;
    lastHintRegenTime: bigint;
    lastDailyDay: bigint;
}
export interface UserProfile {
    name: string;
}
export interface backendInterface {
    buyHint(): Promise<void>;
    completeDailyPuzzle(hintsUsed: bigint, timeSec: bigint, gridSize: bigint, moves: bigint): Promise<[bigint, bigint]>;
    completePuzzle(themeId: ThemeId, puzzleIndex: bigint, hintsUsed: bigint, timeSec: bigint, gridSize: bigint, moves: bigint, timedCompletion: boolean): Promise<[bigint, bigint, boolean, Array<string>]>;
    deleteImage(imageId: bigint): Promise<void>;
    getMyImages(): Promise<Array<UserImage>>;
    getProfile(): Promise<UserProfile | null>;
    getProgress(): Promise<UserProgress>;
    renameImage(imageId: bigint, newName: string): Promise<void>;
    setProfile(name: string): Promise<void>;
    startPuzzle(themeId: ThemeId, puzzleIndex: bigint, gridSize: bigint): Promise<void>;
    uploadImage(name: string, blob: ExternalBlob): Promise<UserImage>;
    useHint(): Promise<void>;
}
