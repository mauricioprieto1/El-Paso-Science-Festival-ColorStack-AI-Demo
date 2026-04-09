export default function DrawingCanvas({ canvasRef, hasDrawing }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border-2 border-utep-border bg-white shadow-[0_0_0_1px_rgba(255,102,0,0.1),0_24px_60px_rgba(0,0,0,0.5)] transition-[border-color] hover:border-utep-orange/50 cursor-crosshair">
      <canvas
        ref={canvasRef}
        className="block w-full aspect-square"
        style={{ touchAction: 'none' }}
      />

      {/* Hint overlay — hidden once drawing starts */}
      {!hasDrawing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none animate-[float_3s_ease-in-out_infinite]">
          <span className="text-5xl grayscale-[0.3]">✏️</span>
          <span className="text-sm font-medium text-gray-400 font-[var(--font-body)]">
            Sketch here...
          </span>
        </div>
      )}
    </div>
  );
}
