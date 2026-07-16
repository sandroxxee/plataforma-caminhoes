"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, Check, Loader2 } from "lucide-react";

interface Props {
  initialName: string;
  initialWhatsapp: string;
  initialCidade: string;
  initialEstado: string;
}

function formatarTelefone(value: string) {
  const nums = value.replace(/\D/g, "");
  if (nums.length <= 2) return nums;
  if (nums.length <= 6) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  if (nums.length <= 10) return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`;
}

export function FormPerfil({
  initialName,
  initialWhatsapp,
  initialCidade,
  initialEstado,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initialName);
  const [whatsapp, setWhatsapp] = useState(formatarTelefone(initialWhatsapp));
  const [cidade, setCidade] = useState(initialCidade);
  const [estado, setEstado] = useState(initialEstado);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            name: name.trim(),
            whatsapp: whatsapp.replace(/\D/g, ""),
            cidade: cidade.trim(),
            estado: estado.trim().toUpperCase(),
          },
        });

        if (updateError) {
          setError(updateError.message);
          return;
        }

        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        setError(err?.message || "Ocorreu um erro ao salvar os dados.");
      }
    });
  }

  return (
    <form onSubmit={handleSave} className="perfil-form">
      <h2 className="perfil-section-title">Dados do Perfil</h2>
      <p className="perfil-section-desc">Esses dados serão usados para facilitar o preenchimento dos seus novos anúncios.</p>

      {error && <div className="perfil-error">{error}</div>}
      {success && <div className="perfil-success">✓ Dados atualizados com sucesso!</div>}

      <div className="perfil-fields">
        {/* Nome */}
        <div className="perfil-field">
          <label htmlFor="name-input">
            <User size={14} /> Nome completo
          </label>
          <input
            id="name-input"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            disabled={isPending}
          />
        </div>

        {/* WhatsApp */}
        <div className="perfil-field">
          <label htmlFor="wa-input">
            <Phone size={14} /> WhatsApp Comercial
          </label>
          <input
            id="wa-input"
            type="text"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatarTelefone(e.target.value))}
            placeholder="(49) 99999-9999"
            disabled={isPending}
          />
        </div>

        {/* Localização Grid */}
        <div className="perfil-grid-2">
          <div className="perfil-field">
            <label htmlFor="city-input">
              <MapPin size={14} /> Cidade
            </label>
            <input
              id="city-input"
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex: Xanxerê"
              disabled={isPending}
            />
          </div>

          <div className="perfil-field">
            <label htmlFor="state-input">
              <MapPin size={14} /> Estado (UF)
            </label>
            <input
              id="state-input"
              type="text"
              maxLength={2}
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              placeholder="Ex: SC"
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      <button type="submit" disabled={isPending} className="perfil-save-btn">
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Salvar alterações...
          </>
        ) : (
          <>
            <Check size={16} /> Salvar perfil
          </>
        )}
      </button>

      <style>{`
        .perfil-form {
          margin-top: 18px;
          padding: 24px;
          border-radius: 20px;
          background: var(--surface);
          border: 1px solid var(--line);
          box-shadow: var(--shadow);
        }
        .perfil-section-title {
          margin: 0 0 4px;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -.03em;
        }
        .perfil-section-desc {
          margin: 0 0 20px;
          color: var(--muted);
          font-size: 13.5px;
          font-weight: 750;
        }
        .perfil-error {
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          font-size: 13.5px;
          font-weight: 800;
          margin-bottom: 16px;
        }
        .perfil-success {
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          font-size: 13.5px;
          font-weight: 800;
          margin-bottom: 16px;
        }
        .perfil-fields {
          display: grid;
          gap: 16px;
        }
        .perfil-field {
          display: grid;
          gap: 6px;
        }
        .perfil-field label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 850;
          color: var(--text);
        }
        .perfil-field input {
          height: 48px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid var(--line);
          background: var(--soft);
          color: var(--text);
          font-size: 14.5px;
          font-weight: 800;
          transition: border-color 0.15s;
        }
        .perfil-field input:focus {
          border-color: var(--blue);
          outline: none;
        }
        .perfil-grid-2 {
          display: grid;
          grid-template-columns: 1fr 100px;
          gap: 12px;
        }
        .perfil-save-btn {
          margin-top: 20px;
          width: 100%;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: none;
          border-radius: 14px;
          background: var(--blue);
          color: #fff;
          font-size: 15px;
          font-weight: 950;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
        }
        .perfil-save-btn:hover {
          opacity: 0.92;
        }
        .perfil-save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
          .perfil-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
}
