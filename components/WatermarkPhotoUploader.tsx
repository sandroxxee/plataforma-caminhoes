"use client";

import { useEffect, useRef, useState } from "react";

const WATERMARK_TEXT = "www.caminhoesavenda.com";
const OUTPUT_WIDTH = 1200;
const OUTPUT_HEIGHT = 900;
const JPEG_QUALITY = 0.9;

type PreviewItem = { file: File; name: string; url: string };
type BlurRect = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };
type PhotoType = "principal" | "extra";
type EditorTarget = { type: PhotoType; index: number; item: PreviewItem };
type CropTarget = { type: PhotoType; index: number; file: File };
type AiAnalysis = {
  nota?: number;
  resumo?: string;
  problemas?: string[];
  recomendacoes?: string[];
  melhorUso?: string;
  corteSugerido?: { x?: number; y?: number; w?: number; h?: number; explicacao?: string };
  areasSensiveis?: Array<{ tipo?: string; descricao?: string }>;
};

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível carregar a imagem."));
    };
    image.src = url;
  });
}

function loadImageFromUrl(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível carregar a prévia."));
    image.src = url;
  });
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });
}

function canvasToFile(canvas: HTMLCanvasElement, originalName: string, suffix = "editada") {
  return new Promise<File>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Não foi possível preparar a imagem."));
        return;
      }
      const cleanName = originalName
        .replace(/\.[a-z0-9]+$/i, "")
        .replace(/-(marca-dagua|borrado|corte-4x3|editada)$/i, "");
      resolve(new File([blob], `${cleanName}-${suffix}.jpg`, { type: "image/jpeg" }));
    }, "image/jpeg", JPEG_QUALITY);
  });
}

