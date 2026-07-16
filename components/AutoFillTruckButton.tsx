"use client";

import { useState } from "react";
import { preencherComIa, SugestaoAnuncio } from "@/services/iaService";
export type { SugestaoAnuncio };

type Props = {
  onFill?: (sugestao: SugestaoAnuncio) => void;
};

export function AutoFillTruckButton({ onFill }: Props) {
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [observacoes, setObservacoes] = useState<string[]>([]);

  async function preencherComIaHandler() {
    setMensagem("");
    setObservacoes([]);

    const form = document.querySelector<HTMLFormElement>("form.truck-form");
    if (!form) {
      setMensagem("Não encontrei o formulário do anúncio.");
      return;
    }

    const textoBase = form.elements.namedItem("texto_ia") as HTMLTextAreaElement | null;
    const descricaoAtual = form.elements.namedItem("descricao") as HTMLTextAreaElement | null;
    const texto = (textoBase?.value || descricaoAtual?.value || "").trim();

    if (texto.length < 10) {
      setMensagem("Cole o texto do anúncio (OLX, Facebook, WhatsApp...) antes de usar a IA.");
      return;
    }

    const tipoInput = form.elements.namedItem("tipo_anuncio") as HTMLInputElement | null;
    const tipo_anuncio = tipoInput?.value || "Caminhão";

    setCarregando(true);

    try {
      const sugestao = await preencherComIa(texto, tipo_anuncio);

      if (onFill) {
        onFill(sugestao);
      }

      setObservacoes(sugestao.observacoes || []);
      setMensagem("IA preencheu o que conseguiu identificar. Revise antes de enviar para aprovação.");
    } catch (error: any) {
      console.error(error);
      setMensagem(error.message || "Erro ao consultar a IA. Você ainda pode preencher manualmente.");
    } finally {
      setCarregando(false);
    }
  }


  return (
    <div className="ai-actions-box">
      <button type="button" onClick={preencherComIaHandler} disabled={carregando} className="ai-fill-button">
        {carregando ? "Analisando anúncio..." : "Preencher campos com IA"}
      </button>

      {mensagem && <p className="ai-message">{mensagem}</p>}

      {observacoes.length > 0 && (
        <ul className="ai-observations">
          {observacoes.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .ai-actions-box { display: grid; gap: 10px; }
        .ai-fill-button { min-height: 52px; border: 0; padding: 0 18px; border-radius: 16px; background: #22c55e; color: #052e16; font-weight: 950; cursor: pointer; box-shadow: 0 14px 34px rgba(34,197,94,.18); }
        .ai-fill-button:disabled { opacity: .7; cursor: wait; }
        .ai-message { margin: 0; color: #d9f99d; font-size: 13px; line-height: 1.45; font-weight: 800; }
        .ai-observations { margin: 0; padding-left: 18px; color: #fef08a; font-size: 13px; line-height: 1.45; }
      `}</style>
    </div>
  );
}
