import { useState, useCallback, useEffect } from 'react';
import useDrawing from '../hooks/useDrawing';
import useApi from '../hooks/useApi';
import useSpeech from '../hooks/useSpeech';
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

  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [confettiFire, setConfettiFire] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleGuess = useCallback(async () => {
    if (!hasDrawing || loading || cooldown > 0) return;

    stop(); // Cancel any in-flight speech
    const imageBase64 = getBase64();
    const data = await submitGuess(imageBase64);

    if (data) {
      setResult(data);
      setConfettiFire((n) => n + 1);
      setCooldown(COOLDOWN_SECONDS);

      // Speak the result
      if (data.utep?.speech) {
        speak(data.utep.speech);
      }

      // Save in background (fire-and-forget)
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
  }, [hasDrawing, loading, cooldown, getBase64, submitGuess, saveDrawing, speak, stop, name]);

  const handleClear = useCallback(() => {
    clearCanvas();
    setResult(null);
    setError(null);
    stop();
  }, [clearCanvas, setError, stop]);

  const topGuess = result?.guesses?.[0]?.label;

  return (
    <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-8 md:px-9">
      {/* Prompt area */}
      <div className="text-center mb-8">
        <div className="text-[11px] font-bold tracking-[4px] uppercase text-utep-orange mb-2">
          ✦ Interactive AI Demo ✦
        </div>
        <h1 className="font-heading text-[clamp(36px,5vw,58px)] tracking-wider leading-none bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent mb-2">
          {topGuess ? `It's a ${topGuess}!` : 'Draw Something!'}
        </h1>
        <p className="text-sm text-utep-text-dim">
          {result
            ? "Here's how this connects to UTEP research and academics"
            : 'Use your finger, mouse, or drawing tablet to sketch — the AI will guess what it is and connect it to UTEP research'}
        </p>
      </div>

      {/* Main layout: canvas left, results right */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-7">
        {/* Left: Canvas panel */}
        <div className="flex flex-col gap-4">
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

        {/* Right: Results panel */}
        <div className="flex flex-col gap-4">
          {/* Loading state */}
          {loading && (
            <div className="bg-utep-card border border-utep-border rounded-2xl p-5 backdrop-blur-lg flex flex-col items-center justify-center min-h-[200px] gap-3">
              <div className="w-8 h-8 border-3 border-utep-orange/20 border-t-utep-orange rounded-full animate-spin" />
              <span className="text-sm text-utep-text-dim">The AI is thinking...</span>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="bg-utep-card border border-red-500/30 rounded-2xl p-5 backdrop-blur-lg text-center">
              <p className="text-red-400 text-sm mb-2">😕 {error}</p>
              <button
                onClick={handleGuess}
                className="text-xs text-utep-orange hover:underline cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <>
              <ResultCard guesses={result.guesses} />
              <UtepCard utep={result.utep} />
            </>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <>
              <div className="bg-utep-card border border-utep-border rounded-2xl p-5 backdrop-blur-lg">
                <div className="text-[10px] font-bold tracking-[3px] uppercase text-utep-orange mb-4">
                  🤖 AI Top Guesses
                </div>
                <p className="text-center text-sm text-utep-text-dim italic py-5">
                  Your prediction will appear here after you draw something.
                </p>
              </div>
              <div className="bg-utep-card border border-utep-border rounded-2xl p-5 backdrop-blur-lg flex-1">
                <div className="text-[10px] font-bold tracking-[3px] uppercase text-utep-orange mb-4">
                  🏫 UTEP Connection
                </div>
                <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 opacity-40">
                  <span className="text-4xl animate-[float_4s_ease-in-out_infinite]">🔬</span>
                  <span className="text-sm text-utep-text-dim text-center max-w-[200px]">
                    Hit "What Did I Draw?" to discover your UTEP connection
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 mt-8 text-[11px] text-utep-text-dim tracking-wide border-t border-utep-orange/8">
        Powered by <span className="text-utep-orange">Claude AI</span> · Made with ♥ for <span className="text-utep-orange">UTEP</span> &amp; El Paso
      </footer>

      <Confetti fire={confettiFire} />
    </main>
  );
}