function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const shortSide = Math.min(width, height);
  const fontSize = Math.max(34, Math.round(shortSide * 0.045));
  const x = width / 2;
  const y = height / 2;

  ctx.save();
  ctx.font = `850 ${fontSize}px Arial, Helvetica, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.globalAlpha = 0.34;
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.shadowColor = "rgba(0,0,0,.75)";
  ctx.shadowBlur = fontSize * 0.2;
  ctx.shadowOffsetX = Math.max(1, fontSize * 0.03);
  ctx.shadowOffsetY = Math.max(2, fontSize * 0.07);
  ctx.fillText(WATERMARK_TEXT, x, y + Math.max(1, fontSize * 0.04));

  ctx.globalAlpha = 0.52;
  ctx.shadowColor = "rgba(255,255,255,.35)";
  ctx.shadowBlur = fontSize * 0.08;
  ctx.shadowOffsetX = -Math.max(1, fontSize * 0.025);
  ctx.shadowOffsetY = -Math.max(1, fontSize * 0.025);
  ctx.strokeStyle = "rgba(255,255,255,.9)";
  ctx.lineWidth = Math.max(1.4, fontSize * 0.04);
  ctx.strokeText(WATERMARK_TEXT, x, y);

  ctx.globalAlpha = 0.68;
  ctx.shadowColor = "rgba(0,0,0,.72)";
  ctx.shadowBlur = fontSize * 0.1;
  ctx.shadowOffsetX = Math.max(1, fontSize * 0.02);
  ctx.shadowOffsetY = Math.max(1, fontSize * 0.035);
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fillText(WATERMARK_TEXT, x, y);
  ctx.restore();
}

async function addWatermark(file: File) {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Navegador não conseguiu preparar a imagem.");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  drawWatermark(ctx, canvas.width, canvas.height);
  return canvasToFile(canvas, file.name, "marca-dagua");
}

function setInputFiles(input: HTMLInputElement | null, files: File[]) {
  if (!input) return;
  const transfer = new DataTransfer();
  files.forEach((file) => transfer.items.add(file));
  input.files = transfer.files;
}

function revokePreviews(items: PreviewItem[]) {
  items.forEach((item) => URL.revokeObjectURL(item.url));
}

function makePreviews(files: File[]) {
  return files.map((file) => ({ file, name: file.name, url: URL.createObjectURL(file) }));
}

function getPointerPosition(event: React.PointerEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: Math.max(0, Math.min(canvas.width, (event.clientX - rect.left) * scaleX)),
    y: Math.max(0, Math.min(canvas.height, (event.clientY - rect.top) * scaleY)),
  };
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function normalizeRect(start: Point, end: Point): BlurRect {
  return { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), w: Math.abs(end.x - start.x), h: Math.abs(end.y - start.y) };
}

function drawBlurArea(ctx: CanvasRenderingContext2D, source: HTMLCanvasElement, rect: BlurRect) {
  const x = Math.max(0, Math.min(source.width, rect.x));
  const y = Math.max(0, Math.min(source.height, rect.y));
  const w = Math.max(1, Math.min(source.width - x, rect.w));
  const h = Math.max(1, Math.min(source.height - y, rect.h));
  const blur = Math.max(28, Math.round(Math.min(source.width, source.height) * 0.052));
  const radius = Math.max(10, Math.round(Math.min(w, h) * 0.18));
  const expand = blur * 2;
  const sx = Math.max(0, x - expand);
  const sy = Math.max(0, y - expand);
  const sw = Math.min(source.width - sx, w + expand * 2);
  const sh = Math.min(source.height - sy, h + expand * 2);

  ctx.save();
  roundedRectPath(ctx, x, y, w, h, radius);
  ctx.clip();
  ctx.filter = `blur(${blur}px)`;
  ctx.drawImage(source, sx, sy, sw, sh, sx, sy, sw, sh);
  ctx.filter = `blur(${Math.round(blur * 0.38)}px)`;
  ctx.globalAlpha = 0.82;
  ctx.drawImage(source, sx, sy, sw, sh, sx, sy, sw, sh);
  ctx.filter = "none";
  ctx.globalAlpha = 1;
  ctx.restore();
}

async function applyBlurToFile(file: File, rects: BlurRect[]) {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Navegador não conseguiu borrar a imagem.");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const source = document.createElement("canvas");
  source.width = canvas.width;
  source.height = canvas.height;
  const sourceCtx = source.getContext("2d");
  if (!sourceCtx) throw new Error("Navegador não conseguiu preparar o desfoque.");
  sourceCtx.drawImage(canvas, 0, 0);
  rects.forEach((rect) => drawBlurArea(ctx, source, rect));
  return canvasToFile(canvas, file.name, "borrado");
}

function CropEditor({ target, onCancel, onApply }: { target: CropTarget; onCancel: () => void; onApply: (target: CropTarget, file: File) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<Point | null>(null);
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
    const w = image.width * scale;
    const h = image.height * scale;
    ctx.drawImage(image, offsetX, offsetY, w, h);
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
    const scale = minScale;
    stateRef.current = {
      minScale,
      scale,
      offsetX: (canvas.width - image.width * scale) / 2,
      offsetY: (canvas.height - image.height * scale) / 2,
    };
    setZoom(1);
    draw();
  }

  useEffect(() => {
    let mounted = true;
    loadImage(target.file)
      .then((image) => {
        if (!mounted) return;
        imageRef.current = image;
        setupCanvas(image);
      })
      .catch(() => setStatus("Não consegui carregar essa foto. Tente outra imagem."));
    return () => {
      mounted = false;
    };
  }, [target.file]);

  function startDrag(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    dragRef.current = getPointerPosition(event, canvas);
  }

  function moveDrag(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const last = dragRef.current;
    if (!canvas || !last) return;
    event.preventDefault();
    const pos = getPointerPosition(event, canvas);
    stateRef.current.offsetX += pos.x - last.x;
    stateRef.current.offsetY += pos.y - last.y;
    dragRef.current = pos;
    draw();
  }

  function endDrag(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch {}
    dragRef.current = null;
  }

  function changeZoom(value: number) {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;
    const current = stateRef.current;
    const oldScale = current.scale;
    const nextScale = current.minScale * value;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const imagePointX = (centerX - current.offsetX) / oldScale;
    const imagePointY = (centerY - current.offsetY) / oldScale;
    stateRef.current = {
      ...current,
      scale: nextScale,
      offsetX: centerX - imagePointX * nextScale,
      offsetY: centerY - imagePointY * nextScale,
    };
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
    if (!ctx) {
      setStatus("Não consegui preparar o corte.");
      return;
    }
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, output.width, output.height);
    const factorX = output.width / canvas.width;
    const factorY = output.height / canvas.height;
    const { scale, offsetX, offsetY } = stateRef.current;
    ctx.drawImage(image, offsetX * factorX, offsetY * factorY, image.width * scale * factorX, image.height * scale * factorY);
    try {
      const cropped = await canvasToFile(output, target.file.name, "corte-4x3");
      onApply(target, cropped);
    } catch {
      setStatus("Não consegui salvar esse corte. Tente novamente.");
    }
  }

  return (
    <div className="editor-backdrop" role="dialog" aria-modal="true">
      <div className="editor-panel crop-panel">
        <div className="editor-head">
          <div>
            <strong>Ajustar foto 4:3 antes de enviar</strong>
            <p>{status}</p>
          </div>
          <button type="button" onClick={onCancel} className="editor-close">Cancelar</button>
        </div>
        <canvas
          ref={canvasRef}
          className="crop-canvas"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
        <label className="zoom-control">
          Zoom
          <input type="range" min="1" max="2.8" step="0.01" value={zoom} onChange={(event) => changeZoom(Number(event.target.value))} />
        </label>
        <div className="editor-actions">
          <button type="button" onClick={() => imageRef.current && setupCanvas(imageRef.current)}>Centralizar novamente</button>
          <button type="button" onClick={saveCrop} className="apply-blur">Salvar corte</button>
        </div>
      </div>
      <style jsx>{`.editor-backdrop{position:fixed;inset:0;z-index:9999;padding:18px;display:grid;place-items:center;background:rgba(0,0,0,.78);backdrop-filter:blur(10px)}.editor-panel{width:min(980px,100%);max-height:96vh;overflow:auto;border-radius:22px;border:1px solid rgba(255,255,255,.16);background:#071014;padding:16px;box-shadow:0 30px 80px rgba(0,0,0,.45)}.editor-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:12px}.editor-head strong{display:block;color:white;font-size:18px;margin-bottom:5px}.editor-head p{margin:0;color:#cbd5e1;line-height:1.45}.editor-close,.editor-actions button{min-height:42px;border:1px solid rgba(255,255,255,.14);border-radius:12px;background:rgba(255,255,255,.08);color:white;padding:0 14px;font-weight:900;cursor:pointer}.crop-canvas{width:100%;height:auto;border-radius:16px;border:1px solid rgba(255,255,255,.18);background:#f3f4f6;touch-action:none;cursor:grab;display:block;user-select:none}.zoom-control{display:grid;gap:8px;margin-top:14px;color:#e5e7eb;font-weight:900}.zoom-control input{width:100%}.editor-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;margin-top:14px}.apply-blur{background:#22c55e!important;color:#052e16!important;border-color:transparent!important}@media(max-width:560px){.editor-head{display:grid}.editor-actions button,.editor-close{width:100%}}`}</style>
    </div>
  );
}

