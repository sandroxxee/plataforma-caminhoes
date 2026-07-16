"use client";

import { useState } from "react";
import { Link2, Loader2, X, CheckCircle, AlertCircle } from "lucide-react";
import { importarDaOlx, DadosImportadosOLX } from "@/services/olxService";

type Props = {
  onImportar: (dados: DadosImportadosOLX) => void;
};

export function ImportarOLX({ onImportar }: Props) {
  const [aberto, setAberto] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [preview, setPreview] = useState<DadosImportadosOLX | null>(null);

  async function handleImportar() {
    if (!url.trim()) {
      setErro("Cole o link do anúncio da OLX.");
      return;
    }

    setLoading(true);
    setErro("");
    setPreview(null);

    try {
      const data = await importarDaOlx(url);
      setPreview(data);
    } catch (err: any) {
      setErro(err.message || "Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }


  function handleConfirmar() {
    if (preview) {
      onImportar(preview);
      setAberto(false);
      setUrl("");
      setPreview(null);
    }
  }

  return (
    <>
      {/* Botão para abrir */}
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="importar-btn"
      >
        <Link2 size={16} />
        Importar da OLX
      </button>

      {/* Modal */}
      {aberto && (
        <div className="importar-overlay" onClick={() => setAberto(false)}>
          <div className="importar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="importar-header">
              <h3>📋 Importar anúncio da OLX</h3>
              <button onClick={() => setAberto(false)} className="importar-close">
                <X size={18} />
              </button>
            </div>

            <p className="importar-desc">
              Cole o link do seu anúncio na OLX e importamos tudo automaticamente:
              fotos, descrição, preço e localização.
            </p>

            <div className="importar-input-row">
              <input
                type="url"
                placeholder="https://www.olx.com.br/item/..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setErro("");
                }}
                className="importar-input"
                onKeyDown={(e) => e.key === "Enter" && handleImportar()}
              />
              <button
                type="button"
                onClick={handleImportar}
                disabled={loading}
                className="importar-buscar-btn"
              >
                {loading ? <Loader2 size={16} className="spin" /> : "Buscar"}
              </button>
            </div>

            {erro && (
              <div className="importar-erro">
                <AlertCircle size={16} />
                {erro}
              </div>
            )}

            {/* Preview dos dados encontrados */}
            {preview && (
              <div className="importar-preview">
                <div className="importar-preview-header">
                  <CheckCircle size={18} className="check-icon" />
                  <span>Dados encontrados!</span>
                </div>

                {preview.imagens.length > 0 && (
                  <div className="importar-fotos">
                    {preview.imagens.slice(0, 4).map((img, i) => (
                      <img key={i} src={img} alt={`Foto ${i + 1}`} className="importar-foto" />
                    ))}
                    {preview.imagens.length > 4 && (
                      <div className="importar-foto-mais">+{preview.imagens.length - 4}</div>
                    )}
                  </div>
                )}

                <div className="importar-dados">
                  <div className="dado-row">
                    <span className="dado-label">Título</span>
                    <span className="dado-valor">{preview.titulo || "—"}</span>
                  </div>
                  <div className="dado-row">
                    <span className="dado-label">Preço</span>
                    <span className="dado-valor">
                      {preview.preco
                        ? `R$ ${preview.preco.toLocaleString("pt-BR")}`
                        : "Não informado"}
                    </span>
                  </div>
                  <div className="dado-row">
                    <span className="dado-label">Local</span>
                    <span className="dado-valor">
                      {[preview.cidade, preview.estado].filter(Boolean).join(", ") || "—"}
                    </span>
                  </div>
                  <div className="dado-row">
                    <span className="dado-label">Fotos</span>
                    <span className="dado-valor">{preview.imagens.length} foto(s)</span>
                  </div>
                  {preview.descricao && (
                    <div className="dado-row dado-row--desc">
                      <span className="dado-label">Descrição</span>
                      <span className="dado-valor dado-desc">
                        {preview.descricao.slice(0, 200)}
                        {preview.descricao.length > 200 ? "..." : ""}
                      </span>
                    </div>
                  )}
                </div>

                <div className="importar-acoes">
                  <button
                    type="button"
                    onClick={() => setPreview(null)}
                    className="importar-cancelar"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmar}
                    className="importar-confirmar"
                  >
                    ✅ Usar esses dados
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .importar-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #f0f7ff;
          border: 1.5px solid #3b82f6;
          color: #2563eb;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .importar-btn:hover { background: #dbeafe; }

        .importar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .importar-modal {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .importar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .importar-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .importar-close {
          background: #f3f4f6;
          border: none;
          border-radius: 6px;
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .importar-desc {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 16px;
        }

        .importar-input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .importar-input {
          flex: 1;
          height: 42px;
          padding: 0 12px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
        }
        .importar-input:focus { border-color: #3b82f6; }

        .importar-buscar-btn {
          height: 42px;
          padding: 0 16px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s;
        }
        .importar-buscar-btn:hover:not(:disabled) { background: #1d4ed8; }
        .importar-buscar-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .importar-erro {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .importar-preview {
          border: 1.5px solid #d1fae5;
          border-radius: 12px;
          padding: 16px;
          background: #f0fdf4;
        }

        .importar-preview-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #16a34a;
          margin-bottom: 12px;
        }

        .check-icon { color: #16a34a; }

        .importar-fotos {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .importar-foto {
          width: 72px;
          height: 56px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .importar-foto-mais {
          width: 72px;
          height: 56px;
          background: #e5e7eb;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #6b7280;
        }

        .importar-dados {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .dado-row {
          display: flex;
          gap: 8px;
          font-size: 14px;
          align-items: flex-start;
        }

        .dado-label {
          min-width: 72px;
          font-weight: 700;
          color: #6b7280;
        }

        .dado-valor { color: #111827; font-weight: 500; }

        .dado-desc {
          color: #374151;
          font-size: 13px;
          line-height: 1.5;
        }

        .importar-acoes {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .importar-cancelar {
          padding: 9px 16px;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          color: #374151;
        }
        .importar-cancelar:hover { background: #e5e7eb; }

        .importar-confirmar {
          padding: 9px 18px;
          background: #16a34a;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .importar-confirmar:hover { background: #15803d; }

        @media (max-width: 480px) {
          .importar-modal { padding: 16px; }
          .importar-input-row { flex-direction: column; }
          .importar-buscar-btn { justify-content: center; }
        }
      `}</style>
    </>
  );
}
