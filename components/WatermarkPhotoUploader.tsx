"use client";

import { useRef, useState } from "react";

const WATERMARK_TEXT = "www.caminhoesavenda.com";
const MAX_WIDTH = 1800;
const JPEG_QUALITY = 0.88;

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
  const fontSize = Math.max(28, Math.round(shortSide * 0.035));
  const padding = Math.max(26, Math.round(shortSide * 0.035));
  const radius = Math.round(fontSize * 0.55);

  ctx.save();
  ctx.font = `900 ${fontSize}px Arial, sans-serif`;
  const textWidth = ctx.measureText(WATERMARK_TEXT).width;
  const boxWidth = textWidth + padding * 1.35;
  const boxHeight = fontSize + padding * 0.8;
  const x = width - boxWidth - padding;
  const y = height - boxHeight - padding;

  ctx.globalAlpha = 0.74;
  ctx.fillStyle = "rgba(2, 6, 23, 0.72)";
  ctx.beginPath();
  ctx.roundRect(x, y, boxWidth, boxHeight, radius);
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
  ctx.textBaseline = "middle";
  ctx.fillText(WATERMARK_TEXT, x + padding * 0.68, y + boxHeight / 2 + 1);
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
    setStatus("Aplicando marca d’água na foto principal...");

    try {
      const processed = await addWatermark(file);
      setInputFiles(principalRef.current, [processed]);
      setPrincipalPreview(makePreviews([processed]));
      setStatus("Marca d’água aplicada na foto principal.");
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
    setStatus("Aplicando marca d’água nas fotos extras...");

    try {
      const processed = await Promise.all(files.map((file) => addWatermark(file)));
      setInputFiles(extrasRef.current, processed);
      setExtrasPreview(makePreviews(processed));
      setStatus(`Marca d’água aplicada em ${processed.length} foto${processed.length === 1 ? "" : "s"}.`);
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
          <small>Será enviada já com a marca d’água {WATERMARK_TEXT}.</small>
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
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
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
