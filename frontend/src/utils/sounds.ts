// Sound effects using Tone.js CDN global

let audioContextStarted = false;
let audioContextPromise: Promise<boolean> | null = null;

export function ensureAudioContext(): Promise<boolean> {
  if (audioContextStarted) return Promise.resolve(true);
  if (audioContextPromise) return audioContextPromise;
  audioContextPromise = Tone.start()
    .then(() => {
      audioContextStarted = true;
      return true;
    })
    .catch(() => {
      audioContextPromise = null;
      return false;
    });
  return audioContextPromise;
}

// Initialize audio context on the first user interaction anywhere on the page
function initOnFirstInteraction() {
  const handler = () => {
    ensureAudioContext();
    document.removeEventListener("pointerdown", handler);
    document.removeEventListener("keydown", handler);
  };
  document.addEventListener("pointerdown", handler, { once: true });
  document.addEventListener("keydown", handler, { once: true });
}
initOnFirstInteraction();

function isReady(): boolean {
  return audioContextStarted;
}

// Lazy synth factories
let sineSynth: Tone.Synth | null = null;
let triangleSynth: Tone.Synth | null = null;
let squareSynth: Tone.Synth | null = null;
let fmSynth: Tone.FMSynth | null = null;
let polySynth: Tone.PolySynth | null = null;

function getSineSynth(): Tone.Synth {
  if (!sineSynth) {
    sineSynth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination();
    sineSynth.volume.value = -12;
  }
  return sineSynth;
}

function getTriangleSynth(): Tone.Synth {
  if (!triangleSynth) {
    triangleSynth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 },
    }).toDestination();
    triangleSynth.volume.value = -10;
  }
  return triangleSynth;
}

function getSquareSynth(): Tone.Synth {
  if (!squareSynth) {
    squareSynth = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.1 },
    }).toDestination();
    squareSynth.volume.value = -20;
  }
  return squareSynth;
}

function getFMSynth(): Tone.FMSynth {
  if (!fmSynth) {
    fmSynth = new Tone.FMSynth({
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.5 },
    }).toDestination();
    fmSynth.volume.value = -10;
  }
  return fmSynth;
}

function getPolySynth(): Tone.PolySynth {
  if (!polySynth) {
    polySynth = new Tone.PolySynth().toDestination();
    polySynth.volume.value = -8;
  }
  return polySynth;
}

// Tile select — soft click
export function playTileSelect(): void {
  if (!isReady()) return;
  getSineSynth().triggerAttackRelease("C6", "32n");
}

// Tile swap — quick whoosh
export function playTileSwap(): void {
  if (!isReady()) return;
  const synth = getSineSynth();
  const now = Tone.now();
  synth.triggerAttackRelease("E5", "64n", now);
  synth.triggerAttackRelease("G5", "64n", now + 0.05);
}

// Tile locks into correct position — crisp snap (short noise burst + high ping)
let noiseSynth: Tone.NoiseSynth | null = null;
function getNoiseSynth(): Tone.NoiseSynth {
  if (!noiseSynth) {
    noiseSynth = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.01 },
    }).toDestination();
    noiseSynth.volume.value = -18;
  }
  return noiseSynth;
}

export function playTileLock(): void {
  if (!isReady()) return;
  const now = Tone.now();
  getNoiseSynth().triggerAttackRelease("32n", now);
  getTriangleSynth().triggerAttackRelease("G5", "64n", now + 0.02);
}

// Puzzle complete — celebratory ascending chord
export function playPuzzleComplete(): void {
  if (!isReady()) return;
  const synth = getPolySynth();
  const now = Tone.now();
  synth.triggerAttackRelease("C4", "8n", now);
  synth.triggerAttackRelease("E4", "8n", now + 0.15);
  synth.triggerAttackRelease("G4", "8n", now + 0.3);
  synth.triggerAttackRelease("C5", "8n", now + 0.45);
  synth.triggerAttackRelease(["C5", "E5", "G5"], "4n", now + 0.6);
}

// Hint used — magical shimmer
export function playHintUsed(): void {
  if (!isReady()) return;
  getFMSynth().triggerAttackRelease("A5", "8n");
}

// Locked tile tapped — dull thud
export function playLockedTap(): void {
  if (!isReady()) return;
  getSquareSynth().triggerAttackRelease("D3", "32n");
}

// Undo swap
export function playUndo(): void {
  if (!isReady()) return;
  getSineSynth().triggerAttackRelease("A4", "32n");
}

// Navigation forward
export function playNavigate(): void {
  if (!isReady()) return;
  getSineSynth().triggerAttackRelease("D6", "32n");
}

// Back navigation (lower pitch)
export function playBack(): void {
  if (!isReady()) return;
  getSineSynth().triggerAttackRelease("G4", "32n");
}

// Generic button tap
export function playTap(): void {
  if (!isReady()) return;
  getSineSynth().triggerAttackRelease("F5", "64n");
}

// Toggle switch
export function playToggle(): void {
  if (!isReady()) return;
  getSineSynth().triggerAttackRelease("A5", "64n");
}

// Modal/dialog open
export function playModalOpen(): void {
  if (!isReady()) return;
  const now = Tone.now();
  getTriangleSynth().triggerAttackRelease("E4", "32n", now);
  getSineSynth().triggerAttackRelease("B5", "32n", now + 0.05);
}
