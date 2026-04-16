import { useCallback, useRef } from 'react';

export default function useSfx() {
  const audioCtxRef = useRef(null);

  const getAudioContext = () => {
    if (typeof window === 'undefined') return null;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
    return audioCtxRef.current;
  };

  const playSubmitYay = useCallback(async () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const now = ctx.currentTime;
    const notes = [
      { freq: 523.25, dur: 0.1 },
      { freq: 659.25, dur: 0.1 },
      { freq: 783.99, dur: 0.14 },
    ];

    notes.forEach((note, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.09;
      const end = start + note.dur;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.16, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(end + 0.01);
    });
  }, []);

  return { playSubmitYay };
}
