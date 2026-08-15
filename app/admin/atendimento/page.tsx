import { redirect } from "next/navigation";
import { ExternalLink, MessageCircle, ShieldCheck, Users } from "lucide-react";
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
  created_at: string | null;
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
  if (!phone) return "";
  const name = profile.nome || "tudo bem";
  const message = `Olá ${name}! Aqui é do Caminhões à Venda. Estou entrando em contato para ajudar com anúncios, caminhões ou implementos.`;
  return `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

export default async function AtendimentoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (adminProfile?.role !== "admin") redirect("/painel");

  const { data } = await supabase
    .from("profiles")
    .select("id, nome, email, telefone, whatsapp, tipo_conta, status, created_at")
    .neq("role", "admin")
    .order("created_at", { ascending: false });
  const profiles = (data || []) as Profile[];
  const contacts = profiles.filter((profile) => onlyNumbers(profile.whatsapp || profile.telefone));

  return (
    <AdminLayout
      title="Central de Atendimento"
      subtitle="Organize contatos reais da plataforma e abra uma conversa individual no WhatsApp. Nenhuma mensagem é enviada automaticamente."
      badge="Atendimento manual"
      actions={<a href="https://leadrecai-chimbqhv.manus.space/#inbox" target="_blank" rel="noreferrer" className="admin-btn admin-btn-approve" style={{ textDecoration: "none" }}><ExternalLink size={16} /> Abrir Central LeadflowAI</a>}
    >
      <section className="transmissao-summary-grid">
        <div className="transmissao-summary-card"><span className="transmissao-summary-label"><Users size={14} /> Cadastros</span><strong className="transmissao-summary-number">{profiles.length}</strong></div>
        <div className="transmissao-summary-card"><span className="transmissao-summary-label"><MessageCircle size={14} /> Com WhatsApp</span><strong className="transmissao-summary-number">{contacts.length}</strong></div>
        <div className="transmissao-summary-card"><span className="transmissao-summary-label"><ShieldCheck size={14} /> Regra de envio</span><strong className="transmissao-summary-number" style={{ fontSize: 16 }}>Manual</strong></div>
      </section>

      <section className="transmissao-copy-box">
        <h2 className="transmissao-section-title">Como usar agora</h2>
        <p className="transmissao-help-text">Escolha um cadastro, clique em <strong>Chamar no WhatsApp</strong> e revise a mensagem antes de enviar. A Central LeadflowAI abre em outra aba para você testar rascunhos, alertas e respostas rápidas quando sua instância Evolution estiver vinculada. A API oficial da Meta não é necessária para esta operação manual.</p>
      </section>

      <section className="transmissao-list">
        {profiles.map((profile) => {
          const waLink = whatsappLink(profile);
          return <article key={profile.id} className="transmissao-row"><div className="transmissao-info"><strong className="transmissao-name">{profile.nome || "Cadastro sem nome"}</strong><p className="transmissao-meta">{profile.email || "E-mail não informado"}</p><p className="transmissao-meta">WhatsApp: {formatPhone(profile.whatsapp || profile.telefone)}</p></div><div className="transmissao-details"><span className="transmissao-pill">{profile.tipo_conta || "conta"}</span><span className="transmissao-pill">{profile.status || "status"}</span><span className="transmissao-date">Cadastro: {formatDate(profile.created_at)}</span></div>{waLink ? <a href={waLink} target="_blank" rel="noopener noreferrer" className="transmissao-whatsapp">Chamar no WhatsApp</a> : <span className="transmissao-nophone">Sem WhatsApp</span>}</article>;
        })}
        {profiles.length === 0 && <div className="admin-empty">Nenhum cadastro encontrado.</div>}
      </section>
    </AdminLayout>
  );
}
