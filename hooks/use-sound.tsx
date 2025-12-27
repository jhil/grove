"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Sound effects hook for Plangrove.
 * Uses free sound effects and Web Audio API for playback.
 *
 * Sound effects are generated programmatically using Web Audio API
 * to avoid needing external sound files.
 */

type SoundType = "water" | "success" | "pop" | "click" | "error";

interface UseSoundOptions {
  enabled?: boolean;
  volume?: number;
}

export function useSound(options: UseSoundOptions = {}) {
  const { enabled = true, volume = 0.5 } = options;
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
    };

    // Initialize on user interaction (click/touch)
    document.addEventListener("click", initAudio, { once: true });
    document.addEventListener("touchstart", initAudio, { once: true });

    return () => {
      document.removeEventListener("click", initAudio);
      document.removeEventListener("touchstart", initAudio);
    };
  }, []);

  /**
   * Play a synthesized sound effect.
   */
  const playSound = useCallback(
    (type: SoundType) => {
      if (!enabled) return;

      const ctx = audioContextRef.current;
      if (!ctx) return;

      // Resume audio context if it's suspended
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      switch (type) {
        case "water": {
          // Water droplet sound - descending tone with wobble
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = "sine";
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);

          gain.gain.setValueAtTime(volume * 0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

          osc.start(now);
          osc.stop(now + 0.4);
          break;
        }

        case "success": {
          // Happy ascending notes
          [523, 659, 784].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + i * 0.1);

            gain.gain.setValueAtTime(volume * 0.2, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.2);
          });
          break;
        }

        case "pop": {
          // Soft pop sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = "sine";
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

          gain.gain.setValueAtTime(volume * 0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }

        case "click": {
          // Subtle click
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = "square";
          osc.frequency.setValueAtTime(600, now);

          gain.gain.setValueAtTime(volume * 0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

          osc.start(now);
          osc.stop(now + 0.03);
          break;
        }

        case "error": {
          // Descending error tone
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);

          gain.gain.setValueAtTime(volume * 0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }
      }
    },
    [enabled, volume]
  );

  return { playSound };
}

/**
 * Simple sound context for app-wide sound settings.
 */
interface SoundContextType {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);

  return (
    <SoundContext.Provider value={{ enabled, setEnabled, volume, setVolume }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundSettings() {
  const context = useContext(SoundContext);
  if (!context) {
    // Return defaults if not in provider
    return { enabled: true, setEnabled: () => {}, volume: 0.5, setVolume: () => {} };
  }
  return context;
}
