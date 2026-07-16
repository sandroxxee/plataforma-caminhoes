import { redirect } from "next/navigation";
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
      <section className="transmissao-summary-grid">
        <div className="transmissao-summary-card">
          <span className="transmissao-summary-label">Cadastros</span>
          <strong className="transmissao-summary-number">{profiles.length}</strong>
        </div>
        <div className="transmissao-summary-card">
          <span className="transmissao-summary-label">Com WhatsApp/telefone</span>
          <strong className="transmissao-summary-number">{contactsWithPhone.length}</strong>
        </div>
      </section>

      <section className="transmissao-copy-box">
        <h2 className="transmissao-section-title">Lista para copiar</h2>
        <p className="transmissao-help-text">
          Use esta lista apenas para organizar seus contatos. O contato deve ser manual e responsável, sem disparo automático ou spam.
        </p>
        <textarea readOnly value={copyList || "Nenhum telefone encontrado."} className="transmissao-textarea" />
      </section>

      <div className="transmissao-list">
        {profiles.map((profile) => {
          const waLink = whatsappLink(profile);

          return (
            <article key={profile.id} className="transmissao-row">
              <div className="transmissao-info">
                <strong className="transmissao-name">{profile.nome || "Cadastro sem nome"}</strong>
                <p className="transmissao-meta">{profile.email || "E-mail não informado"}</p>
                <p className="transmissao-meta">Telefone: {formatPhone(profile.whatsapp || profile.telefone)}</p>
              </div>

              <div className="transmissao-details">
                <span className="transmissao-pill">{profile.tipo_conta || "conta"}</span>
                <span className="transmissao-pill">{profile.status || "status"}</span>
                <span className="transmissao-date">Cadastro: {formatDate(profile.created_at)}</span>
              </div>

              {waLink ? (
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="transmissao-whatsapp">
                  Chamar no WhatsApp
                </a>
              ) : (
                <span className="transmissao-nophone">Sem WhatsApp</span>
              )}
            </article>
          );
        })}

        {profiles.length === 0 && (
          <div className="admin-empty">Nenhuma pessoa cadastrada encontrada.</div>
        )}
      </div>
    </AdminLayout>
  );
}
