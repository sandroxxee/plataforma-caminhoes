"use client";

import { useState } from "react";

export type SugestaoAnuncio = {
  marca?: string;
  modelo?: string;
  ano?: string;
  preco?: string;
  cidade?: string;
  estado?: string;
  carroceria?: string;
  tracao?: string;
  whatsapp?: string;
  descricao?: string;
  observacoes?: string[];
};

type Props = {
  onFill?: (sugestao: SugestaoAnuncio) => void;
};

export function AutoFillTruckButton({ onFill }: Props) {
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [observacoes, setObservacoes] = useState<string[]>([]);

  async function preencherComIa() {
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

    setCarregando(true);

    try {
      const response = await fetch("/api/anuncios/preencher-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data?.erro || "Não foi possível preencher o anúncio agora.");
        return;
      }

      const sugestao = (data?.sugestao || {}) as SugestaoAnuncio;

      if (onFill) {
        onFill(sugestao);
      }

      setObservacoes(sugestao.observacoes || []);
      setMensagem("IA preencheu o que conseguiu identificar. Revise antes de enviar para aprovação.");
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao consultar a IA. Você ainda pode preencher manualmente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="ai-actions-box">
      <button type="button" onClick={preencherComIa} disabled={carregando} className="ai-fill-button">
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
        .ai-actions-box {
          display: grid;
          gap: 10px;
        }

        .ai-fill-button {
          min-height: 52px;
          border: 0;
          padding: 0 18px;
          border-radius: 16px;
          background: #22c55e;
          color: #052e16;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 14px 34px rgba(34,197,94,.18);
        }

        .ai-fill-button:disabled {
          opacity: .7;
          cursor: wait;
        }

        .ai-message {
          margin: 0;
          color: #d9f99d;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 800;
        }

        .ai-observations {
          margin: 0;
          padding-left: 18px;
          color: #fef08a;
          font-size: 13px;
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
}
