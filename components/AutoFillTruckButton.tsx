"use client";

import { useState } from "react";

type SugestaoAnuncio = {
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

function setField(form: HTMLFormElement, name: string, value?: string) {
  if (!value) return;

  const field = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
  if (!field) return;

  field.value = value;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
}

export function AutoFillTruckButton() {
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
      setMensagem("Cole uma descrição do caminhão antes de usar a IA.");
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

      setField(form, "marca", sugestao.marca);
      setField(form, "modelo", sugestao.modelo);
      setField(form, "ano", sugestao.ano);
      setField(form, "preco", sugestao.preco);
      setField(form, "cidade", sugestao.cidade);
      setField(form, "estado", sugestao.estado);
      setField(form, "carroceria", sugestao.carroceria);
      setField(form, "tracao", sugestao.tracao);
      setField(form, "whatsapp", sugestao.whatsapp);
      setField(form, "descricao", sugestao.descricao);

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
