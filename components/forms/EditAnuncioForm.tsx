"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, MapPin, Camera, Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import { MARCAS_VALIDAS, ESTADOS_VALIDOS, CARROCERIAS, TRACOES } from "@/lib/constants";
import { editarAnuncioAction } from "@/app/painel/anuncios/[id]/actions";

type TruckData = {
  id: string;
  marca: string | null;
  modelo: string | null;
  ano_modelo: number | null;
  preco: number | null;
  quilometragem: string | null;
  cidade: string | null;
  estado: string | null;
  carroceria: string | null;
  tracao: string | null;
  whatsapp: string | null;
  descricao: string | null;
  status: string | null;
  abaixo_fipe: boolean | null;
};

type Props = {
  truck: TruckData;
  isAdmin: boolean;
};

export function EditAnuncioForm({ truck, isAdmin }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await editarAnuncioAction(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push(isAdmin ? "/admin/anuncios" : "/painel/anuncios");
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar as alterações. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="edit-form-container">
      <style>{`
        .edit-form-card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid rgba(148,163,184,0.15);
          box-shadow: 0 4px 20px rgba(15,23,42,0.04);
          padding: 32px;
          transition: all 0.3s ease;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; }
        }
        .form-field { display: flex; flex-direction: column; gap: 8px; }
        .form-label {
          font-size: 13px;
          font-weight: 800;
          color: #475569;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%;
          min-height: 48px;
          padding: 0 16px;
          border-radius: 14px;
          border: 1px solid rgba(148,163,184,0.2);
          background: #f8fafc;
          color: #0f172a;
          font-size: 15px;
          font-weight: 600;
          outline: none;
          transition: all 0.2s ease;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--blue);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(24,119,242,0.1);
        }
        .form-textarea { padding: 16px; min-height: 120px; resize: vertical; }

        .upload-section {
          grid-column: 1 / -1;
          background: #f1f5f9;
          padding: 24px;
          border-radius: 20px;
          border: 1px dashed rgba(148,163,184,0.4);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .upload-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .file-input-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .file-input-wrap { grid-template-columns: 1fr; } }

        .fipe-toggle {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(37,99,235,0.05);
          border: 1px solid rgba(37,99,235,0.1);
          border-radius: 16px;
          cursor: pointer;
        }
        .fipe-checkbox {
          width: 22px;
          height: 22px;
          accent-color: var(--blue);
          cursor: pointer;
        }
        .fipe-text { display: flex; flex-direction: column; }
        .fipe-label { font-weight: 800; color: #0f172a; font-size: 14px; }
        .fipe-desc { font-size: 12px; color: #64748b; font-weight: 600; }

        .form-actions {
          margin-top: 32px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
        }
        .btn-save {
          height: 52px;
          padding: 0 32px;
          border-radius: 16px;
          background: var(--blue);
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(24,119,242,0.25);
        }
        .btn-save:hover { background: var(--blue2); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(24,119,242,0.3); }
        .btn-save:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .btn-cancel {
          height: 52px;
          padding: 0 24px;
          border-radius: 16px;
          background: transparent;
          border: 1px solid rgba(148,163,184,0.2);
          color: #475569;
          font-weight: 700;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-cancel:hover { background: #f8fafc; border-color: #64748b; color: #0f172a; }

        .success-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        .success-card {
          text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .success-icon { color: #22c55e; animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      {success && (
        <div className="success-overlay">
          <div className="success-card">
            <CheckCircle2 size={80} className="success-icon" />
            <h2 style={{ fontSize: 28, fontWeight: 800 }}>Anúncio Atualizado!</h2>
            <p style={{ color: "#64748b", fontWeight: 600 }}>As alterações foram salvas com sucesso. Redirecionando...</p>
          </div>
        </div>
      )}

      <form action={handleSubmit} className="edit-form-card">
        <input type="hidden" name="id" value={truck.id} />

        <div className="form-grid">
          {/* MARCA */}
          <div className="form-field">
            <label className="form-label">Marca *</label>
            <select className="form-select" name="marca" defaultValue={truck.marca || ""} required>
              <option value="" disabled>Selecione a marca</option>
              {MARCAS_VALIDAS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* MODELO */}
          <div className="form-field">
            <label className="form-label">Modelo *</label>
            <input className="form-input" name="modelo" defaultValue={truck.modelo || ""} placeholder="Ex: R 450" required />
          </div>

          {/* ANO */}
          <div className="form-field">
            <label className="form-label">Ano Modelo *</label>
            <input className="form-input" name="ano" type="number" defaultValue={truck.ano_modelo || ""} placeholder="Ex: 2021" required />
          </div>

          {/* PREÇO */}
          <div className="form-field">
            <label className="form-label">Preço (R$) *</label>
            <input className="form-input" name="preco" type="number" defaultValue={truck.preco || ""} placeholder="Ex: 450000" required />
          </div>

          {/* QUILOMETRAGEM */}
          <div className="form-field">
            <label className="form-label">Quilometragem</label>
            <input className="form-input" name="quilometragem" type="number" defaultValue={truck.quilometragem || ""} placeholder="Ex: 520000" />
          </div>

          {/* CIDADE */}
          <div className="form-field">
            <label className="form-label">Cidade</label>
            <input className="form-input" name="cidade" defaultValue={truck.cidade || ""} placeholder="Ex: Curitiba" />
          </div>

          {/* ESTADO */}
          <div className="form-field">
            <label className="form-label">Estado *</label>
            <select className="form-select" name="estado" defaultValue={truck.estado || ""} required>
              <option value="" disabled>Selecione o estado</option>
              {ESTADOS_VALIDOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </div>

          {/* CARROCERIA */}
          <div className="form-field">
            <label className="form-label">Carroceria *</label>
            <select className="form-select" name="carroceria" defaultValue={truck.carroceria || ""} required>
              <option value="" disabled>Selecione a carroceria</option>
              {CARROCERIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* TRAÇÃO */}
          <div className="form-field">
            <label className="form-label">Tração *</label>
            <select className="form-select" name="tracao" defaultValue={truck.tracao || ""} required>
              <option value="" disabled>Selecione a tração</option>
              {TRACOES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* WHATSAPP */}
          <div className="form-field">
            <label className="form-label">WhatsApp de Contato *</label>
            <input className="form-input" name="whatsapp" defaultValue={truck.whatsapp || ""} placeholder="Ex: 41999999999" required />
          </div>

          {/* STATUS (ADMIN ONLY) */}
          {isAdmin && (
            <div className="form-field">
              <label className="form-label" style={{ color: 'var(--blue)' }}>Status do Anúncio (Admin)</label>
              <select className="form-select" name="status" defaultValue={truck.status || "pendente"} style={{ borderColor: 'var(--blueSoft)' }}>
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="reprovado">Reprovado</option>
              </select>
            </div>
          )}

          {/* ABAIXO DA FIPE */}
          <label className="fipe-toggle">
            <input
              type="checkbox"
              name="abaixo_fipe"
              className="fipe-checkbox"
              value="true"
              defaultChecked={!!truck.abaixo_fipe}
            />
            <div className="fipe-text">
              <span className="fipe-label">Oportunidade: Abaixo da FIPE</span>
              <span className="fipe-desc">Marque se o valor está realmente abaixo do mercado para ganhar destaque.</span>
            </div>
          </label>

          {/* DESCRIÇÃO */}
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Descrição do Anúncio</label>
            <textarea
              className="form-textarea"
              name="descricao"
              defaultValue={truck.descricao || ""}
              placeholder="Detalhes sobre manutenção, revisões, pneus, etc..."
            />
          </div>

          {/* UPLOAD DE FOTOS */}
          <div className="upload-section">
            <span className="upload-title"><Camera size={20} /> Adicionar novas fotos</span>
            <p className="fipe-desc" style={{ marginTop: -8 }}>As fotos atuais serão mantidas. Use estes campos apenas se quiser enviar NOVAS fotos.</p>

            <div className="file-input-wrap">
              <div className="form-field">
                <label className="form-label" style={{ fontSize: 11 }}>Nova Foto Principal</label>
                <input className="form-input" style={{ padding: '10px' }} name="foto_principal" type="file" accept="image/*" />
              </div>
              <div className="form-field">
                <label className="form-label" style={{ fontSize: 11 }}>Novas Fotos Extras (até 8)</label>
                <input className="form-input" style={{ padding: '10px' }} name="fotos_extras" type="file" accept="image/*" multiple />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-cancel"
            disabled={isSubmitting}
          >
            <ArrowLeft size={18} /> Cancelar
          </button>
          <button
            type="submit"
            className="btn-save"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : <><Save size={18} /> Salvar Alterações</>}
          </button>
        </div>
      </form>
    </div>
  );
}
