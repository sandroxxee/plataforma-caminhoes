"use client";

import { useEffect, useRef, useState } from "react";
import {
  type CropTarget,
  type EditorTarget,
  type PhotoType,
  type BlurRect,
  type Point,
  OUTPUT_WIDTH,
  OUTPUT_HEIGHT,
  loadImage,
  loadImageFromUrl,
  canvasToFile,
  drawBlurArea,
  roundedRectPath,
  normalizeRect,
  getPointerPosition,
  applyBlurToFile,
} from "@/lib/imageUtils";

const NUDGE_STEP = 20;

const EDITOR_STYLES = `
.editor-backdrop{position:fixed;inset:0;z-index:9999;padding:18px;display:grid;place-items:center;background:rgba(0,0,0,.78);backdrop-filter:blur(10px)}
.editor-panel{width:min(1040px,100%);max-height:96vh;overflow:auto;border-radius:22px;border:1px solid rgba(255,255,255,.16);background:#071014;padding:16px;box-shadow:0 30px 80px rgba(0,0,0,.45)}
.crop-panel{width:min(980px,100%)}
.editor-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:12px}
.editor-head strong{display:block;color:white;font-size:18px;margin-bottom:5px}
.editor-head p{margin:0;color:#cbd5e1;line-height:1.45}
.editor-close,.editor-actions button{min-height:42px;border:1px solid rgba(255,255,255,.14);border-radius:12px;background:rgba(255,255,255,.08);color:white;padding:0 14px;font-weight:900;cursor:pointer}
.crop-canvas{width:100%;height:auto;border-radius:16px;border:1px solid rgba(255,255,255,.18);background:#f3f4f6;touch-action:none;cursor:grab;display:block;user-select:none}
.crop-canvas.dragging{cursor:grabbing}
.blur-canvas{width:100%;height:auto;border-radius:16px;border:1px solid rgba(255,255,255,.14);background:rgba(2,6,23,.78);touch-action:none;cursor:crosshair;display:block;user-select:none}
.zoom-control{display:grid;gap:8px;margin-top:14px;color:#e5e7eb;font-weight:900}
.zoom-control input{width:100%}
.nudge-controls{display:grid;grid-template-columns:repeat(3,44px);grid-template-rows:repeat(3,44px);gap:6px;margin-top:14px;justify-content:center}
.nudge-btn{min-height:44px;width:44px;border:1px solid rgba(255,255,255,.18);border-radius:10px;background:rgba(255,255,255,.1);color:white;font-size:20px;cursor:pointer;display:grid;place-items:center;transition:background .15s}
.nudge-btn:hover{background:rgba(255,255,255,.22)}
.nudge-btn:active{background:rgba(255,255,255,.32)}
.nudge-center{grid-column:2;grid-row:2;font-size:14px}
.nudge-up{grid-column:2;grid-row:1}
.nudge-left{grid-column:1;grid-row:2}
.nudge-right{grid-column:3;grid-row:2}
.nudge-down{grid-column:2;grid-row:3}
.nudge-label{text-align:center;color:#94a3b8;font-size:12px;margin-top:4px}
.editor-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;margin-top:14px}
.editor-actions button:disabled{opacity:.45;cursor:not-allowed}
.apply-blur{background:#22c55e!important;color:#052e16!important;border-color:transparent!important}
@media(max-width:560px){.editor-head{display:grid}.editor-actions button,.editor-close{width:100%}}
`;

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
