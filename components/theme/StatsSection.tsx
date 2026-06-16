export function StatsSection() {
  const stats = [
    { value: "1.200+", label: "Caminhões anunciados" },
    { value: "800+",   label: "Vendedores ativos" },
    { value: "3.500+", label: "Compradores cadastrados" },
    { value: "98%",    label: "Anúncios com WhatsApp" },
  ];

  return (
    <section className="market-container stats-section">
      <div className="stats-grid">
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
          grid-template-columns: repeat(4, 1fr);
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
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-value { font-size: 26px; }
        }
        @media (max-width: 420px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .stats-card { padding: 20px 10px; border-radius: 14px; }
          .stats-value { font-size: 22px; }
          .stats-label { font-size: 11px; }
        }
      `}</style>
    </section>
  );
}
