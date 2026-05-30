"use client";

import { useRef, useState } from "react";

const WATERMARK_TEXT = "www.caminhoesavenda.com";
const MAX_WIDTH = 1800;
const JPEG_QUALITY = 0.9;

type PreviewItem = {
  name: string;
  url: string;
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

function canvasToFile(canvas: HTMLCanvasElement, originalName: string) {
  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Não foi possível preparar a imagem."));
          return;
        }

        const cleanName = originalName.replace(/\.[a-z0-9]+$/i, "");
        resolve(new File([blob], `${cleanName}-marca-dagua.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
}

function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const shortSide = Math.min(width, height);
  const fontSize = Math.max(42, Math.round(shortSide * 0.052));
  const padding = Math.max(30, Math.round(shortSide * 0.045));
  const letterSpacing = Math.max(1.5, fontSize * 0.035);

  ctx.save();
  ctx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  const x = width / 2;
  const y = height - padding - fontSize * 0.55;

  // Base escura muito transparente, sem cor forte. Ajuda a aparecer em foto clara.
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = fontSize * 0.18;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = Math.max(2, fontSize * 0.05);
  ctx.fillText(WATERMARK_TEXT, x, y);

  // Relevo claro/transparente, estilo vidro/3D, sem usar cor de marca.
  ctx.globalAlpha = 0.34;
  ctx.shadowColor = "rgba(255, 255, 255, 0.45)";
  ctx.shadowBlur = fontSize * 0.09;
  ctx.shadowOffsetX = -Math.max(1, fontSize * 0.025);
  ctx.shadowOffsetY = -Math.max(1, fontSize * 0.025);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = Math.max(1.8, fontSize * 0.055);
  ctx.strokeText(WATERMARK_TEXT, x, y);

  // Texto principal branco com transparência controlada.
  ctx.globalAlpha = 0.58;
  ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
  ctx.shadowBlur = fontSize * 0.12;
  ctx.shadowOffsetX = Math.max(1, fontSize * 0.025);
  ctx.shadowOffsetY = Math.max(2, fontSize * 0.045);
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillText(WATERMARK_TEXT, x, y);

  // Segunda marca grande diagonal, bem transparente, para proteger sem poluir.
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-Math.PI / 11);
  ctx.font = `900 ${Math.max(54, Math.round(shortSide * 0.075))}px Arial, Helvetica, sans-serif`;
  ctx.globalAlpha = 0.105;
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = fontSize * 0.22;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = Math.max(2, fontSize * 0.045);
  ctx.strokeText(WATERMARK_TEXT, 0, 0);
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillText(WATERMARK_TEXT, letterSpacing, letterSpacing);

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
    name: file.name,
    url: URL.createObjectURL(file),
  }));
}

export function WatermarkPhotoUploader() {
  const principalRef = useRef<HTMLInputElement>(null);
  const extrasRef = useRef<HTMLInputElement>(null);
  const [principalPreview, setPrincipalPreview] = useState<PreviewItem[]>([]);
  const [extrasPreview, setExtrasPreview] = useState<PreviewItem[]>([]);
  const [status, setStatus] = useState("");
  const [processando, setProcessando] = useState(false);

  async function processPrincipal(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessando(true);
    setStatus("Aplicando marca d’água moderna na foto principal...");

    try {
      const processed = await addWatermark(file);
      setInputFiles(principalRef.current, [processed]);
      setPrincipalPreview((old) => {
        revokePreviews(old);
        return makePreviews([processed]);
      });
      setStatus("Marca d’água aplicada. Confira a prévia antes de enviar.");
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
    setStatus("Aplicando marca d’água moderna nas fotos extras...");

    try {
      const processed = await Promise.all(files.map((file) => addWatermark(file)));
      setInputFiles(extrasRef.current, processed);
      setExtrasPreview((old) => {
        revokePreviews(old);
        return makePreviews(processed);
      });
      setStatus(`Marca d’água aplicada em ${processed.length} foto${processed.length === 1 ? "" : "s"}. Confira a prévia antes de enviar.`);
    } catch (error) {
      console.error(error);
      setStatus("Não consegui aplicar a marca d’água em uma das fotos. Tente enviar menos imagens ou fotos menores.");
    } finally {
      setProcessando(false);
    }
  }

  return (
    <div className="watermark-uploader">
      <div className="photo-grid">
        <label className="upload-field">
          <strong>Foto principal</strong>
          <small>Será enviada com marca d’água transparente, moderna e sem cor forte: {WATERMARK_TEXT}.</small>
          <input ref={principalRef} name="foto_principal" type="file" accept="image/*" onChange={processPrincipal} disabled={processando} />
        </label>

        <label className="upload-field">
          <strong>Fotos extras</strong>
          <small>Frente, lateral, traseira, cabine, pneus e carroceria.</small>
          <input ref={extrasRef} name="fotos_extras" type="file" accept="image/*" multiple onChange={processExtras} disabled={processando} />
        </label>
      </div>

      {status && <p className="watermark-status">{status}</p>}

      {(principalPreview.length > 0 || extrasPreview.length > 0) && (
        <div className="preview-grid-watermark">
          {[...principalPreview, ...extrasPreview].map((item, index) => (
            <figure key={`${item.name}-${index}`}>
              <img src={item.url} alt={item.name} />
              <figcaption>{index === 0 ? "Principal" : "Extra"}</figcaption>
            </figure>
          ))}
        </div>
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
        }

        .preview-grid-watermark img {
          width: 100%;
          aspect-ratio: 1.35 / 1;
          object-fit: cover;
          display: block;
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

        @media (max-width: 980px) {
          .photo-grid,
          .preview-grid-watermark {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
