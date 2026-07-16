"use client";

import { useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, ZoomIn, ZoomOut, RotateCcw, Check, Loader2, ImageIcon } from "lucide-react";

// Crop simples sem biblioteca externa
interface CropState { x: number; y: number; scale: number }

async function getCroppedBlob(imageSrc: string, zoom: number): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = imageSrc;
  });
  // proporção 16:6 centralizada
  const aspect   = 16 / 6;
  const srcW     = img.naturalWidth  * zoom;
  const srcH     = img.naturalHeight * zoom;
  let cropW = srcW;
  let cropH = srcW / aspect;
  if (cropH > srcH) { cropH = srcH; cropW = srcH * aspect; }
  const sx = (img.naturalWidth  - cropW / zoom) / 2;
  const sy = (img.naturalHeight - cropH / zoom) / 2;
  const outW = Math.round(cropW);
  const outH = Math.round(cropH);
  const canvas = document.createElement("canvas");
  canvas.width  = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, sx, sy, cropW / zoom, cropH / zoom, 0, 0, outW, outH);
  return new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.92));
}

type Props = { currentUrl: string; onSaved: (url: string) => void };

export function HeroBannerUpload({ currentUrl, onSaved }: Props) {
  const inputRef            = useRef<HTMLInputElement>(null);
  const [src, setSrc]       = useState<string | null>(null);
  const [zoom, setZoom]     = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSrc(URL.createObjectURL(file));
    setZoom(1); setSaved(false); setError("");
  }

  async function handleSave() {
    if (!src) return;
    setSaving(true); setError("");
    try {
      const blob     = await getCroppedBlob(src, zoom);
      const supabase = createClient();
      const fileName = `hero-banner-${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .upload(fileName, blob, { contentType: "image/jpeg", upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("site-assets").getPublicUrl(fileName);
      onSaved(data.publicUrl);
      setSaved(true); setSrc(null);
    } catch (e: any) {
      setError(e?.message || "Erro ao enviar imagem.");
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setSrc(null); setSaved(false); setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div style={s.wrap}>

      {/* Preview atual */}
      {!src && currentUrl && (
        <div style={s.previewWrap}>
          <img src={currentUrl} alt="Capa atual" style={s.previewImg} />
          <span style={s.previewBadge}>Imagem atual</span>
        </div>
      )}

      {/* Preview da nova imagem + zoom */}
      {src && (
        <div style={s.cropperSection}>
          <div style={s.previewNew}>
            <img
              src={src}
              alt="Nova capa"
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: "center", display: "block" }}
            />
          </div>
          <div style={s.controls}>
            <ZoomOut size={16} style={{ flexShrink: 0 }} />
            <input type="range" min={1} max={2.5} step={0.01} value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={s.slider} aria-label="Zoom" />
            <ZoomIn size={16} style={{ flexShrink: 0 }} />
            <span style={s.zoomVal}>{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={reset} style={s.resetBtn}>
              <RotateCcw size={13} /> Cancelar
            </button>
          </div>
          <button type="button" onClick={handleSave} disabled={saving} style={s.saveBtn}>
            {saving ? <Loader2 size={16} /> : <Check size={16} />}
            {saving ? "Enviando..." : "Confirmar imagem"}
          </button>
        </div>
      )}

      {saved && <div style={s.success}>✅ Imagem salva! Clique em “Salvar alterações” abaixo para confirmar.</div>}
      {error && <div style={s.errorBox}>❌ {error}</div>}

      {/* Botão upload — sempre visível */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={s.uploadBtn}
      >
        {currentUrl ? <ImageIcon size={16} /> : <Upload size={16} />}
        {currentUrl ? "Trocar imagem da capa" : "Enviar imagem da capa"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      <small style={s.hint}>JPG, PNG ou WebP. Recomendado: 1600×600px ou maior.</small>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap:           { display: "grid", gap: 12 },
  previewWrap:    { position: "relative", borderRadius: 14, overflow: "hidden", height: 160 },
  previewImg:     { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  previewBadge:   { position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 11, fontWeight: 900, padding: "4px 10px", borderRadius: 999 },
  previewNew:     { position: "relative", height: 180, borderRadius: 14, overflow: "hidden", background: "var(--soft)" },
  cropperSection: { display: "grid", gap: 10 },
  controls:       { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 12, background: "var(--soft)", border: "1px solid var(--line)" },
  slider:         { flex: 1, accentColor: "var(--blue)" },
  zoomVal:        { fontSize: 12, fontWeight: 800, color: "var(--muted)", minWidth: 36, textAlign: "right" },
  resetBtn:       { display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--muted)", fontWeight: 800, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" },
  saveBtn:        { display: "inline-flex", alignItems: "center", gap: 8, minHeight: 46, padding: "0 22px", borderRadius: 14, border: 0, background: "var(--success)", color: "#fff", fontWeight: 950, fontSize: 14, cursor: "pointer" },
  success:        { padding: "10px 16px", borderRadius: 12, background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.2)", color: "var(--success)", fontWeight: 800, fontSize: 13 },
  errorBox:       { padding: "10px 16px", borderRadius: 12, background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "var(--danger)", fontWeight: 800, fontSize: 13 },
  uploadBtn:      { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 48, padding: "0 22px", borderRadius: 14, border: "2px dashed var(--blue)", background: "var(--blueSoft)", color: "var(--blue)", fontWeight: 900, fontSize: 14, cursor: "pointer", width: "100%" },
  hint:           { color: "var(--muted)", fontWeight: 700, fontSize: 12 },
};