function BlurEditor({ target, onCancel, onApply }: { target: EditorTarget; onCancel: () => void; onApply: (type: PhotoType, index: number, file: File) => void }) {
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
    const drawWidth = Math.max(1, Math.round(image.width * scale));
    const drawHeight = Math.max(1, Math.round(image.height * scale));
    canvas.width = drawWidth;
    canvas.height = drawHeight;
    displayRef.current = { scale };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, drawWidth, drawHeight);
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
    return () => {
      mounted = false;
    };
  }, [target.item.url]);

  function startDrag(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    const pos = getPointerPosition(event, canvas);
    dragStartRef.current = pos;
    dragEndRef.current = pos;
    setStatus("Segure e arraste até cobrir toda a placa/contato. Solte para marcar a área.");
    drawCanvas(rectsRef.current, normalizeRect(pos, pos));
  }

  function moveDrag(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const start = dragStartRef.current;
    if (!canvas || !start) return;
    event.preventDefault();
    const pos = getPointerPosition(event, canvas);
    dragEndRef.current = pos;
    drawCanvas(rectsRef.current, normalizeRect(start, pos));
  }

  function endDrag(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const start = dragStartRef.current;
    const end = dragEndRef.current;
    if (!canvas || !start || !end) return;
    event.preventDefault();
    try { canvas.releasePointerCapture(event.pointerId); } catch {}
    const rect = normalizeRect(start, end);
    dragStartRef.current = null;
    dragEndRef.current = null;
    if (rect.w > 8 && rect.h > 8) {
      const nextRects = [...rectsRef.current, rect];
      rectsRef.current = nextRects;
      setRects(nextRects);
      setStatus("Área marcada. Pode marcar outra ou clicar em aplicar desfoque.");
      drawCanvas(nextRects);
    } else {
      setStatus("Arraste uma caixa maior em cima da placa ou contato.");
      drawCanvas(rectsRef.current);
    }
  }

  async function apply() {
    if (rectsRef.current.length === 0) {
      setStatus("Selecione pelo menos uma área para borrar antes de aplicar.");
      return;
    }
    const scale = displayRef.current.scale || 1;
    const fullRects = rectsRef.current.map((rect) => ({ x: rect.x / scale, y: rect.y / scale, w: rect.w / scale, h: rect.h / scale }));
    setStatus("Aplicando desfoque fino...");
    try {
      const blurredFile = await applyBlurToFile(target.item.file, fullRects);
      onApply(target.type, target.index, blurredFile);
    } catch (error) {
      console.error(error);
      setStatus("Não consegui aplicar o desfoque. Tente selecionar uma área menor.");
    }
  }

  function undoLast() {
    const nextRects = rectsRef.current.slice(0, -1);
    rectsRef.current = nextRects;
    setRects(nextRects);
    drawCanvas(nextRects);
  }

  function clearRects() {
    rectsRef.current = [];
    setRects([]);
    drawCanvas([]);
  }

  return (
    <div className="editor-backdrop" role="dialog" aria-modal="true">
      <div className="editor-panel">
        <div className="editor-head">
          <div><strong>Borrar placa/contato</strong><p>{status}</p></div>
          <button type="button" onClick={onCancel} className="editor-close">Fechar</button>
        </div>
        <canvas ref={canvasRef} className="blur-canvas" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} />
        <div className="editor-actions">
          <button type="button" onClick={undoLast} disabled={rects.length === 0}>Desfazer última área</button>
          <button type="button" onClick={clearRects} disabled={rects.length === 0}>Limpar marcações</button>
          <button type="button" onClick={apply} className="apply-blur">Aplicar desfoque</button>
        </div>
      </div>
      <style jsx>{`.editor-backdrop{position:fixed;inset:0;z-index:9999;padding:18px;display:grid;place-items:center;background:rgba(0,0,0,.78);backdrop-filter:blur(10px)}.editor-panel{width:min(1040px,100%);max-height:96vh;overflow:auto;border-radius:22px;border:1px solid rgba(255,255,255,.16);background:#071014;padding:16px;box-shadow:0 30px 80px rgba(0,0,0,.45)}.editor-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:12px}.editor-head strong{display:block;color:white;font-size:18px;margin-bottom:5px}.editor-head p{margin:0;color:#cbd5e1;line-height:1.45}.editor-close,.editor-actions button{min-height:42px;border:1px solid rgba(255,255,255,.14);border-radius:12px;background:rgba(255,255,255,.08);color:white;padding:0 14px;font-weight:900;cursor:pointer}.blur-canvas{width:100%;height:auto;border-radius:16px;border:1px solid rgba(255,255,255,.14);background:rgba(2,6,23,.78);touch-action:none;cursor:crosshair;display:block;user-select:none}.editor-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;margin-top:14px}.editor-actions button:disabled{opacity:.45;cursor:not-allowed}.apply-blur{background:#22c55e!important;color:#052e16!important;border-color:transparent!important}`}</style>
    </div>
  );
}

