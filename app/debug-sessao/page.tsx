import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DebugSessaoPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const testedAt = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  const isLoggedIn = Boolean(user);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        background: "#f6f7f9",
        color: "#111827",
      }}
    >
      <section
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: isLoggedIn ? "#047857" : "#b91c1c",
          }}
        >
          Debug temporário de sessão
        </p>

        <h1 style={{ margin: "0 0 20px", fontSize: "28px" }}>
          Sessão Supabase
        </h1>

        <div style={{ display: "grid", gap: "12px" }}>
          <DebugRow label="Status" value={isLoggedIn ? "logado" : "deslogado"} />
          <DebugRow label="User ID" value={user?.id || "sem usuário"} />
          <DebugRow label="E-mail" value={user?.email || "sem e-mail"} />
          <DebugRow label="Horário do teste" value={testedAt} />
          <DebugRow label="Erro Supabase" value={error?.message || "sem erro"} />
        </div>

        <p style={{ marginTop: "20px", color: "#4b5563", lineHeight: 1.6 }}>
          Use esta página apenas para confirmar se a sessão continua ativa depois de navegar
          entre painel e páginas públicas.
        </p>
      </section>
    </main>
  );
}

function DebugRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "4px",
        padding: "12px 14px",
        borderRadius: "12px",
        background: "#f9fafb",
        border: "1px solid #eef2f7",
      }}
    >
      <strong style={{ fontSize: "13px", color: "#374151" }}>{label}</strong>
      <span style={{ fontSize: "15px", wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}
