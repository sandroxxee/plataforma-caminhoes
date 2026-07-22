"use client";

import { Building2, MapPin, Phone, ShieldCheck, Star, MessageSquare } from "lucide-react";

interface StorefrontHeaderProps {
  revenda: {
    nome_fantasia: string;
    razao_social?: string | null;
    cnpj?: string | null;
    logo_url?: string | null;
    banner_url?: string | null;
    cidade?: string | null;
    estado?: string | null;
    telefone?: string | null;
    whatsapp?: string | null;
    selo_verificado?: boolean;
  };
  totalAnuncios: number;
  mediaNota: number;
  totalAvaliacoes: number;
}

export function StorefrontHeader({ revenda, totalAnuncios, mediaNota, totalAvaliacoes }: StorefrontHeaderProps) {
  const whatsappUrl = revenda.whatsapp
    ? `https://wa.me/55${revenda.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá! Vi a loja de vocês na plataforma Caminhões à Venda e gostaria de ver o estoque.`)}`
    : null;

  return (
    <div style={{ borderRadius: 20, overflow: "hidden", background: "var(--surface)", border: "1px solid var(--line)", marginBottom: 24, boxShadow: "var(--shadow)" }}>
      {/* BANNER DE TOPO */}
      <div
        style={{
          height: 180,
          background: revenda.banner_url ? `url(${revenda.banner_url}) center/cover no-repeat` : "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e40af 100%)",
          position: "relative",
        }}
      />

      {/* CONTEÚDO DA LOJA */}
      <div style={{ padding: "0 24px 24px", position: "relative" }}>
        
        {/* LOGO DA LOJA */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginTop: -40, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 20,
                background: "#ffffff",
                border: "4px solid var(--surface)",
                boxShadow: "var(--shadow2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {revenda.logo_url ? (
                <img src={revenda.logo_url} alt={revenda.nome_fantasia} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Building2 size={36} color="var(--blue)" />
              )}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text)", margin: 0 }}>{revenda.nome_fantasia}</h1>
                {revenda.selo_verificado && (
                  <span className="admin-badge" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", gap: 4, padding: "4px 10px", fontSize: 11 }}>
                    <ShieldCheck size={14} /> Loja Verificada
                  </span>
                )}
              </div>
              {revenda.razao_social && (
                <span style={{ fontSize: 12, color: "var(--muted)", display: "block", marginTop: 2 }}>{revenda.razao_social}</span>
              )}
            </div>
          </div>

          {/* BOTÃO WHATSAPP DA REVENDEDORA */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#25d366",
                color: "#ffffff",
                padding: "12px 20px",
                borderRadius: 12,
                fontWeight: 800,
                fontSize: 14,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 12px rgba(37,211,102,0.25)",
              }}
            >
              <MessageSquare size={18} /> Falar com a Loja
            </a>
          )}
        </div>

        {/* INFORMAÇÕES DE CONTATO E MÉTRICAS */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", paddingTop: 12, borderTop: "1px solid var(--line)", fontSize: 13, color: "var(--muted)" }}>
          {(revenda.cidade || revenda.estado) && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={16} color="var(--blue)" />
              <span>{revenda.cidade ? `${revenda.cidade} - ${revenda.estado || ""}` : revenda.estado}</span>
            </div>
          )}

          {revenda.telefone && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={16} color="var(--blue)" />
              <span>{revenda.telefone}</span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Star size={16} color="#f59e0b" fill="#f59e0b" />
            <strong style={{ color: "var(--text)" }}>{mediaNota}</strong>
            <span>({totalAvaliacoes} avaliações)</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <strong style={{ color: "var(--blue)", fontSize: 14 }}>{totalAnuncios}</strong>
            <span>veículos em estoque</span>
          </div>
        </div>

      </div>
    </div>
  );
}
