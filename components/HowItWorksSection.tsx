export function HowItWorksSection() {
  const steps = [
    {
      icon: "🔍",
      title: "Busque",
      desc: "Filtre por marca, modelo, ano, tração e localidade. Resultados em segundos.",
    },
    {
      icon: "📋",
      title: "Compare",
      desc: "Veja fotos, ficha técnica completa e histórico do veículo antes de decidir.",
    },
    {
      icon: "💬",
      title: "Negocie",
      desc: "Fale diretamente com o vendedor pelo WhatsApp. Sem intermediários.",
    },
    {
      icon: "🤝",
      title: "Feche",
      desc: "Acerte os detalhes, confirme documentação e finalize com segurança.",
    },
  ];

  return (
    <section className="how-section">
      <div className="how-header">
        <span className="how-eyebrow">Como funciona</span>
        <h2 className="how-title">Simples assim</h2>
      </div>
      <div className="how-grid">
        {steps.map((step, i) => (
          <div key={step.title} className="how-card">
            <span className="how-step" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className="how-icon" aria-hidden="true">{step.icon}</span>
            <strong className="how-card-title">{step.title}</strong>
            <p className="how-card-desc">{step.desc}</p>
          </div>
        ))}
      </div>
      <style>{`
        .how-section {
          padding: 40px 0 8px;
        }
        .how-header {
          display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px;
        }
        .how-eyebrow {
          display: inline-flex; height: 24px; align-items: center;
          padding: 0 10px; border-radius: 999px;
          background: var(--blueSoft); color: var(--blue);
          font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
          width: fit-content;
        }
        .how-title {
          font-size: clamp(22px,2.6vw,32px); letter-spacing: -.04em; margin: 0;
        }
        .how-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .how-card {
          background: var(--surface); border: 1px solid var(--line);
          border-radius: 20px; padding: 22px 18px;
          display: flex; flex-direction: column; gap: 8px;
          box-shadow: var(--shadow);
          position: relative; overflow: hidden;
        }
        .how-step {
          font-size: 48px; font-weight: 950; letter-spacing: -.06em;
          color: var(--line); line-height: 1; display: block;
          position: absolute; top: 14px; right: 16px;
        }
        .how-icon { font-size: 28px; line-height: 1; display: block; }
        .how-card-title {
          font-size: 16px; font-weight: 950; letter-spacing: -.03em;
          color: var(--text);
        }
        .how-card-desc {
          margin: 0; font-size: 13px; font-weight: 700;
          color: var(--muted); line-height: 1.6;
        }
        @media (max-width: 900px) {
          .how-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 500px) {
          .how-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
