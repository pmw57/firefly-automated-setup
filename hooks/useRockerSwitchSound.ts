import { useCallback } from 'react';
import { ONLINE_BASE_URL } from '../data/constants';

// Define the time segments for the sounds within the audio sprite.
const SOUND_SPRITE = {
  on: { offset: 1.43, duration: 0.1 }, // Starts at 1.43s, ends at 1.53s
  off: { offset: 0.1, duration: 0.1 }, // Starts at 0.1s, ends at 0.2s
};

// Use a singleton pattern for the AudioContext and the loaded AudioBuffer
// to ensure they are created and loaded only once for the entire application.
let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let isLoading = false;

// Preload the audio file
const loadAudio = async () => {
    if (audioBuffer || isLoading || typeof window === 'undefined') {
        return;
    }
    isLoading = true;
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
        }
        
        const isPreview = typeof import.meta.env === 'undefined';
        const baseUrl = !isPreview ? (import.meta.env.BASE_URL || '/') : ONLINE_BASE_URL;
        const soundUrl = `${baseUrl}sounds/rocker-switch.mp3`;
        
        const response = await fetch(soundUrl);
        const arrayBuffer = await response.arrayBuffer();
        if (audioContext) {
          audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        }
    } catch (error) {
        console.error("Failed to load or decode audio file:", error);
        // Reset so it can try again later if needed
        audioBuffer = null;
        audioContext = null;
    } finally {
        isLoading = false;
    }
};

// Eagerly start loading the audio when the module is first imported.
loadAudio();

export const useRockerSwitchSound = () => {
  const playSound = useCallback((type: 'on' | 'off') => {
    if (!audioContext || !audioBuffer) {
      // Audio is not ready or failed to load, fail silently.
      return;
    }

    const sound = SOUND_SPRITE[type];
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    // The sound is now played immediately. The delay is handled by the calling component.
    source.start(undefined, sound.offset, sound.duration);
  }, []);

  return { playSound };
};