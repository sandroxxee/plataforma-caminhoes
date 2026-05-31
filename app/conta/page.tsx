import Link from "next/link";
import { redirect } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getDisplayName(user: { email?: string | null; user_metadata?: Record<string, unknown> } | null) {
  if (!user) return "";

  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "";

  if (metadataName.trim()) return metadataName.trim();

  const email = user.email || "";
  return email ? email.split("@")[0] : "Minha conta";
}

export default async function ContaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "anunciante";
  const isAdmin = role === "admin";
  const displayName = getDisplayName(user);

  return (
    <main className="account-page">
      <PublicHeader />

      <section className="wrap account-hero">
        <div>
          <span className="mini">Conta logada</span>
          <h1>Você está conectado como {displayName}.</h1>
          <p>Confirme qual conta está ativa antes de criar anúncio, aprovar anúncios ou sair do sistema.</p>
        </div>
      </section>

      <section className="wrap account-card">
        <div className="avatar">{displayName.slice(0, 1).toUpperCase()}</div>

        <div className="account-info">
          <span>Nome / identificação</span>
          <strong>{displayName}</strong>
        </div>

        <div className="account-info">
          <span>E-mail</span>
          <strong>{user.email || "E-mail não encontrado"}</strong>
        </div>

        <div className="account-info">
          <span>Tipo de conta</span>
          <strong>{isAdmin ? "Administrador" : "Anunciante / usuário normal"}</strong>
        </div>
      </section>

      <section className="wrap account-actions">
        {!isAdmin && <Link href="/painel" className="primary">Ir para meu painel</Link>}
        {isAdmin && <Link href="/admin/pendentes" className="primary">Ir para admin</Link>}
        <Link href="/anuncios">Ver estoque</Link>
        <Link href="/logout" className="danger">Sair da conta</Link>
      </section>

      {isAdmin && (
        <section className="wrap admin-note">
          <strong>Admin protegido</strong>
          <p>O link do painel administrativo não aparece no menu público. O acesso deve ser feito pela área administrativa.</p>
        </section>
      )}

      <style>{`
        .account-page{min-height:100vh;color:var(--site-text);background:radial-gradient(circle at 82% -12%,color-mix(in srgb,var(--site-green) 18%,transparent),transparent 34%),radial-gradient(circle at 8% 4%,color-mix(in srgb,var(--site-gold) 10%,transparent),transparent 27%),linear-gradient(180deg,var(--site-bg),var(--site-bg-2));overflow-x:hidden;padding-bottom:48px}.wrap{width:min(860px,calc(100vw - 32px));margin:0 auto}.mini{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 28%,transparent);color:var(--site-green);font-size:12px;font-weight:950;letter-spacing:.06em;text-transform:uppercase}.account-hero{margin-top:10px;padding:30px;border-radius:30px;background:linear-gradient(115deg,var(--site-surface),color-mix(in srgb,var(--site-surface) 70%,transparent)),radial-gradient(circle at 82% 18%,color-mix(in srgb,var(--site-green) 22%,transparent),transparent 28%);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft)}.account-hero h1{margin:14px 0 10px;font-size:clamp(34px,5vw,56px);line-height:1;letter-spacing:-.055em}.account-hero p{margin:0;color:var(--site-muted);font-size:17px;line-height:1.6}.account-card,.account-actions,.admin-note{background:var(--site-surface);border:1px solid var(--site-line);border-radius:26px;box-shadow:var(--site-shadow-soft)}.account-card{margin-top:16px;padding:24px;display:grid;grid-template-columns:78px 1fr;gap:16px;align-items:center}.avatar{width:70px;height:70px;border-radius:22px;display:grid;place-items:center;background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;font-size:32px;font-weight:950}.account-info{grid-column:2;display:grid;gap:5px;padding:12px 0;border-bottom:1px solid var(--site-line)}.account-info:last-child{border-bottom:0}.account-info span{color:var(--site-muted);font-size:13px;font-weight:900}.account-info strong{color:var(--site-text);font-size:19px;overflow-wrap:anywhere}.account-actions{margin-top:16px;padding:14px;display:flex;gap:10px;flex-wrap:wrap}.account-actions a{min-height:48px;padding:0 18px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;color:var(--site-text);text-decoration:none;font-weight:950;background:var(--site-surface-2);border:1px solid var(--site-line)}.account-actions .primary{background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;border-color:transparent}.account-actions .danger{background:rgba(239,68,68,.12);color:#fecaca;border-color:rgba(239,68,68,.24)}.admin-note{margin-top:16px;padding:20px}.admin-note strong{color:var(--site-green);display:block;margin-bottom:8px}.admin-note p{color:var(--site-muted);margin:0;line-height:1.55}@media(max-width:620px){.wrap{width:calc(100vw - 24px)}.account-hero{padding:22px;border-radius:24px}.account-hero h1{font-size:34px}.account-card{grid-template-columns:1fr}.account-info{grid-column:1}.account-actions{display:grid}.account-actions a{width:100%}}
      `}</style>
    </main>
  );
}
