// Minimal type declarations for Tone.js CDN global

declare namespace Tone {
  function start(): Promise<void>;
  function now(): number;

  type Time = number | string;
  type Frequency = number | string;

  interface SynthOptions {
    oscillator?: { type: OscillatorType };
    envelope?: {
      attack?: number;
      decay?: number;
      sustain?: number;
      release?: number;
    };
    volume?: number;
  }

  class Synth {
    constructor(options?: SynthOptions);
    toDestination(): this;
    connect(target: Gain | Filter): this;
    triggerAttackRelease(
      note: Frequency,
      duration: Time,
      time?: Time,
      velocity?: number,
    ): this;
    dispose(): void;
    volume: { value: number };
  }

  class PolySynth {
    constructor(options?: { maxPolyphony?: number });
    toDestination(): this;
    connect(target: Gain | Filter): this;
    set(options: SynthOptions): void;
    triggerAttackRelease(
      notes: Frequency | Frequency[],
      duration: Time,
      time?: Time,
      velocity?: number,
    ): this;
    dispose(): void;
    volume: { value: number };
  }

  class FMSynth extends Synth {
    constructor(options?: SynthOptions);
  }

  interface GainOptions {
    gain?: number;
  }

  class Gain {
    constructor(options?: GainOptions | number);
    toDestination(): this;
    connect(target: Gain | Filter): this;
    gain: { value: number; rampTo(value: number, time: Time): void };
    dispose(): void;
  }

  interface FilterOptions {
    frequency?: number;
    type?: BiquadFilterType;
    Q?: number;
  }

  class Filter {
    constructor(options?: FilterOptions);
    constructor(frequency?: number, type?: BiquadFilterType);
    toDestination(): this;
    connect(target: Gain | Filter): this;
    dispose(): void;
  }

  interface LoopOptions {
    interval?: Time;
  }

  class Loop {
    constructor(callback: (time: number) => void, interval?: Time);
    start(time?: Time): this;
    stop(time?: Time): this;
    dispose(): void;
    interval: Time;
  }

  const Transport: {
    start(time?: Time): void;
    stop(time?: Time): void;
    pause(time?: Time): void;
    cancel(time?: Time): void;
    state: "started" | "stopped" | "paused";
    bpm: { value: number };
  };

  class AMSynth extends Synth {
    constructor(options?: SynthOptions);
  }

  interface NoiseSynthOptions {
    noise?: { type: "white" | "brown" | "pink" };
    envelope?: {
      attack?: number;
      decay?: number;
      sustain?: number;
      release?: number;
    };
  }

  class NoiseSynth {
    constructor(options?: NoiseSynthOptions);
    toDestination(): this;
    connect(target: Gain | Filter): this;
    triggerAttackRelease(duration: Time, time?: Time): this;
    dispose(): void;
    volume: { value: number };
  }
}
