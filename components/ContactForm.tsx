"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    assunto: "duvida",
    mensagem: "",
    interesse_financiamento: false,
    possui_troca: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulação de envio (integrar com API Route depois)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({
        nome: "",
        email: "",
        whatsapp: "",
        assunto: "duvida",
        mensagem: "",
        interesse_financiamento: false,
        possui_troca: false,
      });
    } catch (error) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="contact-success">
        <CheckCircle2 size={48} className="text-green-500" />
        <h3>Mensagem enviada!</h3>
        <p>Recebemos seu contato e nossa equipe responderá o mais breve possível no seu e-mail ou WhatsApp.</p>
        <button onClick={() => setStatus("idle")} className="btn-reset">Enviar outra mensagem</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="nome">Seu nome completo</label>
          <input
            id="nome"
            type="text"
            required
            placeholder="Ex: João Silva"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="email">E-mail para resposta</label>
            <input
              id="email"
              type="email"
              required
              placeholder="joao@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp (opcional)</label>
            <input
              id="whatsapp"
              type="tel"
              placeholder="(48) 99999-9999"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="assunto">Assunto</label>
          <select
            id="assunto"
            value={formData.assunto}
            onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
          >
            <option value="duvida">Dúvida sobre um anúncio</option>
            <option value="anunciar">Quero saber como anunciar</option>
            <option value="problema">Reportar um problema</option>
            <option value="parceria">Parcerias e Revendas</option>
            <option value="outro">Outro assunto</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mensagem">Como podemos ajudar?</label>
          <textarea
            id="mensagem"
            required
            rows={4}
            placeholder="Escreva sua mensagem aqui..."
            value={formData.mensagem}
            onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
          />
        </div>

        <div className="form-checkboxes">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={formData.interesse_financiamento}
              onChange={(e) => setFormData({ ...formData, interesse_financiamento: e.target.checked })}
            />
            <span>Tenho interesse em financiamento</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={formData.possui_troca}
              onChange={(e) => setFormData({ ...formData, possui_troca: e.target.checked })}
            />
            <span>Possuo veículo para troca</span>
          </label>
        </div>

        {status === "error" && (
          <div className="form-error">
            <AlertCircle size={18} />
            Ops! Ocorreu um erro ao enviar. Tente novamente.
          </div>
        )}

        <button type="submit" className="btn-submit" disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Enviando...
            </>
          ) : (
            <>
              <Send size={18} /> Enviar Mensagem
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .contact-form {
          background: var(--surface);
          padding: 32px;
          border-radius: 24px;
          border: 1px solid var(--line);
          box-shadow: var(--shadow);
        }
        .form-grid { display: flex; flex-direction: column; gap: 20px; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 13px; font-weight: 800; color: var(--text); }
        .form-group input, .form-group select, .form-group textarea {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid var(--line);
          background: var(--bg);
          color: var(--text);
          font-size: 14px;
          font-weight: 600;
          transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none;
          border-color: var(--blue);
        }
        .form-checkboxes { display: flex; flex-direction: column; gap: 12px; margin: 4px 0; }
        .checkbox-item { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .checkbox-item input { width: 18px; height: 18px; border-radius: 6px; cursor: pointer; }
        .checkbox-item span { font-size: 13px; font-weight: 700; color: var(--muted); }
        
        .btn-submit {
          height: 52px;
          border-radius: 14px;
          background: var(--blue);
          color: white;
          border: none;
          font-size: 15px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }
        .btn-submit:hover:not(:disabled) { background: var(--blue2); transform: translateY(-2px); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .contact-success {
          text-align: center;
          padding: 48px 32px;
          background: var(--surface);
          border-radius: 24px;
          border: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .contact-success h3 { margin: 0; font-size: 20px; font-weight: 950; }
        .contact-success p { margin: 0; color: var(--muted); font-size: 14px; font-weight: 700; line-height: 1.6; }
        .btn-reset {
          margin-top: 8px;
          background: none;
          border: none;
          color: var(--blue);
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          text-decoration: underline;
        }
        
        .form-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
        }

        @media (max-width: 600px) {
          .form-grid-2 { grid-template-columns: 1fr; }
          .contact-form { padding: 20px; }
        }
      `}</style>
    </form>
  );
}
