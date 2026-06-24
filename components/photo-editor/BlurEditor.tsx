"use client";

import { useEffect, useRef, useState } from "react";
import {
  type EditorTarget,
  type PhotoType,
  type BlurRect,
  type Point,
  loadImageFromUrl,
  applyBlurToFile,
  drawBlurArea,
  roundedRectPath,
  normalizeRect,
  getPointerPosition,
} from "@/lib/imageUtils";
import { EDITOR_STYLES } from "./EditorStyles";

export function BlurEditor({
  target,
  onCancel,
  onApply,
}: {
  target: EditorTarget;
  onCancel: () => void;
  onApply: (type: PhotoType, index: number, file: File) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const displayRef = useRef({ scale: 1 });
  const dragStartRef = useRef<Point | null>(null);
  const dragEndRef = useRef<Point | null>(null);
  const [rects, setRects] = useState<BlurRect[]>([]);
  const rectsRef = useRef<BlurRect[]>([]);
  const [status, setStatus] = useState("Modo manual: arraste uma caixa em cima da placa, adesivo, telefone ou contato.");

  function drawCanvas(currentRects: BlurRect[], tempRect?: BlurRect) {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scale = Math.min(Math.min(980, window.innerWidth - 36) / image.width, 650 / image.height, 1);
    const dw = Math.max(1, Math.round(image.width * scale));
    const dh = Math.max(1, Math.round(image.height * scale));
    canvas.width = dw;
    canvas.height = dh;
    displayRef.current = { scale };
    ctx.clearRect(0, 0, dw, dh);
    ctx.drawImage(image, 0, 0, dw, dh);
    const allRects = tempRect ? [...currentRects, tempRect] : currentRects;
    allRects.forEach((rect) => {
      ctx.save();
      roundedRectPath(ctx, rect.x, rect.y, rect.w, rect.h, Math.max(8, Math.round(Math.min(rect.w, rect.h) * 0.16)));
      ctx.fillStyle = "rgba(255,255,255,.18)";
      ctx.strokeStyle = "rgba(255,255,255,.95)";
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 6]);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  useEffect(() => {
    let mounted = true;
    loadImageFromUrl(target.item.url).then((image) => {
      if (!mounted) return;
      imageRef.current = image;
      rectsRef.current = [];
      setRects([]);
      drawCanvas([]);
    });
    return () => { mounted = false; };
  }, [target.item.url]);

  function startDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    const pos = getPointerPosition(e, canvas);
    dragStartRef.current = pos;
    dragEndRef.current = pos;
    setStatus("Segure e arraste até cobrir toda a placa/contato.");
    drawCanvas(rectsRef.current, normalizeRect(pos, pos));
  }

  function moveDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const start = dragStartRef.current;
    if (!canvas || !start) return;
    e.preventDefault();
    const pos = getPointerPosition(e, canvas);
    dragEndRef.current = pos;
    drawCanvas(rectsRef.current, normalizeRect(start, pos));
  }

  function endDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const start = dragStartRef.current;
    const end = dragEndRef.current;
    if (!canvas || !start || !end) return;
    e.preventDefault();
    try { canvas.releasePointerCapture(e.pointerId); } catch {}
    const rect = normalizeRect(start, end);
    dragStartRef.current = null;
    dragEndRef.current = null;
    if (rect.w > 8 && rect.h > 8) {
      const next = [...rectsRef.current, rect];
      rectsRef.current = next;
      setRects(next);
      setStatus("Área marcada. Pode marcar outra ou clicar em aplicar desfoque.");
      drawCanvas(next);
    } else {
      setStatus("Arraste uma caixa maior em cima da placa ou contato.");
      drawCanvas(rectsRef.current);
    }
  }

  async function apply() {
    if (rectsRef.current.length === 0) { setStatus("Selecione pelo menos uma área para borrar."); return; }
    const scale = displayRef.current.scale || 1;
    const fullRects = rectsRef.current.map((r) => ({ x: r.x / scale, y: r.y / scale, w: r.w / scale, h: r.h / scale }));
    setStatus("Aplicando desfoque fino...");
    try {
      const blurred = await applyBlurToFile(target.item.file, fullRects);
      onApply(target.type, target.index, blurred);
    } catch (err) {
      console.error(err);
      setStatus("Não consegui aplicar o desfoque. Tente selecionar uma área menor.");
    }
  }

  function undoLast() {
    const next = rectsRef.current.slice(0, -1);
    rectsRef.current = next;
    setRects(next);
    drawCanvas(next);
  }

  function clearRects() {
    rectsRef.current = [];
    setRects([]);
    drawCanvas([]);
  }

  return (
    <div className="editor-backdrop" role="dialog" aria-modal="true" aria-label="Borrar placa ou contato">
      <div className="editor-panel">
        <div className="editor-head">
          <div><strong>Borrar placa/contato</strong><p>{status}</p></div>
          <button type="button" onClick={onCancel} className="editor-close" aria-label="Fechar editor de desfoque">Fechar</button>
        </div>
        <canvas
          ref={canvasRef}
          className="blur-canvas"
          aria-label="Área de seleção para desfoque"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
        <div className="editor-actions">
          <button type="button" onClick={undoLast} disabled={rects.length === 0}>Desfazer última área</button>
          <button type="button" onClick={clearRects} disabled={rects.length === 0}>Limpar marcações</button>
          <button type="button" onClick={apply} className="apply-blur">Aplicar desfoque</button>
        </div>
      </div>
      <style>{EDITOR_STYLES}</style>
    </div>
  );
}
