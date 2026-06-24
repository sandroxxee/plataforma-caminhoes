"use client";

import { useEffect, useRef, useState } from "react";
import {
  type CropTarget,
  type Point,
  OUTPUT_WIDTH,
  OUTPUT_HEIGHT,
  loadImage,
  canvasToFile,
  getPointerPosition,
} from "@/lib/imageUtils";
import { EDITOR_STYLES } from "./EditorStyles";

const NUDGE_STEP = 20;

export function CropEditor({
  target,
  onCancel,
  onApply,
}: {
  target: CropTarget;
  onCancel: () => void;
  onApply: (target: CropTarget, file: File) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<Point | null>(null);
  const isDraggingRef = useRef(false);
  const stateRef = useRef({ scale: 1, minScale: 1, offsetX: 0, offsetY: 0 });
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState("Arraste a foto para enquadrar o caminhão dentro da moldura 4:3.");

  function draw() {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const { scale, offsetX, offsetY } = stateRef.current;
    ctx.drawImage(image, offsetX, offsetY, image.width * scale, image.height * scale);
    ctx.strokeStyle = "rgba(37,99,235,.95)";
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, canvas.width - 3, canvas.height - 3);
  }

  function setupCanvas(image: HTMLImageElement) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const visibleWidth = Math.min(920, Math.max(300, window.innerWidth - 40));
    const visibleHeight = Math.round(visibleWidth * 0.75);
    canvas.width = visibleWidth;
    canvas.height = visibleHeight;
    const minScale = Math.min(canvas.width / image.width, canvas.height / image.height);
    stateRef.current = {
      minScale,
      scale: minScale,
      offsetX: (canvas.width - image.width * minScale) / 2,
      offsetY: (canvas.height - image.height * minScale) / 2,
    };
    setZoom(1);
    draw();
  }

  useEffect(() => {
    let mounted = true;
    loadImage(target.file)
      .then((image) => { if (!mounted) return; imageRef.current = image; setupCanvas(image); })
      .catch(() => setStatus("Não consegui carregar essa foto. Tente outra imagem."));
    return () => { mounted = false; };
  }, [target.file]);

  function startDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    dragRef.current = getPointerPosition(e, canvas);
    isDraggingRef.current = true;
    canvas.classList.add("dragging");
  }

  function moveDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const last = dragRef.current;
    if (!canvas || !last) return;
    e.preventDefault();
    const pos = getPointerPosition(e, canvas);
    stateRef.current.offsetX += pos.x - last.x;
    stateRef.current.offsetY += pos.y - last.y;
    dragRef.current = pos;
    draw();
  }

  function endDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try { canvas.releasePointerCapture(e.pointerId); } catch {}
    dragRef.current = null;
    isDraggingRef.current = false;
    canvas.classList.remove("dragging");
  }

  function nudge(dx: number, dy: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scaleRatio = canvas.width / (canvasRef.current?.offsetWidth || canvas.width);
    stateRef.current.offsetX += dx * scaleRatio;
    stateRef.current.offsetY += dy * scaleRatio;
    draw();
  }

  function changeZoom(value: number) {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;
    const cur = stateRef.current;
    const nextScale = cur.minScale * value;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const ix = (cx - cur.offsetX) / cur.scale;
    const iy = (cy - cur.offsetY) / cur.scale;
    stateRef.current = { ...cur, scale: nextScale, offsetX: cx - ix * nextScale, offsetY: cy - iy * nextScale };
    setZoom(value);
    draw();
  }

  async function saveCrop() {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;
    setStatus("Salvando foto em 1200x900, proporção 4:3...");
    const output = document.createElement("canvas");
    output.width = OUTPUT_WIDTH;
    output.height = OUTPUT_HEIGHT;
    const ctx = output.getContext("2d");
    if (!ctx) { setStatus("Não consegui preparar o corte."); return; }
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, output.width, output.height);
    const fx = output.width / canvas.width;
    const fy = output.height / canvas.height;
    const { scale, offsetX, offsetY } = stateRef.current;
    ctx.drawImage(image, offsetX * fx, offsetY * fy, image.width * scale * fx, image.height * scale * fy);
    try {
      const cropped = await canvasToFile(output, target.file.name, "corte-4x3");
      onApply(target, cropped);
    } catch {
      setStatus("Não consegui salvar esse corte. Tente novamente.");
    }
  }

  return (
    <div className="editor-backdrop" role="dialog" aria-modal="true" aria-label="Ajustar foto 4:3">
      <div className="editor-panel crop-panel">
        <div className="editor-head">
          <div>
            <strong>Ajustar foto 4:3 antes de enviar</strong>
            <p>{status}</p>
          </div>
          <button type="button" onClick={onCancel} className="editor-close" aria-label="Cancelar ajuste">Cancelar</button>
        </div>
        <canvas
          ref={canvasRef}
          className="crop-canvas"
          aria-label="Área de enquadramento da foto"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
        <label className="zoom-control">
          Zoom
          <input type="range" min="1" max="2.8" step="0.01" value={zoom} onChange={(e) => changeZoom(Number(e.target.value))} />
        </label>
        <div className="nudge-controls" aria-label="Mover foto com precisão">
          <button type="button" className="nudge-btn nudge-up" onClick={() => nudge(0, -NUDGE_STEP)} aria-label="Mover para cima">↑</button>
          <button type="button" className="nudge-btn nudge-left" onClick={() => nudge(-NUDGE_STEP, 0)} aria-label="Mover para esquerda">←</button>
          <button type="button" className="nudge-btn nudge-center" onClick={() => imageRef.current && setupCanvas(imageRef.current)} aria-label="Centralizar">⊙</button>
          <button type="button" className="nudge-btn nudge-right" onClick={() => nudge(NUDGE_STEP, 0)} aria-label="Mover para direita">→</button>
          <button type="button" className="nudge-btn nudge-down" onClick={() => nudge(0, NUDGE_STEP)} aria-label="Mover para baixo">↓</button>
        </div>
        <p className="nudge-label">Use as setas para ajuste fino · ⊙ centraliza</p>
        <div className="editor-actions">
          <button type="button" onClick={saveCrop} className="apply-blur">Salvar corte</button>
        </div>
      </div>
      <style>{EDITOR_STYLES}</style>
    </div>
  );
}
