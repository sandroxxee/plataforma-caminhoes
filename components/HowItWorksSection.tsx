import { Search, FileText, MessageSquare, CheckCircle2 } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      title: "Busque",
      desc: "Filtre por marca, modelo, ano, tração e localidade.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FileText,
      title: "Compare",
      desc: "Veja fotos e ficha técnica completa antes de decidir.",
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: MessageSquare,
      title: "Negocie",
      desc: "Fale direto com o vendedor pelo WhatsApp. Sem intermediários.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: CheckCircle2,
      title: "Feche",
      desc: "Confirme a documentação e finalize com segurança.",
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <section className="how-section">
      <div className="how-header">
        <h2 className="how-title">Como funciona</h2>
      </div>
      <div className="how-grid">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="how-card">
              <div className={`how-icon-bg bg-gradient-to-br ${step.color}`} aria-hidden="true">
                <Icon size={24} strokeWidth={2} className="text-white" />
              </div>
              <span className="how-step">{String(i + 1).padStart(2, "0")}</span>
              <strong className="how-card-title">{step.title}</strong>
              <p className="how-card-desc">{step.desc}</p>
            </div>
          );
        })}
      </div>
      <style>{`
        .how-section { padding: 48px 0 16px; }
        .how-header { margin-bottom: 28px; }
        .how-title {
          font-size: clamp(24px,2.8vw,32px);
          font-weight: 950;
          letter-spacing: -.04em;
          margin: 0;
          color: var(--text);
        }
        .how-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .how-card {
          background: var(--surface);
          border: 1.5px solid var(--line);
          border-radius: 24px;
          padding: 32px 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: var(--shadow);
          position: relative;
          overflow: hidden;
          transition: all .28s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }
        .how-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.8) 0%, rgba(255,255,255,0) 100%);
          opacity: 0;
          transition: opacity .28s;
          pointer-events: none;
        }
        .how-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 24px 56px rgba(15,23,42,.16);
          border-color: rgba(59,130,246,.4);
        }
        .how-card:hover::before { opacity: 1; }
        .how-icon-bg {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
          box-shadow: 0 4px 16px rgba(0,0,0,.15);
        }
        .how-step {
          font-size: 56px;
          font-weight: 950;
          letter-spacing: -.08em;
          color: rgba(148,163,184,.15);
          line-height: 1;
          display: block;
          position: absolute;
          top: -8px;
          right: 8px;
          z-index: 0;
        }
        .how-card-title {
          font-size: 17px;
          font-weight: 900;
          letter-spacing: -.02em;
          color: var(--text);
          position: relative;
          z-index: 1;
        }
        .how-card-desc {
          margin: 0;
          font-size: 14px;
          font-weight: 650;
          color: var(--muted);
          line-height: 1.65;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 900px) {
          .how-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .how-card { padding: 24px 18px 20px; }
        }
        @media (max-width: 500px) {
          .how-grid { grid-template-columns: 1fr; gap: 14px; }
          .how-card { padding: 20px 16px 18px; }
          .how-icon-bg { width: 48px; height: 48px; }
        }
      `}</style>
    </section>
  );
}
