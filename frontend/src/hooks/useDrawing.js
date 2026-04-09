import { useRef, useEffect, useCallback, useState } from 'react';

const DEFAULT_BRUSH = 8;

export default function useDrawing() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const [brushSize, setBrushSize] = useState(DEFAULT_BRUSH);
  const [hasDrawing, setHasDrawing] = useState(false);

  // Initialize canvas with proper DPR scaling
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const displaySize = parent.clientWidth;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, displaySize, displaySize);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    initCanvas();

    const handleResize = () => {
      initCanvas();
      setHasDrawing(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  // Get position from pointer event, accounting for canvas scaling
  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  // Pointer event handlers — unified for mouse, touch, and stylus
  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    canvas.setPointerCapture(e.pointerId);

    isDrawingRef.current = true;
    setHasDrawing(true);

    const { x, y } = getPos(e);
    lastPosRef.current = { x, y };

    // Pressure: use real value from pen, default 0.5 for mouse/touch
    const pressure = (e.pointerType === 'pen' && e.pressure > 0) ? e.pressure : 0.5;
    const ctx = ctxRef.current;
    const size = brushSize * (0.4 + pressure * 0.8);

    // Draw a dot at the start point
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }, [brushSize, getPos]);

  const handlePointerMove = useCallback((e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();

    const { x, y } = getPos(e);
    const pressure = (e.pointerType === 'pen' && e.pressure > 0) ? e.pressure : 0.5;
    const ctx = ctxRef.current;

    ctx.strokeStyle = '#111111';
    ctx.lineWidth = brushSize * (0.4 + pressure * 0.8);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPosRef.current = { x, y };
  }, [brushSize, getPos]);

  const handlePointerUp = useCallback((e) => {
    e.preventDefault();
    isDrawingRef.current = false;
  }, []);

  // Attach pointer events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prevent context menu on long-press (iPad/tablet)
    const preventContext = (e) => e.preventDefault();

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);
    canvas.addEventListener('contextmenu', preventContext);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
      canvas.removeEventListener('contextmenu', preventContext);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displaySize = canvas.width / dpr;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, displaySize, displaySize);
    setHasDrawing(false);
  }, []);

  // Export canvas as base64 PNG (without the data: prefix)
  const getBase64 = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    return canvas.toDataURL('image/png').split(',')[1];
  }, []);

  return {
    canvasRef,
    brushSize,
    setBrushSize,
    hasDrawing,
    clearCanvas,
    getBase64,
  };
}
