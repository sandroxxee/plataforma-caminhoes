import { createClient } from "@/lib/supabase/server";

export async function StatsSection() {
  const supabase = await createClient();

  // Busca contagens reais do banco
  const [{ count: totalAnuncios }, { count: totalVendedores }] = await Promise.all([
    supabase
      .from("trucks")
      .select("*", { count: "exact", head: true })
      .eq("status", "aprovado")
      .eq("vendido", false),
    supabase
      .from("trucks")
      .select("user_id", { count: "exact", head: true })
      .eq("status", "aprovado"),
  ]);

  const anuncios  = totalAnuncios  ?? 0;
  const vendedores = totalVendedores ?? 0;

  // Só mostra a seção se tiver conteúdo real
  if (anuncios === 0) return null;

  const stats = [
    { value: `${anuncios}`,   label: anuncios === 1 ? "Caminhão disponível" : "Caminhões disponíveis" },
    { value: `${vendedores}`, label: vendedores === 1 ? "Anúncio publicado" : "Anúncios publicados" },
  ];

  return (
    <section className="market-container stats-section">
      <div className="stats-grid" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
        {stats.map((s) => (
          <div key={s.label} className="stats-card">
            <span className="stats-value">{s.value}</span>
            <span className="stats-label">{s.label}</span>
          </div>
        ))}
      </div>
      <style>{`
        .stats-section { padding-top: 0; padding-bottom: 0; }
        .stats-grid {
          display: grid;
          gap: 16px;
        }
        .stats-card {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 6px;
          padding: 28px 16px;
          background: var(--surface);
          border: 1.5px solid var(--line);
          border-radius: 20px;
          box-shadow: var(--shadow);
          text-align: center;
          transition: transform .2s, box-shadow .2s;
        }
        .stats-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow2);
        }
        .stats-value {
          font-size: 32px; font-weight: 900;
          color: var(--blue);
          letter-spacing: -.03em;
          line-height: 1;
        }
        .stats-label {
          font-size: 13px; font-weight: 700;
          color: var(--muted);
          letter-spacing: .01em;
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-value { font-size: 26px; }
        }
        @media (max-width: 420px) {
          .stats-grid { gap: 10px; }
          .stats-card { padding: 20px 10px; border-radius: 14px; }
          .stats-value { font-size: 22px; }
          .stats-label { font-size: 11px; }
        }
      `}</style>
    </section>
  );
}
