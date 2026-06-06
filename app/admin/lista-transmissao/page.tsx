import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";

export const dynamic = "force-dynamic";

type Profile = {
  id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  whatsapp: string | null;
  tipo_conta: string | null;
  status: string | null;
  role: string | null;
  created_at?: string | null;
};

function onlyNumbers(value: string | null) {
  return (value || "").replace(/\D/g, "");
}

function formatPhone(value: string | null) {
  const digits = onlyNumbers(value);

  if (!digits) return "Não informado";
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return value || digits;
}

function whatsappLink(profile: Profile) {
  const phone = onlyNumbers(profile.whatsapp || profile.telefone);
  const name = profile.nome || "parceiro";

  if (!phone) return "";

  const message = `Olá ${name}, aqui é do Caminhões à Venda. Você se cadastrou na plataforma e estou entrando em contato para ajudar com anúncios, caminhões ou implementos.`;
  return `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default async function ListaTransmissaoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") redirect("/painel");

  const { data } = await supabase
    .from("profiles")
    .select("id, nome, email, telefone, whatsapp, tipo_conta, status, role, created_at")
    .neq("role", "admin")
    .order("created_at", { ascending: false });

  const profiles = (data || []) as Profile[];
  const contactsWithPhone = profiles.filter((profile) => onlyNumbers(profile.whatsapp || profile.telefone));
  const copyList = contactsWithPhone
    .map((profile) => {
      const phone = onlyNumbers(profile.whatsapp || profile.telefone);
      const name = profile.nome || profile.email || "Cadastro sem nome";
      return `${name} - ${phone}`;
    })
    .join("\n");

  return (
    <AdminLayout
      title="Lista de transmissão"
      subtitle="Veja as pessoas cadastradas no site e abra o WhatsApp individualmente. Não há envio automático em massa."
      badge="Admin"
    >
      <section style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Cadastros</span>
          <strong style={styles.summaryNumber}>{profiles.length}</strong>
        </div>
        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Com WhatsApp/telefone</span>
          <strong style={styles.summaryNumber}>{contactsWithPhone.length}</strong>
        </div>
      </section>

      <section style={styles.copyBox}>
        <h2 style={styles.sectionTitle}>Lista para copiar</h2>
        <p style={styles.helpText}>
          Use esta lista apenas para organizar seus contatos. O contato deve ser manual e responsável, sem disparo automático ou spam.
        </p>
        <textarea readOnly value={copyList || "Nenhum telefone encontrado."} style={styles.textarea} />
      </section>

      <div style={styles.list}>
        {profiles.map((profile) => {
          const waLink = whatsappLink(profile);

          return (
            <article key={profile.id} style={styles.row}>
              <div style={styles.info}>
                <strong style={styles.name}>{profile.nome || "Cadastro sem nome"}</strong>
                <p style={styles.meta}>{profile.email || "E-mail não informado"}</p>
                <p style={styles.meta}>Telefone: {formatPhone(profile.whatsapp || profile.telefone)}</p>
              </div>

              <div style={styles.details}>
                <span style={styles.pill}>{profile.tipo_conta || "conta"}</span>
                <span style={styles.pill}>{profile.status || "status"}</span>
                <span style={styles.date}>Cadastro: {formatDate(profile.created_at)}</span>
              </div>

              {waLink ? (
                <a href={waLink} target="_blank" rel="noopener noreferrer" style={styles.whatsapp}>
                  Chamar no WhatsApp
                </a>
              ) : (
                <span style={styles.noPhone}>Sem WhatsApp</span>
              )}
            </article>
          );
        })}

        {profiles.length === 0 && (
          <div style={styles.empty}>Nenhuma pessoa cadastrada encontrada.</div>
        )}
      </div>
    </AdminLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14, marginBottom: 16 },
  summaryCard: { padding: 18, borderRadius: 18, background: "#1f2327", border: "1px solid #343a40", boxShadow: "0 16px 34px rgba(0,0,0,.18)" },
  summaryLabel: { display: "block", color: "#a7afb7", fontWeight: 850, fontSize: 13 },
  summaryNumber: { display: "block", marginTop: 6, color: "#f4f4f5", fontSize: 34, lineHeight: 1 },
  copyBox: { padding: 18, borderRadius: 18, background: "#1f2327", border: "1px solid #343a40", boxShadow: "0 16px 34px rgba(0,0,0,.18)", marginBottom: 16 },
  sectionTitle: { margin: "0 0 8px", color: "#f4f4f5", fontSize: 20 },
  helpText: { margin: "0 0 12px", color: "#a7afb7", lineHeight: 1.5, fontWeight: 700 },
  textarea: { width: "100%", minHeight: 130, resize: "vertical", borderRadius: 14, border: "1px solid #343a40", background: "#15181b", color: "#e8eaed", padding: 14, fontFamily: "inherit", fontSize: 14, boxSizing: "border-box" },
  list: { display: "grid", gap: 12 },
  row: { display: "grid", gridTemplateColumns: "minmax(260px, 1fr) auto auto", gap: 16, alignItems: "center", padding: 16, borderRadius: 18, background: "#1f2327", border: "1px solid #343a40", boxShadow: "0 16px 34px rgba(0,0,0,.18)" },
  info: { minWidth: 0 },
  name: { display: "block", color: "#f4f4f5", fontSize: 17, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  meta: { margin: "5px 0 0", color: "#a7afb7", lineHeight: 1.35, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  details: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end", alignItems: "center" },
  pill: { padding: "7px 10px", borderRadius: 999, background: "#2a2f34", border: "1px solid #343a40", color: "#cbd5df", fontWeight: 900, fontSize: 12 },
  date: { color: "#a7afb7", fontSize: 13, fontWeight: 800, whiteSpace: "nowrap" },
  whatsapp: { padding: "11px 14px", borderRadius: 13, background: "#22c55e", color: "#06140b", textDecoration: "none", fontWeight: 950, textAlign: "center", whiteSpace: "nowrap" },
  noPhone: { padding: "11px 14px", borderRadius: 13, background: "#2a2f34", color: "#8f99a3", fontWeight: 900, textAlign: "center", whiteSpace: "nowrap" },
  empty: { padding: 24, borderRadius: 18, background: "#1f2327", border: "1px solid #343a40", color: "#a7afb7", fontWeight: 800 },
};
