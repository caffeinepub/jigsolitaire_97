// Background music using Tone.js
// Cheerful, light procedural music fitting a casual puzzle game

import { ensureAudioContext } from "./sounds";

// Major pentatonic melody fragments — playful and bright
const MELODY_PATTERNS: Tone.Frequency[][] = [
  ["C5", "E5", "G5", "A5"],
  ["G5", "E5", "C5", "D5"],
  ["A4", "C5", "E5", "G5"],
  ["E5", "D5", "C5", "G4"],
  ["D5", "E5", "G5", "C6"],
  ["G5", "A5", "G5", "E5"],
  ["C5", "D5", "E5", "G5"],
  ["A5", "G5", "E5", "D5"],
];

// Bass roots following a bright major progression
const BASS_NOTES: Tone.Frequency[] = [
  "C3",
  "G3",
  "A2",
  "F3",
  "C3",
  "G3",
  "F3",
  "C3",
];

let masterGain: Tone.Gain | null = null;
let melodySynth: Tone.PolySynth | null = null;
let bassSynth: Tone.Synth | null = null;
let melodyLoop: Tone.Loop | null = null;
let bassLoop: Tone.Loop | null = null;
let melodyIndex = 0;
let bassIndex = 0;
let noteInPattern = 0;
let isPlaying = false;

function createMusicGraph() {
  if (masterGain) return;

  masterGain = new Tone.Gain(0).toDestination();

  const filter = new Tone.Filter(2500, "lowpass").connect(masterGain);

  // Melody — triangle wave for a marimba/xylophone feel
  melodySynth = new Tone.PolySynth({ maxPolyphony: 4 });
  melodySynth.set({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.4 },
  });
  melodySynth.volume.value = -16;
  melodySynth.connect(filter);

  // Bass — soft sine for warmth
  bassSynth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.05, decay: 0.4, sustain: 0.3, release: 0.6 },
  });
  bassSynth.volume.value = -20;
  bassSynth.connect(filter);

  melodyIndex = 0;
  bassIndex = 0;
  noteInPattern = 0;

  // Melody plays individual notes from the pattern, one per 8th note
  melodyLoop = new Tone.Loop((time) => {
    const pattern = MELODY_PATTERNS[melodyIndex % MELODY_PATTERNS.length];
    const note = pattern[noteInPattern % pattern.length];
    melodySynth?.triggerAttackRelease(note, "8n", time, 0.35);
    noteInPattern += 1;
    if (noteInPattern >= pattern.length) {
      noteInPattern = 0;
      melodyIndex += 1;
    }
  }, "8n");

  // Bass plays root on each bar
  bassLoop = new Tone.Loop((time) => {
    const note = BASS_NOTES[bassIndex % BASS_NOTES.length];
    bassSynth?.triggerAttackRelease(note, "2n", time, 0.25);
    bassIndex += 1;
  }, "1m");

  melodyLoop.start(0);
  bassLoop.start(0);
}

function handleVisibilityChange() {
  if (!isPlaying) return;
  if (document.hidden) {
    Tone.Transport.pause();
  } else {
    Tone.Transport.start();
  }
}

export async function startMusic(): Promise<void> {
  if (isPlaying) return;
  const ready = await ensureAudioContext();
  if (!ready) return;

  createMusicGraph();
  if (!masterGain) return;

  masterGain.gain.rampTo(1, 2);
  Tone.Transport.bpm.value = 115;
  Tone.Transport.start();
  isPlaying = true;

  document.addEventListener("visibilitychange", handleVisibilityChange);
}

export function stopMusic(): void {
  if (!isPlaying) return;
  isPlaying = false;

  document.removeEventListener("visibilitychange", handleVisibilityChange);

  if (masterGain) {
    masterGain.gain.rampTo(0, 1.5);
  }

  setTimeout(() => {
    if (!isPlaying) {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }
  }, 2000);
}

export function isMusicPlaying(): boolean {
  return isPlaying;
}
