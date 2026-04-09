import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function Confetti({ fire }) {
  useEffect(() => {
    if (!fire) return;

    // Burst from the center-right area (where results appear)
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.65, y: 0.45 },
      colors: ['#FF6600', '#FFFFFF', '#002147', '#FF8833', '#FFB380'],
      disableForReducedMotion: true,
    });

    // Second smaller burst slightly delayed
    const timer = setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#FF6600', '#FFFFFF', '#002147'],
        disableForReducedMotion: true,
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [fire]);

  return null;
}
