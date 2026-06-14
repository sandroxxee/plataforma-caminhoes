import Link from "next/link";
import { redirect } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { User, Mail, Shield, LayoutDashboard, Truck, LogOut } from "lucide-react";

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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "anunciante";
  const isAdmin = role === "admin";
  const displayName = getDisplayName(user);
  const initial = displayName.slice(0, 1).toUpperCase();

  const infos = [
    { icon: User,   label: "Nome",         value: displayName },
    { icon: Mail,   label: "E-mail",        value: user.email || "Não encontrado" },
    { icon: Shield, label: "Tipo de conta", value: isAdmin ? "Administrador" : "Anunciante" },
  ];

  return (
    <main className="market-page">
      <PublicHeader />

      <div className="market-container conta-shell">
        {/* Hero */}
        <div className="conta-hero">
          <div className="conta-avatar">{initial}</div>
          <div>
            <span className="conta-badge">
              {isAdmin ? "⚡ Administrador" : "🚛 Anunciante"}
            </span>
            <h1 className="conta-title">Olá, {displayName}</h1>
            <p className="conta-sub">Gerencie seus dados e acesse seu painel.</p>
          </div>
        </div>

        {/* Infos */}
        <div className="conta-card">
          {infos.map(({ icon: Icon, label, value }) => (
            <div key={label} className="conta-row">
              <div className="conta-row-icon">
                <Icon size={15} strokeWidth={2} />
              </div>
              <div className="conta-row-body">
                <span className="conta-row-label">{label}</span>
                <strong className="conta-row-value">{value}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* Ações */}
        <div className="conta-actions">
          {isAdmin
            ? <Link href="/admin" className="conta-btn primary"><LayoutDashboard size={16}/> Admin</Link>
            : <Link href="/painel" className="conta-btn primary"><LayoutDashboard size={16}/> Meu painel</Link>
          }
          <Link href="/anuncios" className="conta-btn secondary"><Truck size={16}/> Ver caminhões</Link>
          <Link href="/logout" className="conta-btn danger"><LogOut size={16}/> Sair</Link>
        </div>

        {isAdmin && (
          <div className="conta-admin-note">
            <Shield size={14} />
            <p>O link administrativo não aparece no menu público. Acesse sempre por esta página.</p>
          </div>
        )}
      </div>

      <SiteFooter />

      <style>{`
        .conta-shell { max-width: 580px; padding-top: 32px; padding-bottom: 60px; }

        .conta-hero {
          display: flex; align-items: center; gap: 18px;
          padding: 24px; border-radius: 20px;
          background: var(--surface); border: 1px solid var(--line);
          box-shadow: var(--shadow); margin-bottom: 14px;
        }
        .conta-avatar {
          width: 64px; height: 64px; border-radius: 18px; flex-shrink: 0;
          background: linear-gradient(135deg, #1877f2, #0ea5e9);
          color: #fff; font-size: 26px; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(24,119,242,.3);
        }
        .conta-badge {
          display: inline-flex; height: 22px; align-items: center;
          padding: 0 10px; border-radius: 999px;
          background: var(--blueSoft); color: var(--blue);
          font-size: 11px; font-weight: 900;
          letter-spacing: .04em; text-transform: uppercase; margin-bottom: 6px;
        }
        .conta-title {
          margin: 0 0 4px; font-size: clamp(20px,3vw,28px);
          font-weight: 900; letter-spacing: -.04em; line-height: 1.1;
        }
        .conta-sub { margin: 0; color: var(--muted); font-size: 14px; font-weight: 700; }

        .conta-card {
          background: var(--surface); border: 1px solid var(--line);
          border-radius: 20px; box-shadow: var(--shadow);
          overflow: hidden; margin-bottom: 14px;
        }
        .conta-row {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 20px; border-bottom: 1px solid var(--line);
        }
        .conta-row:last-child { border-bottom: 0; }
        .conta-row-icon {
          width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
          background: var(--blueSoft); color: var(--blue);
          display: flex; align-items: center; justify-content: center;
        }
        .conta-row-label { font-size: 12px; color: var(--muted); font-weight: 800; display: block; margin-bottom: 2px; }
        .conta-row-value { font-size: 15px; font-weight: 800; color: var(--text); overflow-wrap: anywhere; }

        .conta-actions {
          display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px;
        }
        .conta-btn {
          display: inline-flex; align-items: center; gap: 7px;
          height: 44px; padding: 0 18px; border-radius: 999px;
          font-weight: 900; font-size: 14px; text-decoration: none;
          transition: opacity .15s, transform .15s;
        }
        .conta-btn:hover { opacity: .88; transform: translateY(-1px); }
        .conta-btn.primary { background: var(--blue); color: #fff; }
        .conta-btn.secondary { background: var(--soft); border: 1px solid var(--line); color: var(--text); }
        .conta-btn.danger { background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.24); color: #f87171; }

        .conta-admin-note {
          display: flex; gap: 10px; align-items: flex-start;
          padding: 14px 16px; border-radius: 14px;
          background: var(--blueSoft); border: 1px solid rgba(24,119,242,.2);
          color: var(--blue);
        }
        .conta-admin-note p { margin: 0; font-size: 13px; font-weight: 700; line-height: 1.5; }

        @media (max-width: 600px) {
          .conta-hero { flex-direction: column; text-align: center; padding: 20px; }
          .conta-actions { display: grid; }
          .conta-btn { justify-content: center; }
        }
      `}</style>
    </main>
  );
}
