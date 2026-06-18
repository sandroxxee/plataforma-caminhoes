// Chamado por cron job (Vercel Cron ou cron externo) — ex: a cada hora
// Compara trucks criados nos últimos 60 min com alertas ativos e envia emails
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.ALERTA_FROM_EMAIL || "alertas@caminhoesvenda.com.br";
const SITE = "https://www.caminhoesvenda.com.br";

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
}

function buildEmailHtml(trucks: { titulo: string; preco: number | null; cidade: string; estado: string; id: string }[]) {
  const itens = trucks.map((t) => {
    const preco = t.preco ? `R$${t.preco.toLocaleString("pt-BR")}` : "Preço a consultar";
    const local = [t.cidade, t.estado].filter(Boolean).join(" — ");
    return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e5e7eb">
          <a href="${SITE}/anuncios/${t.id}" style="font-weight:800;font-size:15px;color:#1877f2;text-decoration:none">${t.titulo}</a><br/>
          <span style="color:#6b7280;font-size:13px">${local} · <strong style="color:#1877f2">${preco}</strong></span>
        </td>
      </tr>`;
  }).join("");

  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="font-size:22px;font-weight:900;margin:0 0 4px">🚛 Novos caminhões que combinam com seu alerta</h2>
      <p style="color:#6b7280;margin:0 0 20px">Encontramos ${trucks.length} novo${trucks.length > 1 ? "s" : ""} para você:</p>
      <table style="width:100%;border-collapse:collapse">${itens}</table>
      <p style="margin-top:24px;font-size:12px;color:#9ca3af">
        <a href="${SITE}/anuncios" style="color:#1877f2">Ver todos os anúncios</a> &middot;
        Você recebe este email porque cadastrou um alerta. Para cancelar responda com CANCELAR.
      </p>
    </div>`;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const since = new Date(Date.now() - 65 * 60 * 1000).toISOString();

    const { data: alertas } = await supabase.from("alertas_busca").select("*").eq("ativo", true);
    if (!alertas?.length) return NextResponse.json({ ok: true, sent: 0 });

    const { data: novos } = await supabase
      .from("trucks")
      .select("id, titulo, marca, estado, cidade, preco")
      .eq("status", "aprovado")
      .eq("vendido", false)
      .gte("created_at", since);

    if (!novos?.length) return NextResponse.json({ ok: true, sent: 0 });

    let sent = 0;
    for (const alerta of alertas) {
      const matches = novos.filter((t) => {
        if (alerta.marca && t.marca?.toLowerCase() !== alerta.marca.toLowerCase()) return false;
        if (alerta.estado && t.estado?.toUpperCase() !== alerta.estado.toUpperCase()) return false;
        if (alerta.preco_max && t.preco && t.preco > alerta.preco_max) return false;
        if (alerta.termo && !t.titulo?.toLowerCase().includes(alerta.termo.toLowerCase())) return false;
        return true;
      });

      if (matches.length > 0) {
        await sendEmail(
          alerta.email,
          `🚛 ${matches.length} novo${matches.length > 1 ? "s caminhões" : " caminhão"} para você`,
          buildEmailHtml(matches)
        );
        sent++;
      }
    }

    return NextResponse.json({ ok: true, sent });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
