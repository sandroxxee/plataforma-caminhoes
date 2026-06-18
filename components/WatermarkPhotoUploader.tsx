"use client";

import { useRef, useState } from "react";
import {
  type PreviewItem,
  type PhotoType,
  type EditorTarget,
  type CropTarget,
  type AiAnalysis,
  addWatermark,
  setInputFiles,
  makePreviews,
  revokePreviews,
  fileToDataUrl,
} from "@/lib/imageUtils";
import { CropEditor, BlurEditor } from "@/components/PhotoEditors";

const UPLOADER_STYLES = `
.watermark-uploader{display:grid;gap:14px}
.photo-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.upload-field{min-height:150px;padding:20px;border-radius:20px;border:1px dashed rgba(34,197,94,.45);background:rgba(34,197,94,.07);align-content:center;display:grid;gap:8px;color:#dbeafe;font-size:13px;font-weight:900}
.upload-field strong{font-size:18px;color:white}
.upload-field small{color:#94a3b8;line-height:1.45;font-weight:700}
.upload-field input{margin-top:8px;padding:12px;border-style:solid;background:rgba(2,6,23,.52);width:100%;min-height:50px;border-radius:15px;border:1px solid rgba(255,255,255,.14);color:white;box-sizing:border-box}
.watermark-status{margin:0;color:#d9f99d;font-size:13px;line-height:1.45;font-weight:850}
.preview-grid-watermark{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.preview-grid-watermark figure{margin:0;overflow:hidden;border-radius:16px;border:1px solid rgba(255,255,255,.12);background:rgba(2,6,23,.52);position:relative;display:grid}
.preview-grid-watermark img{width:100%;aspect-ratio:4/3;object-fit:contain;display:block;background:#f3f4f6}
.preview-grid-watermark figcaption{position:absolute;left:8px;top:8px;padding:5px 8px;border-radius:999px;background:rgba(2,6,23,.75);color:white;font-size:11px;font-weight:950}
.photo-actions{display:grid;grid-template-columns:1fr;gap:8px;margin:10px}
.ai-button,.blur-button,.remove-button,.crop-button,.cover-button{min-height:42px;border:0;border-radius:12px;font-weight:950;cursor:pointer}
.crop-button{background:#facc15;color:#422006}
.cover-button{background:#2563eb;color:white}
.ai-button{background:rgba(59,130,246,.95);color:white}
.blur-button{background:#22c55e;color:#052e16}
.remove-button{background:rgba(239,68,68,.92);color:white}
.ai-button:disabled{opacity:.55;cursor:not-allowed}
.ai-result{margin:0 10px 12px;padding:12px;border-radius:14px;border:1px solid rgba(59,130,246,.32);background:rgba(30,64,175,.16);color:#dbeafe;display:grid;gap:7px;font-size:13px;line-height:1.45}
.ai-result strong{color:white}
.ai-result p,.ai-result ul{margin:0}
.ai-result ul{padding-left:18px}
.ai-result small{color:#bfdbfe;font-weight:850}
@media(max-width:980px){.photo-grid,.preview-grid-watermark{grid-template-columns:1fr}}
`;

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

  function updateInputs(principal: PreviewItem[], extras: PreviewItem[]) {
    setInputFiles(principalRef.current, principal.map((i) => i.file));
    setInputFiles(extrasRef.current, extras.map((i) => i.file));
  }

  function replacePhoto(type: PhotoType, index: number, file: File, msg: string) {
    const next = makePreviews([file])[0];
    if (type === "principal") {
      setPrincipalPreview((old) => {
        const arr = [...old];
        if (arr[index]) URL.revokeObjectURL(arr[index].url);
        arr[index] = next;
        updateInputs(arr, extrasPreview);
        return arr;
      });
    } else {
      setExtrasPreview((old) => {
        const arr = [...old];
        if (arr[index]) URL.revokeObjectURL(arr[index].url);
        arr[index] = next;
        updateInputs(principalPreview, arr);
        return arr;
      });
    }
    setStatus(msg);
  }

  function removePhoto(type: PhotoType, index: number) {
    if (type === "principal") {
      setPrincipalPreview((old) => {
        const next = old.filter((item, i) => { if (i === index) URL.revokeObjectURL(item.url); return i !== index; });
        updateInputs(next, extrasPreview);
        return next;
      });
      setStatus("Foto principal removida.");
      return;
    }
    setExtrasPreview((old) => {
      const next = old.filter((item, i) => { if (i === index) URL.revokeObjectURL(item.url); return i !== index; });
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
    const nextExtras = extrasPreview.filter((_, i) => i !== index);
    if (oldPrincipal) nextExtras.unshift(oldPrincipal);
    setPrincipalPreview(nextPrincipal);
    setExtrasPreview(nextExtras);
    updateInputs(nextPrincipal, nextExtras);
    setStatus("Foto escolhida como capa.");
  }

  async function analyzePhoto(type: PhotoType, index: number, item: PreviewItem) {
    const key = previewKey(type, index);
    setAnalisandoKey(key);
    setStatus("IA analisando enquadramento, placa e qualidade da foto...");
    try {
      const imageDataUrl = await fileToDataUrl(item.file);
      const res = await fetch("/api/fotos/analisar-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.erro || "Erro na análise.");
      setAnalises((old) => ({ ...old, [key]: result.analise }));
      setStatus("Análise com IA concluída.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Não consegui analisar essa foto agora.");
    } finally {
      setAnalisandoKey("");
    }
  }

  function processPrincipal(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setCropTarget({ type: "principal", index: 0, file });
    setStatus("Ajuste a foto principal na moldura 4:3.");
  }

  function processExtras(e: React.ChangeEvent<HTMLInputElement>) {
    const file = Array.from(e.target.files || [])[0];
    e.target.value = "";
    if (!file) return;
    setCropTarget({ type: "extra", index: extrasPreview.length, file });
    setStatus("Ajuste essa foto extra na moldura 4:3.");
  }

  async function applyCrop(target: CropTarget, croppedFile: File) {
    setProcessando(true);
    setStatus("Aplicando marca d'água depois do corte 4:3...");
    try {
      const processed = await addWatermark(croppedFile);
      const nextItem = makePreviews([processed])[0];
      if (target.type === "principal") {
        setPrincipalPreview((old) => { revokePreviews(old); const next = [nextItem]; updateInputs(next, extrasPreview); return next; });
      } else {
        setExtrasPreview((old) => { const next = [...old, nextItem]; updateInputs(principalPreview, next); return next; });
      }
      setCropTarget(null);
      setStatus("Foto salva em 4:3 com marca d'água.");
    } catch (err) {
      console.error(err);
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
          <small>Adicione uma foto por vez para ajustar cada enquadramento.</small>
          <input ref={extrasRef} name="fotos_extras" type="file" accept="image/*" onChange={processExtras} disabled={processando} />
        </label>
      </div>

      {status && <p className="watermark-status" role="status" aria-live="polite">{status}</p>}

      {allPreviews.length > 0 && (
        <div className="preview-grid-watermark">
          {allPreviews.map(({ item, index, type, label }) => {
            const key = previewKey(type, index);
            const analise = analises[key];
            return (
              <figure key={`${item.name}-${type}-${index}`}>
                <img src={item.url} alt={`${label} — ${item.name}`} />
                <figcaption>{label}</figcaption>
                <div className="photo-actions">
                  <button type="button" className="crop-button" onClick={() => setCropTarget({ type, index, file: item.file })}>Ajustar foto</button>
                  {type === "extra" && <button type="button" className="cover-button" onClick={() => useAsCover(index)}>Usar como capa</button>}
                  <button type="button" className="ai-button" onClick={() => analyzePhoto(type, index, item)} disabled={analisandoKey === key} aria-busy={analisandoKey === key}>
                    {analisandoKey === key ? "Analisando..." : "Analisar com IA"}
                  </button>
                  <button type="button" className="blur-button" onClick={() => setEditorTarget({ type, index, item })}>Borrar placa/contato</button>
                  <button type="button" className="remove-button" onClick={() => removePhoto(type, index)} aria-label={`Remover ${label}`}>Remover foto</button>
                </div>
                {analise && (
                  <div className="ai-result" role="region" aria-label="Resultado da análise de IA">
                    <strong>Nota da foto: {analise.nota ?? "-"}/10</strong>
                    {analise.resumo && <p>{analise.resumo}</p>}
                    {analise.melhorUso && <small>Melhor uso: {analise.melhorUso}</small>}
                    {analise.problemas?.length ? <ul>{analise.problemas.map((p, i) => <li key={`p-${i}`}>{p}</li>)}</ul> : null}
                    {analise.recomendacoes?.length ? <ul>{analise.recomendacoes.map((r, i) => <li key={`r-${i}`}>{r}</li>)}</ul> : null}
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

      <style>{UPLOADER_STYLES}</style>
    </div>
  );
}