export function WatermarkPhotoUploader() {
  const principalRef = useRef<HTMLInputElement>(null);
  const extrasRef = useRef<HTMLInputElement>(null);
  const [principalPreview, setPrincipalPreview] = useState<PreviewItem[]>([]);
  const [extrasPreview, setExtrasPreview] = useState<PreviewItem[]>([]);
  const [editorTarget, setEditorTarget] = useState<EditorTarget | null>(null);
  const [cropTarget, setCropTarget] = useState<CropTarget | null>(null);
  const [status, setStatus] = useState("");
  const [processando, setProcessando] = useState(false);
  const [analisandoKey, setAnalisandoKey] = useState("");
  const [analises, setAnalises] = useState<Record<string, AiAnalysis>>({});

  function previewKey(type: PhotoType, index: number) {
    return `${type}-${index}`;
  }

  function updateInputs(principalItems: PreviewItem[], extraItems: PreviewItem[]) {
    setInputFiles(principalRef.current, principalItems.map((item) => item.file));
    setInputFiles(extrasRef.current, extraItems.map((item) => item.file));
  }

  function replacePhoto(type: PhotoType, index: number, file: File, statusMessage: string) {
    const nextItem = makePreviews([file])[0];
    if (type === "principal") {
      setPrincipalPreview((old) => {
        const next = [...old];
        if (next[index]) URL.revokeObjectURL(next[index].url);
        next[index] = nextItem;
        updateInputs(next, extrasPreview);
        return next;
      });
    } else {
      setExtrasPreview((old) => {
        const next = [...old];
        if (next[index]) URL.revokeObjectURL(next[index].url);
        next[index] = nextItem;
        updateInputs(principalPreview, next);
        return next;
      });
    }
    setStatus(statusMessage);
  }

  function removePhoto(type: PhotoType, index: number) {
    if (type === "principal") {
      setPrincipalPreview((old) => {
        const next = old.filter((item, itemIndex) => {
          if (itemIndex === index) URL.revokeObjectURL(item.url);
          return itemIndex !== index;
        });
        updateInputs(next, extrasPreview);
        return next;
      });
      setStatus("Foto principal removida. Você pode escolher outra antes de enviar.");
      return;
    }
    setExtrasPreview((old) => {
      const next = old.filter((item, itemIndex) => {
        if (itemIndex === index) URL.revokeObjectURL(item.url);
        return itemIndex !== index;
      });
      updateInputs(principalPreview, next);
      return next;
    });
    setStatus("Foto extra removida.");
  }

  function useAsCover(index: number) {
    const selected = extrasPreview[index];
    if (!selected) return;
    const oldPrincipal = principalPreview[0];
    const nextPrincipal = [selected];
    const nextExtras = extrasPreview.filter((_, itemIndex) => itemIndex !== index);
    if (oldPrincipal) nextExtras.unshift(oldPrincipal);
    setPrincipalPreview(nextPrincipal);
    setExtrasPreview(nextExtras);
    updateInputs(nextPrincipal, nextExtras);
    setStatus("Foto escolhida como capa. Ela será a imagem principal do anúncio.");
  }

  async function analyzePhoto(type: PhotoType, index: number, item: PreviewItem) {
    const key = previewKey(type, index);
    setAnalisandoKey(key);
    setStatus("IA analisando enquadramento, placa, adesivos e qualidade da foto...");
    try {
      const imageDataUrl = await fileToDataUrl(item.file);
      const response = await fetch("/api/fotos/analisar-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.erro || "Erro na análise.");
      setAnalises((old) => ({ ...old, [key]: result.analise }));
      setStatus("Análise com IA concluída. Veja a nota e as recomendações abaixo da foto.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não consegui analisar essa foto agora.");
    } finally {
      setAnalisandoKey("");
    }
  }

  function processPrincipal(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setCropTarget({ type: "principal", index: 0, file });
    setStatus("Antes de enviar, ajuste a foto principal na moldura 4:3.");
  }

  function processExtras(event: React.ChangeEvent<HTMLInputElement>) {
    const file = Array.from(event.target.files || [])[0];
    event.target.value = "";
    if (!file) return;
    setCropTarget({ type: "extra", index: extrasPreview.length, file });
    setStatus("Ajuste essa foto extra na moldura 4:3 antes de salvar.");
  }

  async function applyCrop(target: CropTarget, croppedFile: File) {
    setProcessando(true);
    setStatus("Aplicando marca d’água depois do corte 4:3...");
    try {
      const processed = await addWatermark(croppedFile);
      const nextItem = makePreviews([processed])[0];
      if (target.type === "principal") {
        setPrincipalPreview((old) => {
          revokePreviews(old);
          const next = [nextItem];
          updateInputs(next, extrasPreview);
          return next;
        });
      } else {
        setExtrasPreview((old) => {
          const next = [...old, nextItem];
          updateInputs(principalPreview, next);
          return next;
        });
      }
      setCropTarget(null);
      setStatus("Foto salva em 4:3 com marca d’água. Agora ela não deve cortar metade do caminhão na página.");
    } catch (error) {
      console.error(error);
      setStatus("Não consegui preparar essa foto. Tente outra imagem.");
    } finally {
      setProcessando(false);
    }
  }

  function applyEditedFile(type: PhotoType, index: number, file: File) {
    replacePhoto(type, index, file, "Desfoque aplicado. Confira a prévia antes de enviar.");
    setEditorTarget(null);
  }

  const allPreviews = [
    ...principalPreview.map((item, index) => ({ item, index, type: "principal" as const, label: "Capa principal" })),
    ...extrasPreview.map((item, index) => ({ item, index, type: "extra" as const, label: "Foto extra" })),
  ];

  return (
    <div className="watermark-uploader">
      <div className="photo-grid">
        <label className="upload-field">
          <strong>Foto principal/capa</strong>
          <small>Escolha uma foto e ajuste o caminhão na moldura 4:3 antes de salvar.</small>
          <input ref={principalRef} name="foto_principal" type="file" accept="image/*" onChange={processPrincipal} disabled={processando} />
        </label>
        <label className="upload-field">
          <strong>Fotos extras</strong>
          <small>Adicione uma foto por vez para ajustar cada enquadramento sem cortar o caminhão.</small>
          <input ref={extrasRef} name="fotos_extras" type="file" accept="image/*" onChange={processExtras} disabled={processando} />
        </label>
      </div>

      {status && <p className="watermark-status">{status}</p>}

      {allPreviews.length > 0 && (
        <div className="preview-grid-watermark">
          {allPreviews.map(({ item, index, type, label }) => {
            const key = previewKey(type, index);
            const analise = analises[key];
            return (
              <figure key={`${item.name}-${type}-${index}`}>
                <img src={item.url} alt={item.name} />
                <figcaption>{label}</figcaption>
                <div className="photo-actions">
                  <button type="button" className="crop-button" onClick={() => setCropTarget({ type, index, file: item.file })}>Ajustar foto</button>
                  {type === "extra" && <button type="button" className="cover-button" onClick={() => useAsCover(index)}>Usar como capa</button>}
                  <button type="button" className="ai-button" onClick={() => analyzePhoto(type, index, item)} disabled={analisandoKey === key}>{analisandoKey === key ? "Analisando..." : "Analisar com IA"}</button>
                  <button type="button" className="blur-button" onClick={() => setEditorTarget({ type, index, item })}>Borrar placa/contato</button>
                  <button type="button" className="remove-button" onClick={() => removePhoto(type, index)}>Remover foto</button>
                </div>
                {analise && (
                  <div className="ai-result">
                    <strong>Nota da foto: {analise.nota ?? "-"}/10</strong>
                    {analise.resumo && <p>{analise.resumo}</p>}
                    {analise.melhorUso && <small>Melhor uso: {analise.melhorUso}</small>}
                    {analise.problemas?.length ? <ul>{analise.problemas.map((item, i) => <li key={`p-${i}`}>{item}</li>)}</ul> : null}
                    {analise.recomendacoes?.length ? <ul>{analise.recomendacoes.map((item, i) => <li key={`r-${i}`}>{item}</li>)}</ul> : null}
                    {analise.corteSugerido?.explicacao && <p><b>Corte sugerido:</b> {analise.corteSugerido.explicacao}</p>}
                    {analise.areasSensiveis?.length ? <p><b>Atenção:</b> {analise.areasSensiveis.map((a) => `${a.tipo}: ${a.descricao}`).join("; ")}</p> : null}
                  </div>
                )}
              </figure>
            );
          })}
        </div>
      )}

      {cropTarget && <CropEditor target={cropTarget} onCancel={() => setCropTarget(null)} onApply={applyCrop} />}
      {editorTarget && <BlurEditor target={editorTarget} onCancel={() => setEditorTarget(null)} onApply={applyEditedFile} />}

      <style jsx>{`.watermark-uploader{display:grid;gap:14px}.photo-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.upload-field{min-height:150px;padding:20px;border-radius:20px;border:1px dashed rgba(34,197,94,.45);background:rgba(34,197,94,.07);align-content:center;display:grid;gap:8px;color:#dbeafe;font-size:13px;font-weight:900}.upload-field strong{font-size:18px;color:white}.upload-field small{color:#94a3b8;line-height:1.45;font-weight:700}.upload-field input{margin-top:8px;padding:12px;border-style:solid;background:rgba(2,6,23,.52);width:100%;min-height:50px;border-radius:15px;border:1px solid rgba(255,255,255,.14);color:white;box-sizing:border-box}.watermark-status{margin:0;color:#d9f99d;font-size:13px;line-height:1.45;font-weight:850}.preview-grid-watermark{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.preview-grid-watermark figure{margin:0;overflow:hidden;border-radius:16px;border:1px solid rgba(255,255,255,.12);background:rgba(2,6,23,.52);position:relative;display:grid}.preview-grid-watermark img{width:100%;aspect-ratio:4/3;object-fit:contain;display:block;background:#f3f4f6}.preview-grid-watermark figcaption{position:absolute;left:8px;top:8px;padding:5px 8px;border-radius:999px;background:rgba(2,6,23,.75);color:white;font-size:11px;font-weight:950}.photo-actions{display:grid;grid-template-columns:1fr;gap:8px;margin:10px}.ai-button,.blur-button,.remove-button,.crop-button,.cover-button{min-height:42px;border:0;border-radius:12px;font-weight:950;cursor:pointer}.crop-button{background:#facc15;color:#422006}.cover-button{background:#2563eb;color:white}.ai-button{background:rgba(59,130,246,.95);color:white}.blur-button{background:#22c55e;color:#052e16}.remove-button{background:rgba(239,68,68,.92);color:white}.ai-button:disabled{opacity:.55;cursor:not-allowed}.ai-result{margin:0 10px 12px;padding:12px;border-radius:14px;border:1px solid rgba(59,130,246,.32);background:rgba(30,64,175,.16);color:#dbeafe;display:grid;gap:7px;font-size:13px;line-height:1.45}.ai-result strong{color:white}.ai-result p,.ai-result ul{margin:0}.ai-result ul{padding-left:18px}.ai-result small{color:#bfdbfe;font-weight:850}@media(max-width:980px){.photo-grid,.preview-grid-watermark{grid-template-columns:1fr}}`}</style>
    </div>
  );
}
