export default function DrawingCanvas({ canvasRef, hasDrawing }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white transition-[border-color] hover:border-utep-orange/30 cursor-crosshair shadow-lg shadow-black/20">
      <canvas
        ref={canvasRef}
        className="block w-full aspect-square"
        style={{ touchAction: 'none' }}
      />

      {!hasDrawing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-gray-300 text-sm tracking-wide">Draw something here</span>
        </div>
      )}
    </div>
  );
}
