"use client";

import { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { createClient } from "@/lib/supabase/client";
import { Upload, ZoomIn, ZoomOut, RotateCcw, Check, Loader2 } from "lucide-react";

async function getCroppedBlob(imageSrc: string, cropArea: Area): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = imageSrc;
  });
  const canvas = document.createElement("canvas");
  canvas.width  = cropArea.width;
  canvas.height = cropArea.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, cropArea.width, cropArea.height);
  return new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.92));
}

type Props = { currentUrl: string; onSaved: (url: string) => void };

export function HeroBannerUpload({ currentUrl, onSaved }: Props) {
  const inputRef              = useRef<HTMLInputElement>(null);
  const [src, setSrc]         = useState<string | null>(null);
  const [crop, setCrop]       = useState({ x: 0, y: 0 });
  const [zoom, setZoom]       = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSrc(URL.createObjectURL(file));
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setSaved(false);
    setError("");
  }

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedArea(pixels);
  }, []);

  async function handleSave() {
    if (!src || !croppedArea) return;
    setSaving(true);
    setError("");
    try {
      const blob = await getCroppedBlob(src, croppedArea);
      const supabase  = createClient();
      const fileName  = `hero-banner-${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .upload(fileName, blob, { contentType: "image/jpeg", upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("site-assets").getPublicUrl(fileName);
      onSaved(data.publicUrl);
      setSaved(true);
      setSrc(null);
    } catch (e: any) {
      setError(e?.message || "Erro ao enviar imagem.");
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setSrc(null);
    setSaved(false);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div style={s.wrap}>
      <p style={s.label}>Imagem da capa (banner hero)</p>

      {/* Preview atual */}
      {!src && currentUrl && (
        <div style={s.previewWrap}>
          <img src={currentUrl} alt="Capa atual" style={s.previewImg} />
          <span style={s.previewBadge}>Imagem atual</span>
        </div>
      )}

      {/* Cropper */}
      {src && (
        <div style={s.cropperSection}>
          <div style={s.cropperBox}>
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={16 / 6}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div style={s.controls}>
            <ZoomOut size={16} />
            <input
              type="range" min={1} max={3} step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={s.slider}
              aria-label="Zoom"
            />
            <ZoomIn size={16} />
            <button type="button" onClick={reset} style={s.resetBtn} title="Cancelar">
              <RotateCcw size={14} /> Cancelar
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={s.saveBtn}
          >
            {saving ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
            {saving ? "Enviando..." : "Salvar imagem"}
          </button>
        </div>
      )}

      {saved && (
        <div style={s.success}>✅ Imagem da capa atualizada! Clique em “Salvar alterações” para confirmar.</div>
      )}
      {error && <div style={s.errorBox}>{error}</div>}

      <button type="button" onClick={() => inputRef.current?.click()} style={s.uploadBtn}>
        <Upload size={15} />
        {currentUrl ? "Trocar imagem da capa" : "Enviar imagem da capa"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      <small style={s.hint}>Recomendado: 1600×600px ou maior. Após recortar, clique em Salvar imagem e depois em Salvar alterações.</small>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap:          { display: "grid", gap: 12 },
  label:         { margin: 0, fontWeight: 900, fontSize: 13, color: "#334155" },
  previewWrap:   { position: "relative", borderRadius: 14, overflow: "hidden", maxHeight: 200 },
  previewImg:    { width: "100%", objectFit: "cover", display: "block", maxHeight: 200 },
  previewBadge:  { position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 11, fontWeight: 900, padding: "4px 10px", borderRadius: 999 },
  cropperSection:{ display: "grid", gap: 12 },
  cropperBox:    { position: "relative", width: "100%", height: 240, background: "#0f172a", borderRadius: 14, overflow: "hidden" },
  controls:      { display: "flex", alignItems: "center", gap: 10, color: "#64748b" },
  slider:        { flex: 1, accentColor: "#1f64b5" },
  resetBtn:      { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, border: "1px solid #d8dee9", background: "#f1f5f9", color: "#64748b", fontWeight: 800, cursor: "pointer", fontSize: 13 },
  saveBtn:       { display: "inline-flex", alignItems: "center", gap: 8, minHeight: 46, padding: "0 22px", borderRadius: 14, border: 0, background: "#16a34a", color: "#fff", fontWeight: 950, fontSize: 14, cursor: "pointer" },
  success:       { padding: "10px 16px", borderRadius: 12, background: "#dcfce7", border: "1px solid #bbf7d0", color: "#166534", fontWeight: 800, fontSize: 13 },
  errorBox:      { padding: "10px 16px", borderRadius: 12, background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", fontWeight: 800, fontSize: 13 },
  uploadBtn:     { display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 18px", borderRadius: 12, border: "1.5px dashed #93c5fd", background: "#eff6ff", color: "#1d4ed8", fontWeight: 800, fontSize: 13, cursor: "pointer" },
  hint:          { color: "#94a3b8", fontWeight: 700, fontSize: 12 },
};
