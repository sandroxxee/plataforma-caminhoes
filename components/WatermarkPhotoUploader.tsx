"use client";

import { useEffect, useRef, useState } from "react";

const WATERMARK_TEXT = "www.caminhoesavenda.com";
const MAX_WIDTH = 1800;
const JPEG_QUALITY = 0.9;

type PreviewItem = {
  file: File;
  name: string;
  url: string;
};

type BlurRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Point = { x: number; y: number };

type EditorTarget = {
  type: "principal" | "extra";
  index: number;
  item: PreviewItem;
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

function canvasToFile(canvas: HTMLCanvasElement, originalName: string, suffix = "marca-dagua") {
  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Não foi possível preparar a imagem."));
          return;
        }

        const cleanName = originalName.replace(/\.[a-z0-9]+$/i, "").replace(/-(marca-dagua|borrado)$/i, "");
        resolve(new File([blob], `${cleanName}-${suffix}.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
}

function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const shortSide = Math.min(width, height);
  const fontSize = Math.max(34, Math.round(shortSide * 0.045));

  ctx.save();
  ctx.font = `850 ${fontSize}px Arial, Helvetica, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  const x = width / 2;
  const y = height / 2;

  ctx.globalAlpha = 0.34;
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
  ctx.shadowBlur = fontSize * 0.2;
  ctx.shadowOffsetX = Math.max(1, fontSize * 0.03);
  ctx.shadowOffsetY = Math.max(2, fontSize * 0.07);
  ctx.fillText(WATERMARK_TEXT, x, y + Math.max(1, fontSize * 0.04));

  ctx.globalAlpha = 0.52;
  ctx.shadowColor = "rgba(255, 255, 255, 0.35)";
  ctx.shadowBlur = fontSize * 0.08;
  ctx.shadowOffsetX = -Math.max(1, fontSize * 0.025);
  ctx.shadowOffsetY = -Math.max(1, fontSize * 0.025);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = Math.max(1.4, fontSize * 0.04);
  ctx.strokeText(WATERMARK_TEXT, x, y);

  ctx.globalAlpha = 0.68;
  ctx.shadowColor = "rgba(0, 0, 0, 0.72)";
  ctx.shadowBlur = fontSize * 0.1;
  ctx.shadowOffsetX = Math.max(1, fontSize * 0.02);
  ctx.shadowOffsetY = Math.max(1, fontSize * 0.035);
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillText(WATERMARK_TEXT, x, y);

  ctx.restore();
}

async function addWatermark(file: File) {
  const image = await loadImage(file);
  const scale = image.width > MAX_WIDTH ? MAX_WIDTH / image.width : 1;
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Navegador não conseguiu preparar a imagem.");

  ctx.drawImage(image, 0, 0, width, height);
  drawWatermark(ctx, width, height);

  return canvasToFile(canvas, file.name);
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

function addFineGrain(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const area = Math.max(1, w * h);
  const dots = Math.min(2200, Math.max(180, Math.round(area / 520)));

  ctx.save();
  ctx.globalCompositeOperation = "overlay";

  for (let i = 0; i < dots; i += 1) {
    const px = x + Math.random() * w;
    const py = y + Math.random() * h;
    const alpha = 0.035 + Math.random() * 0.055;
    const tone = Math.random() > 0.5 ? 255 : 0;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = `rgb(${tone}, ${tone}, ${tone})`;
    ctx.fillRect(px, py, 1.15, 1.15);
  }

  ctx.restore();
}

function drawBlurArea(ctx: CanvasRenderingContext2D, source: HTMLCanvasElement, rect: BlurRect) {
  const x = Math.max(0, Math.min(source.width, rect.x));
  const y = Math.max(0, Math.min(source.height, rect.y));
  const w = Math.max(1, Math.min(source.width - x, rect.w));
  const h = Math.max(1, Math.min(source.height - y, rect.h));
  const shortSide = Math.min(source.width, source.height);
  const blur = Math.max(28, Math.round(shortSide * 0.052));
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

  addFineGrain(ctx, x, y, w, h);

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
  return files.map((file) => ({
    file,
    name: file.name,
    url: URL.createObjectURL(file),
  }));
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

function normalizeRect(start: Point, end: Point): BlurRect {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    w: Math.abs(end.x - start.x),
    h: Math.abs(end.y - start.y),
  };
}

function BlurEditor({ target, onCancel, onApply }: { target: EditorTarget; onCancel: () => void; onApply: (type: EditorTarget["type"], index: number, file: File) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const displayRef = useRef({ scale: 1 });
  const dragStartRef = useRef<Point | null>(null);
  const dragEndRef = useRef<Point | null>(null);
  const [rects, setRects] = useState<BlurRect[]>([]);
  const rectsRef = useRef<BlurRect[]>([]);
  const [status, setStatus] = useState("Modo manual: arraste uma caixa em cima da placa Mercosul, placa cinza, adesivo, telefone ou contato.");

  function drawCanvas(currentRects: BlurRect[], tempRect?: BlurRect) {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxCanvasWidth = Math.min(980, window.innerWidth - 36);
    const scale = Math.min(maxCanvasWidth / image.width, 650 / image.height, 1);
    const drawWidth = Math.max(1, Math.round(image.width * scale));
    const drawHeight = Math.max(1, Math.round(image.height * scale));

    canvas.width = drawWidth;
    canvas.height = drawHeight;
    displayRef.current = { scale };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, drawWidth, drawHeight);

    const allRects = tempRect ? [...currentRects, tempRect] : currentRects;
    allRects.forEach((rect) => {
      const radius = Math.max(8, Math.round(Math.min(rect.w, rect.h) * 0.16));
      ctx.save();
      roundedRectPath(ctx, rect.x, rect.y, rect.w, rect.h, radius);
      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
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
    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch {
      // Alguns navegadores soltam automaticamente o pointer capture.
    }

    const rect = normalizeRect(start, end);
    dragStartRef.current = null;
    dragEndRef.current = null;

    if (rect.w > 8 && rect.h > 8) {
      const nextRects = [...rectsRef.current, rect];
      rectsRef.current = nextRects;
      setRects(nextRects);
      setStatus("Área marcada. Pode marcar outra placa/adesivo ou clicar em aplicar desfoque.");
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
    const fullRects = rectsRef.current.map((rect) => ({
      x: rect.x / scale,
      y: rect.y / scale,
      w: rect.w / scale,
      h: rect.h / scale,
    }));

    setStatus("Aplicando desfoque fino com granulação, sem cor...");

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

  function autoNotice() {
    setStatus("Automático ainda precisa integração de IA no servidor. Por enquanto use o manual: arraste a caixa em cima da placa/contato. Esse manual é o que garante não passar nada.");
  }

  return (
    <div className="editor-backdrop" role="dialog" aria-modal="true">
      <div className="editor-panel">
        <div className="editor-head">
          <div>
            <strong>Borrar placa/contato</strong>
            <p>{status}</p>
          </div>
          <button type="button" onClick={onCancel} className="editor-close">Fechar</button>
        </div>

        <div className="mode-actions">
          <button type="button" onClick={autoNotice}>Automático</button>
          <button type="button" className="mode-active">Manual: arrastar caixa</button>
        </div>

        <canvas
          ref={canvasRef}
          className="blur-canvas"
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

      <style jsx>{`
        .editor-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          padding: 18px;
          display: grid;
          place-items: center;
          background: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(10px);
        }

        .editor-panel {
          width: min(1040px, 100%);
          max-height: 96vh;
          overflow: auto;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,.16);
          background: #071014;
          padding: 16px;
          box-shadow: 0 30px 80px rgba(0,0,0,.45);
        }

        .editor-head {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .editor-head strong {
          display: block;
          color: white;
          font-size: 18px;
          margin-bottom: 5px;
        }

        .editor-head p {
          margin: 0;
          color: #cbd5e1;
          line-height: 1.45;
        }

        .editor-close,
        .editor-actions button,
        .mode-actions button {
          min-height: 42px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 12px;
          background: rgba(255,255,255,.08);
          color: white;
          padding: 0 14px;
          font-weight: 900;
          cursor: pointer;
        }

        .mode-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .mode-active {
          background: #22c55e !important;
          color: #052e16 !important;
          border-color: transparent !important;
        }

        .blur-canvas {
          width: 100%;
          height: auto;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(2,6,23,.78);
          touch-action: none;
          cursor: crosshair;
          display: block;
          user-select: none;
        }

        .editor-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
          margin-top: 14px;
        }

        .editor-actions button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .apply-blur {
          background: #22c55e !important;
          color: #052e16 !important;
          border-color: transparent !important;
        }
      `}</style>
    </div>
  );
}

export function WatermarkPhotoUploader() {
  const principalRef = useRef<HTMLInputElement>(null);
  const extrasRef = useRef<HTMLInputElement>(null);
  const [principalPreview, setPrincipalPreview] = useState<PreviewItem[]>([]);
  const [extrasPreview, setExtrasPreview] = useState<PreviewItem[]>([]);
  const [editorTarget, setEditorTarget] = useState<EditorTarget | null>(null);
  const [status, setStatus] = useState("");
  const [processando, setProcessando] = useState(false);

  function updateInputs(principalItems: PreviewItem[], extraItems: PreviewItem[]) {
    setInputFiles(principalRef.current, principalItems.map((item) => item.file));
    setInputFiles(extrasRef.current, extraItems.map((item) => item.file));
  }

  function removePhoto(type: EditorTarget["type"], index: number) {
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

  async function processPrincipal(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessando(true);
    setStatus("Aplicando marca d’água centralizada na foto principal...");

    try {
      const processed = await addWatermark(file);
      const nextPrincipal = makePreviews([processed]);
      setPrincipalPreview((old) => {
        revokePreviews(old);
        updateInputs(nextPrincipal, extrasPreview);
        return nextPrincipal;
      });
      setStatus("Marca d’água aplicada. Use 'Borrar automático/manual' se precisar esconder placa, telefone, adesivo ou contato.");
    } catch (error) {
      console.error(error);
      setStatus("Não consegui aplicar a marca d’água nessa foto. Tente outra imagem.");
    } finally {
      setProcessando(false);
    }
  }

  async function processExtras(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, 8);
    if (files.length === 0) return;

    setProcessando(true);
    setStatus("Aplicando marca d’água centralizada nas fotos extras...");

    try {
      const processed = await Promise.all(files.map((file) => addWatermark(file)));
      const nextExtras = makePreviews(processed);
      setExtrasPreview((old) => {
        revokePreviews(old);
        updateInputs(principalPreview, nextExtras);
        return nextExtras;
      });
      setStatus(`Marca d’água aplicada em ${processed.length} foto${processed.length === 1 ? "" : "s"}. Use o botão de borrar automático/manual nas fotos que tiverem placa, adesivo ou contato.`);
    } catch (error) {
      console.error(error);
      setStatus("Não consegui aplicar a marca d’água em uma das fotos. Tente enviar menos imagens ou fotos menores.");
    } finally {
      setProcessando(false);
    }
  }

  function applyEditedFile(type: EditorTarget["type"], index: number, file: File) {
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

    setEditorTarget(null);
    setStatus("Desfoque aplicado com cantos arredondados, sem cor e com granulação fina. Confira a prévia antes de enviar.");
  }

  const allPreviews = [
    ...principalPreview.map((item, index) => ({ item, index, type: "principal" as const, label: "Principal" })),
    ...extrasPreview.map((item, index) => ({ item, index, type: "extra" as const, label: "Extra" })),
  ];

  return (
    <div className="watermark-uploader">
      <div className="photo-grid">
        <label className="upload-field">
          <strong>Foto principal</strong>
          <small>Será enviada com marca d’água centralizada. Depois você pode borrar placa Mercosul, placa antiga, adesivo, telefone ou contato.</small>
          <input ref={principalRef} name="foto_principal" type="file" accept="image/*" onChange={processPrincipal} disabled={processando} />
        </label>

        <label className="upload-field">
          <strong>Fotos extras</strong>
          <small>Frente, traseira, lateral, cabine, pneus e carroceria.</small>
          <input ref={extrasRef} name="fotos_extras" type="file" accept="image/*" multiple onChange={processExtras} disabled={processando} />
        </label>
      </div>

      {status && <p className="watermark-status">{status}</p>}

      {allPreviews.length > 0 && (
        <div className="preview-grid-watermark">
          {allPreviews.map(({ item, index, type, label }) => (
            <figure key={`${item.name}-${type}-${index}`}>
              <img src={item.url} alt={item.name} />
              <figcaption>{label}</figcaption>
              <div className="photo-actions">
                <button type="button" className="blur-button" onClick={() => setEditorTarget({ type, index, item })}>
                  Borrar automático/manual
                </button>
                <button type="button" className="remove-button" onClick={() => removePhoto(type, index)}>
                  Remover foto
                </button>
              </div>
            </figure>
          ))}
        </div>
      )}

      {editorTarget && (
        <BlurEditor
          target={editorTarget}
          onCancel={() => setEditorTarget(null)}
          onApply={applyEditedFile}
        />
      )}

      <style jsx>{`
        .watermark-uploader {
          display: grid;
          gap: 14px;
        }

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .upload-field {
          min-height: 150px;
          padding: 20px;
          border-radius: 20px;
          border: 1px dashed rgba(34,197,94,.45);
          background: rgba(34,197,94,.07);
          align-content: center;
          display: grid;
          gap: 8px;
          color: #dbeafe;
          font-size: 13px;
          font-weight: 900;
        }

        .upload-field strong {
          font-size: 18px;
          color: white;
        }

        .upload-field small {
          color: #94a3b8;
          line-height: 1.45;
          font-weight: 700;
        }

        .upload-field input {
          margin-top: 8px;
          padding: 12px;
          border-style: solid;
          background: rgba(2,6,23,.52);
          width: 100%;
          min-height: 50px;
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,.14);
          color: white;
          box-sizing: border-box;
        }

        .watermark-status {
          margin: 0;
          color: #d9f99d;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 850;
        }

        .preview-grid-watermark {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .preview-grid-watermark figure {
          margin: 0;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(2,6,23,.52);
          position: relative;
          display: grid;
        }

        .preview-grid-watermark img {
          width: 100%;
          max-height: 520px;
          object-fit: contain;
          display: block;
          background: rgba(2,6,23,.78);
        }

        .preview-grid-watermark figcaption {
          position: absolute;
          left: 8px;
          top: 8px;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(2,6,23,.75);
          color: white;
          font-size: 11px;
          font-weight: 950;
        }

        .photo-actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin: 10px;
        }

        .blur-button,
        .remove-button {
          min-height: 42px;
          border: 0;
          border-radius: 12px;
          font-weight: 950;
          cursor: pointer;
        }

        .blur-button {
          background: #22c55e;
          color: #052e16;
        }

        .remove-button {
          background: rgba(239, 68, 68, 0.92);
          color: white;
        }

        @media (max-width: 980px) {
          .photo-grid,
          .preview-grid-watermark,
          .photo-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
