import { useCallback, useEffect, useRef } from 'react';

export default function useSpeech() {
  const voiceRef = useRef(null);

  // Load voices (they're async on some browsers)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer a friendly English voice
      voiceRef.current =
        voices.find(v => v.lang.startsWith('en') && /samantha|zira|google us/i.test(v.name)) ||
        voices.find(v => v.lang.startsWith('en-US')) ||
        voices.find(v => v.lang.startsWith('en')) ||
        null;
    };

    pickVoice();
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pickVoice);
  }, []);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;
    if (voiceRef.current) utterance.voice = voiceRef.current;

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
}
