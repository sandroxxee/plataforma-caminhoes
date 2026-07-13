// Funções puras de imagem — sem React, sem estado

export const WATERMARK_TEXT = "www.caminhoesavenda.com";
export const OUTPUT_WIDTH = 1200;
export const OUTPUT_HEIGHT = 900;
export const JPEG_QUALITY = 0.9;

export type PreviewItem = { file: File; name: string; url: string };
export type BlurRect = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };
export type PhotoType = "principal" | "extra";
export type EditorTarget = { type: PhotoType; index: number; item: PreviewItem };
export type CropTarget = { type: PhotoType; index: number; file: File };
export type AiAnalysis = {
  nota?: number;
  resumo?: string;
  problemas?: string[];
  recomendacoes?: string[];
  melhorUso?: string;
  corteSugerido?: { x?: number; y?: number; w?: number; h?: number; explicacao?: string };
  areasSensiveis?: Array<{ tipo?: string; descricao?: string }>;
};

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Não foi possível carregar a imagem.")); };
    image.src = url;
  });
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível carregar a prévia."));
    image.src = url;
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });
}

export function canvasToFile(canvas: HTMLCanvasElement, originalName: string, suffix = "editada"): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error("Não foi possível preparar a imagem.")); return; }
      const cleanName = originalName
        .replace(/\.[a-z0-9]+$/i, "")
        .replace(/-(marca-dagua|borrado|corte-4x3|editada)$/i, "");
      resolve(new File([blob], `${cleanName}-${suffix}.jpg`, { type: "image/jpeg" }));
    }, "image/jpeg", JPEG_QUALITY);
  });
}

export function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
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

export async function addWatermark(file: File): Promise<File> {
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

export function setInputFiles(input: HTMLInputElement | null, files: File[]) {
  if (!input) return;
  const transfer = new DataTransfer();
  files.forEach((file) => transfer.items.add(file));
  input.files = transfer.files;
}

export function revokePreviews(items: PreviewItem[]) {
  items.forEach((item) => URL.revokeObjectURL(item.url));
}

export function makePreviews(files: File[]): PreviewItem[] {
  return files.map((file) => ({ file, name: file.name, url: URL.createObjectURL(file) }));
}

export function getPointerPosition(event: React.PointerEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: Math.max(0, Math.min(canvas.width, (event.clientX - rect.left) * scaleX)),
    y: Math.max(0, Math.min(canvas.height, (event.clientY - rect.top) * scaleY)),
  };
}

export function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
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

export function normalizeRect(start: Point, end: Point): BlurRect {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    w: Math.abs(end.x - start.x),
    h: Math.abs(end.y - start.y),
  };
}

export function drawBlurArea(ctx: CanvasRenderingContext2D, source: HTMLCanvasElement, rect: BlurRect) {
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

export async function applyBlurToFile(file: File, rects: BlurRect[]): Promise<File> {
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

export async function autoCropAndWatermark(file: File): Promise<File> {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível preparar o canvas.");
  
  ctx.fillStyle = "#f3f4f6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;
  
  ctx.drawImage(image, x, y, w, h);
  drawWatermark(ctx, canvas.width, canvas.height);
  
  return canvasToFile(canvas, file.name, "marca-dagua");
}

