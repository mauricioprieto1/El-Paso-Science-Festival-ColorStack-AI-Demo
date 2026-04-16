import { useState, useCallback, useEffect } from 'react';
import useDrawing from '../hooks/useDrawing';
import useApi from '../hooks/useApi';
import useSpeech from '../hooks/useSpeech';
import useSfx from '../hooks/useSfx';
import DrawingCanvas from '../components/DrawingCanvas';
import BrushControls from '../components/BrushControls';
import NameInput from '../components/NameInput';
import ResultCard from '../components/ResultCard';
import UtepCard from '../components/UtepCard';
import Confetti from '../components/Confetti';

const COOLDOWN_SECONDS = 5;

export default function DrawPage() {
  const { canvasRef, brushSize, setBrushSize, hasDrawing, clearCanvas, getBase64 } = useDrawing();
  const { loading, error, setError, submitGuess, saveDrawing } = useApi();
  const { speak, stop } = useSpeech();
  const { playSubmitYay } = useSfx();

  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [confettiFire, setConfettiFire] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleGuess = useCallback(async () => {
    if (!hasDrawing || loading || cooldown > 0) return;
    playSubmitYay();
    stop();
    const imageBase64 = getBase64();
    const data = await submitGuess(imageBase64);

    if (data) {
      setResult(data);
      setConfettiFire((n) => n + 1);
      setCooldown(COOLDOWN_SECONDS);

      if (data.utep?.speech) speak(data.utep.speech);

      saveDrawing({
        name: name.trim() || 'Anonymous Artist',
        image: imageBase64,
        guess: data.guesses?.[0]?.label || 'unknown',
        college: data.utep?.college,
        department: data.utep?.department,
        explanation: data.utep?.explanation,
        fun_fact: data.utep?.fun_fact,
      });
    }
  }, [hasDrawing, loading, cooldown, getBase64, submitGuess, saveDrawing, speak, stop, name, playSubmitYay]);

  const handleClear = useCallback(() => {
    clearCanvas();
    setResult(null);
    setError(null);
    stop();
  }, [clearCanvas, setError, stop]);

  const topGuess = result?.guesses?.[0]?.label;

  return (
    <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-4xl flex flex-col gap-4">
        <div className="text-center">
          <h2 className="font-heading text-4xl md:text-5xl tracking-wider text-white leading-none">
            Can AI read your drawing?
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-stretch">

          {/* Left — Canvas area */}
          <div className="flex flex-col gap-3 md:w-1/2">
            <NameInput name={name} onChange={setName} />
            <DrawingCanvas canvasRef={canvasRef} hasDrawing={hasDrawing} />
            <BrushControls
              brushSize={brushSize}
              onBrushChange={setBrushSize}
              onClear={handleClear}
              onGuess={handleGuess}
              loading={loading}
              cooldown={cooldown}
              hasDrawing={hasDrawing}
            />
          </div>

          {/* Right — Results area */}
          <div className="md:w-1/2 flex flex-col justify-center min-h-0">
            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="w-6 h-6 border-2 border-utep-orange/20 border-t-utep-orange rounded-full animate-spin" />
                <span className="text-xs text-white/30">Analyzing your drawing...</span>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-8">
                <p className="text-red-400/70 text-sm mb-2">{error}</p>
                <button onClick={handleGuess} className="text-xs text-utep-orange/60 hover:text-utep-orange cursor-pointer">
                  Try again
                </button>
              </div>
            )}

            {result && !loading && (
              <div className="flex flex-col gap-5 animate-[slide-up_0.3s_ease-out]">
                {/* Title */}
                <div>
                  <h2 className="font-heading text-3xl tracking-wider text-white leading-none mb-1">
                    {topGuess ? `It's a ${topGuess}!` : 'Nice drawing!'}
                  </h2>
                  <p className="text-xs text-white/30">AI confidence breakdown</p>
                </div>

                <ResultCard guesses={result.guesses} />

                <div className="h-px bg-white/5" />

                <UtepCard utep={result.utep} />
              </div>
            )}

            {!result && !loading && !error && (
              <div className="flex flex-col items-center justify-center gap-2 py-12 opacity-20">
                <span className="text-3xl">🔬</span>
                <span className="text-xs text-white/50 text-center max-w-48">
                  Draw something and hit the button to discover its UTEP connection
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Confetti fire={confettiFire} />
    </main>
  );
}
