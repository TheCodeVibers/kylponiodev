"use client";
import * as Tone from "tone";

// Lazy-init so we don't create AudioContext until user gesture
let synth: Tone.PolySynth | null = null;
let reverb: Tone.Reverb | null = null;
let delay: Tone.PingPongDelay | null = null;
let analyser: Tone.Analyser | null = null;
let loop: Tone.Loop | null = null;
let running = false;

const CHORDS = [
  ["E3", "B3", "E4", "G#4"],
  ["C#3", "G#3", "C#4", "E4"],
  ["A2", "E3", "A3", "C#4"],
  ["B2", "F#3", "B3", "D#4"],
];
let chordIdx = 0;

function ensureInit() {
  if (synth) return;
  reverb = new Tone.Reverb({ decay: 2.8, wet: 0.38 }).toDestination();
  delay = new Tone.PingPongDelay("8n", 0.25).connect(reverb);
  analyser = new Tone.Analyser("waveform", 32);
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.35, sustain: 0.45, release: 2.2 },
    volume: -10,
  });
  synth.connect(delay);
  synth.connect(analyser);
}

export async function startGuitarAudio(): Promise<void> {
  if (running) return;
  ensureInit();
  await Tone.start();
  Tone.getTransport().bpm.value = 72;
  chordIdx = 0;
  loop = new Tone.Loop((time) => {
    const chord = CHORDS[chordIdx % CHORDS.length];
    chord.forEach((note, i) => {
      synth!.triggerAttackRelease(note, "2n", time + i * 0.03);
    });
    chordIdx++;
  }, "1m");
  loop.start(0);
  Tone.getTransport().start();
  running = true;
}

export function stopGuitarAudio(): void {
  if (!running) return;
  loop?.stop();
  loop?.dispose();
  loop = null;
  Tone.getTransport().stop();
  Tone.getTransport().cancel();
  running = false;
}

export function getGuitarAmplitude(): number {
  if (!running || !analyser) return 0;
  const vals = analyser.getValue() as Float32Array;
  let sum = 0;
  for (const v of vals) sum += Math.abs(v);
  return Math.min((sum / vals.length) * 5, 1);
}

export function isGuitarRunning(): boolean {
  return running;
}
