"use client";

import { useState } from "react";
import Link from "next/link";
import { salvarAparencia } from "./actions";
import { HeroBannerSection } from "./HeroBannerSection";
import { 
  Layout, 
  Sparkles, 
  ShieldCheck, 
  Megaphone, 
  Eye, 
  Check, 
  ArrowRight,
  ChevronRight
} from "lucide-react";
import type { HomeContent } from "@/lib/site-content";

type Props = {
  initialContent: HomeContent;
};

export function AparenciaFormClient({ initialContent }: Props) {
  const [activeTab, setActiveTab] = useState<"capa" | "confianca" | "comercial" | "chamadas">("capa");
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Estados locais para a prévia em tempo real (Live Preview)
  const [heroBannerUrl, setHeroBannerUrl] = useState(initialContent.heroBannerUrl);
  const [heroMini, setHeroMini] = useState(initialContent.heroMini);
  const [heroTitle, setHeroTitle] = useState(initialContent.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(initialContent.heroSubtitle);
  const [primaryBtn, setPrimaryBtn] = useState(initialContent.primaryButtonText);
  const [secondaryBtn, setSecondaryBtn] = useState(initialContent.secondaryButtonText);

  // Estados para os outros campos para persistir valor nas abas
  const [formState, setFormState] = useState(initialContent);

  function handleChange(name: keyof HomeContent, val: string) {
    setFormState(old => ({ ...old, [name]: val }));
    
    // Sincronizar específicos do preview
    if (name === "heroMini") setHeroMini(val);
    if (name === "heroTitle") setHeroTitle(val);
    if (name === "heroSubtitle") setHeroSubtitle(val);
    if (name === "primaryButtonText") setPrimaryBtn(val);
    if (name === "secondaryButtonText") setSecondaryBtn(val);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSalvando(true);
    setSucesso(false);

    try {
      const formData = new FormData(e.currentTarget);
      // Garantir o Banner URL atualizado do estado
      formData.set("heroBannerUrl", heroBannerUrl);

      // Chamar a Server Action
      await salvarAparencia(formData);
      
      setSucesso(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSucesso(false), 6000);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="aparencia-form-client">
      
      {sucesso && (
        <div className="alerta-sucesso-premium">
          <div className="alerta-sucesso-icon">✨</div>
          <div>
            <strong>Alterações salvas com sucesso!</strong>
            <p>Os novos textos e banners já estão ativos na página inicial do site público.</p>
          </div>
        </div>
      )}

      {/* Grid Layout: Menu de Abas na esquerda e Formulário/Preview na direita */}
      <div className="aparencia-layout-grid">
        
        {/* Lado Esquerdo: Abas Verticais */}
        <div className="aparencia-sidebar-tabs">
          <button 
            type="button"
            onClick={() => setActiveTab("capa")}
            className={`tab-btn ${activeTab === "capa" ? "active" : ""}`}
          >
            <Layout size={18} />
            <span>Capa & Topo</span>
            <ChevronRight size={14} className="arrow" />
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("confianca")}
            className={`tab-btn ${activeTab === "confianca" ? "active" : ""}`}
          >
            <ShieldCheck size={18} />
            <span>Faixa de Confiança</span>
            <ChevronRight size={14} className="arrow" />
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("comercial")}
            className={`tab-btn ${activeTab === "comercial" ? "active" : ""}`}
          >
            <Sparkles size={18} />
            <span>Textos Comerciais</span>
            <ChevronRight size={14} className="arrow" />
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("chamadas")}
            className={`tab-btn ${activeTab === "chamadas" ? "active" : ""}`}
          >
            <Megaphone size={18} />
            <span>Chamadas & Rodapé</span>
            <ChevronRight size={14} className="arrow" />
          </button>
        </div>

        {/* Lado Direito: Formulário Ativo + Preview */}
        <div className="aparencia-content-area">
          
          <input type="hidden" name="heroBannerUrl" id="heroBannerUrl" value={heroBannerUrl} />

          {/* ABA 1: CAPA & TOPO (Hero) */}
          {activeTab === "capa" && (
            <div className="tab-pane-content">
              
              {/* Live Preview Card */}
              <div className="live-preview-box">
                <div className="preview-header">
                  <Eye size={13} /> PRÉVIA EM TEMPO REAL DA CAPA
                </div>
                
                <div 
                  className="preview-hero-mockup"
                  style={{ backgroundImage: `url(${heroBannerUrl || "/placeholder-truck.png"})` }}
                >
                  <div className="preview-hero-overlay">
                    <span className="preview-hero-mini">{heroMini || "MINI TEXTO"}</span>
                    <h2 className="preview-hero-title">{heroTitle || "Título Principal da Capa"}</h2>
                    <p className="preview-hero-sub">{heroSubtitle || "Subtítulo explicativo abaixo."}</p>
                    
                    <div className="preview-hero-actions">
                      {primaryBtn && <span className="preview-btn primary">{primaryBtn}</span>}
                      {secondaryBtn && <span className="preview-btn secondary">{secondaryBtn}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload da Imagem */}
              <div className="form-card-premium">
                <HeroBannerSection currentUrl={heroBannerUrl} />
                {/* Override de callback para atualizar estado local ao mudar imagem */}
                <span style={{ display: "none" }} ref={(el) => {
                  if (el) {
                    const observer = new MutationObserver(() => {
                      const hiddenInput = document.getElementById("heroBannerUrl") as HTMLInputElement | null;
                      if (hiddenInput && hiddenInput.value !== heroBannerUrl) {
                        setHeroBannerUrl(hiddenInput.value);
                      }
                    });
                    const target = document.getElementById("heroBannerUrl");
                    if (target) observer.observe(target, { attributes: true, attributeFilter: ["value"] });
                  }
                }} />
              </div>

              {/* Formulário de Textos do Topo */}
              <div className="form-card-premium">
                <h3 className="card-title-premium">Textos do Topo</h3>
                
                <label className="field-premium">
                  <span>Texto pequeno acima do título</span>
                  <input 
                    name="heroMini" 
                    value={heroMini} 
                    onChange={(e) => handleChange("heroMini", e.target.value)} 
                  />
                </label>

                <label className="field-premium">
                  <span>Título principal da capa</span>
                  <textarea 
                    name="heroTitle" 
                    value={heroTitle} 
                    rows={3}
                    onChange={(e) => handleChange("heroTitle", e.target.value)} 
                  />
                </label>

                <label className="field-premium">
                  <span>Subtítulo da capa</span>
                  <textarea 
                    name="heroSubtitle" 
                    value={heroSubtitle} 
                    rows={3}
                    onChange={(e) => handleChange("heroSubtitle", e.target.value)} 
                  />
                </label>

                <div className="form-two-columns">
                  <label className="field-premium">
                    <span>Botão Principal (Texto)</span>
                    <input 
                      name="primaryButtonText" 
                      value={primaryBtn} 
                      onChange={(e) => handleChange("primaryButtonText", e.target.value)} 
                    />
                  </label>
                  <label className="field-premium">
                    <span>Botão Principal (Link)</span>
                    <input 
                      name="primaryButtonHref" 
                      defaultValue={formState.primaryButtonHref} 
                      onChange={(e) => handleChange("primaryButtonHref", e.target.value)} 
                    />
                  </label>
                  <label className="field-premium">
                    <span>Botão Secundário (Texto)</span>
                    <input 
                      name="secondaryButtonText" 
                      value={secondaryBtn} 
                      onChange={(e) => handleChange("secondaryButtonText", e.target.value)} 
                    />
                  </label>
                  <label className="field-premium">
                    <span>Botão Secundário (Link)</span>
                    <input 
                      name="secondaryButtonHref" 
                      defaultValue={formState.secondaryButtonHref} 
                      onChange={(e) => handleChange("secondaryButtonHref", e.target.value)} 
                    />
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* ABA 2: FAIXA DE CONFIANÇA */}
          {activeTab === "confianca" && (
            <div className="tab-pane-content">
              <div className="form-card-premium">
                <h3 className="card-title-premium">Faixa de Confiança</h3>
                <p className="card-desc-premium">Edite as 4 colunas informativas de credibilidade exibidas abaixo da foto de capa.</p>

                <div className="form-two-columns">
                  <div className="block-editor-premium">
                    <h4>Coluna 1</h4>
                    <label className="field-premium">
                      <span>Título</span>
                      <input 
                        name="trust1Title" 
                        defaultValue={formState.trust1Title} 
                        onChange={(e) => handleChange("trust1Title", e.target.value)} 
                      />
                    </label>
                    <label className="field-premium">
                      <span>Texto descritivo</span>
                      <input 
                        name="trust1Text" 
                        defaultValue={formState.trust1Text} 
                        onChange={(e) => handleChange("trust1Text", e.target.value)} 
                      />
                    </label>
                  </div>

                  <div className="block-editor-premium">
                    <h4>Coluna 2</h4>
                    <label className="field-premium">
                      <span>Título</span>
                      <input 
                        name="trust2Title" 
                        defaultValue={formState.trust2Title} 
                        onChange={(e) => handleChange("trust2Title", e.target.value)} 
                      />
                    </label>
                    <label className="field-premium">
                      <span>Texto descritivo</span>
                      <input 
                        name="trust2Text" 
                        defaultValue={formState.trust2Text} 
                        onChange={(e) => handleChange("trust2Text", e.target.value)} 
                      />
                    </label>
                  </div>

                  <div className="block-editor-premium">
                    <h4>Coluna 3</h4>
                    <label className="field-premium">
                      <span>Título</span>
                      <input 
                        name="trust3Title" 
                        defaultValue={formState.trust3Title} 
                        onChange={(e) => handleChange("trust3Title", e.target.value)} 
                      />
                    </label>
                    <label className="field-premium">
                      <span>Texto descritivo</span>
                      <input 
                        name="trust3Text" 
                        defaultValue={formState.trust3Text} 
                        onChange={(e) => handleChange("trust3Text", e.target.value)} 
                      />
                    </label>
                  </div>

                  <div className="block-editor-premium">
                    <h4>Coluna 4</h4>
                    <label className="field-premium">
                      <span>Título</span>
                      <input 
                        name="trust4Title" 
                        defaultValue={formState.trust4Title} 
                        onChange={(e) => handleChange("trust4Title", e.target.value)} 
                      />
                    </label>
                    <label className="field-premium">
                      <span>Texto descritivo</span>
                      <input 
                        name="trust4Text" 
                        defaultValue={formState.trust4Text} 
                        onChange={(e) => handleChange("trust4Text", e.target.value)} 
                      />
                    </label>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ABA 3: TEXTOS COMERCIAIS */}
          {activeTab === "comercial" && (
            <div className="tab-pane-content">
              <div className="form-card-premium">
                <h3 className="card-title-premium">Sessões Informativas de Compra, Venda e Segurança</h3>
                <p className="card-desc-premium">Configure os blocos informativos detalhados de conversão comercial.</p>

                <div className="commercial-editor-block">
                  <label className="field-premium">
                    <span>Compra — Título</span>
                    <input 
                      name="buyerTitle" 
                      defaultValue={formState.buyerTitle} 
                      onChange={(e) => handleChange("buyerTitle", e.target.value)} 
                    />
                  </label>
                  <label className="field-premium">
                    <span>Compra — Descrição completa</span>
                    <textarea 
                      name="buyerText" 
                      value={formState.buyerText} 
                      rows={4}
                      onChange={(e) => handleChange("buyerText", e.target.value)} 
                    />
                  </label>
                </div>

                <div className="commercial-editor-block" style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(148,163,184,0.12)" }}>
                  <label className="field-premium">
                    <span>Venda — Título</span>
                    <input 
                      name="sellerTitle" 
                      defaultValue={formState.sellerTitle} 
                      onChange={(e) => handleChange("sellerTitle", e.target.value)} 
                    />
                  </label>
                  <label className="field-premium">
                    <span>Venda — Descrição completa</span>
                    <textarea 
                      name="sellerText" 
                      value={formState.sellerText} 
                      rows={4}
                      onChange={(e) => handleChange("sellerText", e.target.value)} 
                    />
                  </label>
                </div>

                <div className="commercial-editor-block" style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(148,163,184,0.12)" }}>
                  <label className="field-premium">
                    <span>Segurança — Título</span>
                    <input 
                      name="securityTitle" 
                      defaultValue={formState.securityTitle} 
                      onChange={(e) => handleChange("securityTitle", e.target.value)} 
                    />
                  </label>
                  <label className="field-premium">
                    <span>Segurança — Descrição completa</span>
                    <textarea 
                      name="securityText" 
                      value={formState.securityText} 
                      rows={4}
                      onChange={(e) => handleChange("securityText", e.target.value)} 
                    />
                  </label>
                </div>

              </div>
            </div>
          )}

          {/* ABA 4: CHAMADAS & RODAPÉ */}
          {activeTab === "chamadas" && (
            <div className="tab-pane-content">
              
              {/* Chamada para Anunciar */}
              <div className="form-card-premium">
                <h3 className="card-title-premium">Chamada para Anunciar</h3>
                <p className="card-desc-premium">Edite as informações contidas no banner interno para atrair novos anunciantes.</p>

                <label className="field-premium">
                  <span>Etiqueta pequena</span>
                  <input 
                    name="sellMini" 
                    defaultValue={formState.sellMini} 
                    onChange={(e) => handleChange("sellMini", e.target.value)} 
                  />
                </label>

                <label className="field-premium">
                  <span>Título da chamada</span>
                  <input 
                    name="sellTitle" 
                    defaultValue={formState.sellTitle} 
                    onChange={(e) => handleChange("sellTitle", e.target.value)} 
                  />
                </label>

                <label className="field-premium">
                  <span>Descrição da chamada</span>
                  <textarea 
                    name="sellText" 
                    value={formState.sellText} 
                    rows={4}
                    onChange={(e) => handleChange("sellText", e.target.value)} 
                  />
                </label>
              </div>

              {/* Chamada Final (Rodapé) */}
              <div className="form-card-premium">
                <h3 className="card-title-premium">Chamada Final de Encerramento</h3>
                <p className="card-desc-premium">Edite a frase grande motivacional colocada na base do site antes do rodapé de páginas.</p>

                <label className="field-premium">
                  <span>Texto pequeno acima do rodapé</span>
                  <input 
                    name="finalMini" 
                    defaultValue={formState.finalMini} 
                    onChange={(e) => handleChange("finalMini", e.target.value)} 
                  />
                </label>

                <label className="field-premium">
                  <span>Frase final grande</span>
                  <textarea 
                    name="finalTitle" 
                    value={formState.finalTitle} 
                    rows={3}
                    onChange={(e) => handleChange("finalTitle", e.target.value)} 
                  />
                </label>
              </div>

            </div>
          )}

          {/* Sticky Actions bar */}
          <div className="botoes-acoes-painel-premium">
            <button 
              type="submit" 
              disabled={salvando} 
              className="salvar-btn-premium"
            >
              {salvando ? "Salvando..." : <Check size={18} />}
              {salvando ? "Aguarde..." : "Salvar Alterações"}
            </button>
            
            <Link href="/" target="_blank" className="preview-btn-premium">
              Visualizar Site <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        .aparencia-form-client {
          display: grid;
          gap: 20px;
        }

        .alerta-sucesso-premium {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border-radius: 20px;
          background: #dcfce7;
          border: 1px solid rgba(22,101,52,0.15);
          color: #14532d;
          animation: slideDown 0.3s ease-out;
        }
        .alerta-sucesso-icon {
          font-size: 26px;
        }
        .alerta-sucesso-premium strong {
          display: block;
          font-size: 16px;
          font-weight: 850;
        }
        .alerta-sucesso-premium p {
          margin: 4px 0 0;
          font-size: 13px;
          font-weight: 700;
          opacity: 0.9;
        }

        .aparencia-layout-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 24px;
          align-items: start;
        }

        /* Sidebar Tabs */
        .aparencia-sidebar-tabs {
          display: grid;
          gap: 8px;
          position: sticky;
          top: 24px;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border: 1px solid rgba(148,163,184,0.08);
          border-radius: 16px;
          background: #ffffff;
          color: #475569;
          font-family: inherit;
          font-size: 14px;
          font-weight: 850;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tab-btn:hover {
          background: #f8fafc;
          color: #0f172a;
          transform: translateX(4px);
        }
        .tab-btn.active {
          background: #1877f2;
          color: #ffffff;
          border-color: #1877f2;
          box-shadow: 0 4px 12px rgba(24,119,242,0.15);
        }
        .tab-btn .arrow {
          margin-left: auto;
          opacity: 0;
          transition: all 0.2s;
        }
        .tab-btn.active .arrow {
          opacity: 1;
          transform: translateX(2px);
        }

        /* Content Area */
        .aparencia-content-area {
          display: grid;
          gap: 20px;
          min-width: 0;
        }
        .tab-pane-content {
          display: grid;
          gap: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        /* Form Premium Cards */
        .form-card-premium {
          padding: 28px;
          border-radius: 24px;
          background: #ffffff;
          border: 1px solid rgba(148,163,184,0.12);
          box-shadow: 0 4px 20px rgba(15,23,42,0.02);
        }
        .card-title-premium {
          margin: 0 0 4px;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #0f172a;
        }
        .card-desc-premium {
          margin: 0 0 20px;
          font-size: 13px;
          color: #64748b;
          font-weight: 700;
        }

        /* Form Fields */
        .field-premium {
          display: grid;
          gap: 8px;
          margin-bottom: 20px;
        }
        .field-premium:last-child {
          margin-bottom: 0;
        }
        .field-premium span {
          color: #475569;
          font-size: 13px;
          font-weight: 850;
        }
        .field-premium input {
          width: 100%;
          min-height: 48px;
          padding: 0 16px;
          border-radius: 14px;
          border: 1px solid rgba(148,163,184,0.18);
          background: #f8fafc;
          color: #0f172a;
          font-family: inherit;
          font-weight: 750;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s;
        }
        .field-premium input:focus,
        .field-premium textarea:focus {
          background: #ffffff;
          border-color: #1877f2;
          box-shadow: 0 0 0 4px rgba(24,119,242,0.1);
        }
        .field-premium textarea {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(148,163,184,0.18);
          background: #f8fafc;
          color: #0f172a;
          font-family: inherit;
          font-weight: 650;
          line-height: 1.6;
          resize: vertical;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s;
        }

        .form-two-columns {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        
        .block-editor-premium {
          padding: 16px;
          border-radius: 18px;
          background: #f8fafc;
          border: 1px solid rgba(148,163,184,0.1);
        }
        .block-editor-premium h4 {
          margin: 0 0 12px;
          font-size: 14px;
          font-weight: 900;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Live Preview Mockup */
        .live-preview-box {
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(148,163,184,0.12);
          box-shadow: 0 4px 20px rgba(15,23,42,0.02);
          background: #0f172a;
        }
        .preview-header {
          background: #1e293b;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 900;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .preview-hero-mockup {
          background-size: cover;
          background-position: center;
          min-height: 240px;
          position: relative;
          display: flex;
          align-items: center;
          padding: 30px;
          transition: background-image 0.3s ease;
        }
        .preview-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(2,6,23,0.92) 35%, rgba(2,6,23,0.4) 100%);
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .preview-hero-mini {
          color: #22c55e;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .preview-hero-title {
          color: #ffffff;
          font-size: 26px;
          font-weight: 900;
          line-height: 1.15;
          margin: 0 0 10px;
          max-width: 480px;
          letter-spacing: -0.03em;
        }
        .preview-hero-sub {
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.5;
          margin: 0 0 16px;
          max-width: 420px;
          font-weight: 600;
        }
        .preview-hero-actions {
          display: flex;
          gap: 8px;
        }
        .preview-btn {
          display: inline-flex;
          height: 32px;
          align-items: center;
          padding: 0 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
        }
        .preview-btn.primary {
          background: #1877f2;
          color: #ffffff;
        }
        .preview-btn.secondary {
          background: rgba(255,255,255,0.08);
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.15);
        }

        /* Sticky Action Footer */
        .botoes-acoes-painel-premium {
          position: sticky;
          bottom: 20px;
          z-index: 10;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding: 16px 20px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(148,163,184,0.12);
          backdrop-filter: blur(16px);
          box-shadow: 0 10px 30px rgba(15,23,42,0.06);
          margin-top: 10px;
        }
        .salvar-btn-premium {
          min-height: 48px;
          padding: 0 24px;
          border-radius: 14px;
          border: 0;
          background: #1877f2;
          color: #ffffff;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(24,119,242,0.22);
          transition: all 0.2s;
        }
        .salvar-btn-premium:hover {
          background: #1565d8;
          transform: translateY(-1px);
        }
        .salvar-btn-premium:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .preview-btn-premium {
          min-height: 48px;
          padding: 0 24px;
          border-radius: 14px;
          border: 1px solid rgba(148,163,184,0.15);
          background: #ffffff;
          color: #475569;
          font-weight: 800;
          font-size: 14px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .preview-btn-premium:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .aparencia-layout-grid {
            grid-template-columns: 1fr;
          }
          .aparencia-sidebar-tabs {
            grid-template-columns: repeat(2, 1fr);
            position: static;
          }
          .form-two-columns {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 520px) {
          .aparencia-sidebar-tabs {
            grid-template-columns: 1fr;
          }
          .botoes-acoes-painel-premium {
            flex-direction: column;
          }
          .salvar-btn-premium, .preview-btn-premium {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </form>
  );
}
