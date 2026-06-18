"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { PanelLayout } from "@/components/PanelLayout";
import { AutoFillTruckButton } from "@/components/AutoFillTruckButton";
import { TruckConfigurationFields } from "@/components/TruckConfigurationFields";
import { WatermarkPhotoUploader } from "@/components/WatermarkPhotoUploader";
import { ImportarOLX } from "@/components/ImportarOLX";
import { criarAnuncio } from "../../actions";

const marcas = ["Mercedes-Benz", "Scania", "Volvo", "Volkswagen", "Ford", "Iveco", "DAF"];
const carrocerias = [
  "Caçamba basculante",
  "Caçamba meia-cana",
  "Graneleira",
  "Chassis",
  "Tanque",
  "Prancha",
  "Plataforma",
  "Baú seco",
  "Baú frigorífico",
  "Cavalo mecânico",
  "Munck",
  "Outra",
];
const estados = ["SC", "PR", "RS", "SP", "MG", "MS", "MT", "GO", "BA", "RJ", "ES", "Outro"];

const etapas = [
  { href: "#dados", numero: "1", titulo: "Dados", texto: "Marca e modelo" },
  { href: "#fotos", numero: "2", titulo: "Fotos", texto: "Imagens" },
  { href: "#localizacao-contato", numero: "3", titulo: "Contato", texto: "Cidade e WhatsApp" },
  { href: "#revisao-envio", numero: "4", titulo: "Enviar", texto: "Aprovação" },
];

type Campos = {
  marca: string;
  modelo: string;
  ano: string;
  preco: string;
  cidade: string;
  estado: string;
  carroceria: string;
  whatsapp: string;
  descricao: string;
};

export default function NovoCaminhaoPage() {
  const formRef = useRef<HTMLFormElement>(null);

  const [campos, setCampos] = useState<Campos>({
    marca: "",
    modelo: "",
    ano: "",
    preco: "",
    cidade: "",
    estado: "SC",
    carroceria: "",
    whatsapp: "",
    descricao: "",
  });

  function handleImportar(dados: {
    titulo: string;
    preco: number | null;
    descricao: string;
    cidade: string;
    estado: string;
    imagens: string[];
  }) {
    const modeloExtraido = dados.titulo
      .replace(/mercedes[-\s]?benz|scania|volvo|volkswagen|ford|iveco|daf/gi, "")
      .replace(/\d{4}/, "")
      .trim();

    setCampos((prev) => ({
      ...prev,
      modelo: modeloExtraido || prev.modelo,
      preco: dados.preco ? String(dados.preco) : prev.preco,
      cidade: dados.cidade || prev.cidade,
      estado: dados.estado || prev.estado,
      descricao: dados.descricao || prev.descricao,
    }));
  }

  function handleFill(sugestao: Partial<Campos>) {
    setCampos((prev) => ({
      marca: sugestao.marca && marcas.includes(sugestao.marca) ? sugestao.marca : prev.marca,
      modelo: sugestao.modelo || prev.modelo,
      ano: sugestao.ano || prev.ano,
      preco: sugestao.preco || prev.preco,
      cidade: sugestao.cidade || prev.cidade,
      estado: sugestao.estado && estados.includes(sugestao.estado) ? sugestao.estado : prev.estado,
      carroceria: sugestao.carroceria && carrocerias.includes(sugestao.carroceria) ? sugestao.carroceria : prev.carroceria,
      whatsapp: sugestao.whatsapp || prev.whatsapp,
      descricao: sugestao.descricao || prev.descricao,
    }));
  }

  return (
    <PanelLayout
      title="Anunciar caminhão"
      subtitle="Cadastre o caminhão com dados claros, fotos e contato do anunciante."
      actions={<Link href="/painel/anuncios/novo" className="secondary-button">Trocar tipo</Link>}
    >
      {/* Banner de importação OLX */}
      <div className="olx-banner">
        <div className="olx-banner-text">
          <strong>Já tem anúncio na OLX?</strong>
          <span>Importe tudo automaticamente — fotos, descrição, preço e local.</span>
        </div>
        <ImportarOLX onImportar={handleImportar} />
      </div>

      <form ref={formRef} action={criarAnuncio} className="truck-form" encType="multipart/form-data">
        <input type="hidden" name="tipo_anuncio" value="Caminhão" />

        <div className="form-shell">
          <aside className="steps-panel" aria-label="Etapas do cadastro do caminhão">
            <div className="vehicle-type">
              <small>Categoria</small>
              <strong>Caminhão</strong>
            </div>

            <nav className="steps-nav">
              {etapas.map((etapa) => (
                <a key={etapa.href} href={etapa.href}>
                  <span>{etapa.numero}</span>
                  <div>
                    <strong>{etapa.titulo}</strong>
                    <small>{etapa.texto}</small>
                  </div>
                </a>
              ))}
            </nav>
          </aside>

          <div className="form-main">
            <section id="dados" className="form-section">
              <div className="section-head">
                <span>01</span>
                <div>
                  <h2>Dados do caminhão</h2>
                  <p>Marca, modelo, ano, carroceria e configuração.</p>
                </div>
              </div>

              <div className="form-grid three">
                <label>
                  Marca do caminhão *
                  <select
                    name="marca"
                    value={campos.marca}
                    onChange={(e) => setCampos((prev) => ({ ...prev, marca: e.target.value }))}
                    required
                  >
                    <option value="" disabled>Selecione a marca</option>
                    {marcas.map((marca) => (
                      <option key={marca} value={marca}>{marca}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Modelo do caminhão *
                  <input
                    name="modelo"
                    placeholder="Ex: 113, P420, FH 540"
                    required
                    value={campos.modelo}
                    onChange={(e) => setCampos((prev) => ({ ...prev, modelo: e.target.value }))}
                  />
                </label>

                <label>
                  Ano do caminhão *
                  <input
                    name="ano"
                    type="number"
                    placeholder="Ex: 1995"
                    required
                    value={campos.ano}
                    onChange={(e) => setCampos((prev) => ({ ...prev, ano: e.target.value }))}
                  />
                </label>

                <label>
                  Carroceria *
                  <select
                    name="carroceria"
                    value={campos.carroceria}
                    onChange={(e) => setCampos((prev) => ({ ...prev, carroceria: e.target.value }))}
                    required
                  >
                    <option value="" disabled>Selecione a carroceria</option>
                    {carrocerias.map((carroceria) => (
                      <option key={carroceria} value={carroceria}>{carroceria}</option>
                    ))}
                  </select>
                </label>

                <TruckConfigurationFields />

                <label>
                  Quilometragem <span className="optional-tag">(opcional)</span>
                  <input name="quilometragem" type="number" placeholder="Ex: 450000" />
                  <small>Em km. Deixe em branco se não souber.</small>
                </label>
              </div>
            </section>

            <section className="form-section ai-section">
              <div className="section-head compact-head">
                <span>IA</span>
                <div>
                  <h2>Importar com IA</h2>
                  <p>Cole o texto do anúncio — OLX, Facebook Marketplace, WhatsApp ou qualquer fonte. A IA preenche os campos automaticamente.</p>
                </div>
              </div>

              <div className="ai-grid">
                <label>
                  Texto do anúncio
                  <textarea
                    name="texto_ia"
                    placeholder="Cole aqui a descrição do anúncio (OLX, Facebook Marketplace, WhatsApp...). Ex: Scania R440 6x4 ano 2018, com baú frigorífico, 680mil km, SP, R$ 320.000"
                  />
                </label>

                <AutoFillTruckButton onFill={handleFill} />
              </div>
            </section>

            <section id="fotos" className="form-section upload-section">
              <div className="section-head">
                <span>02</span>
                <div>
                  <h2>Fotos do caminhão</h2>
                  <p>Adicione fotos reais do veículo.</p>
                </div>
              </div>

              <WatermarkPhotoUploader />
            </section>

            <section id="localizacao-contato" className="form-section">
              <div className="section-head">
                <span>03</span>
                <div>
                  <h2>Localização e contato</h2>
                  <p>Valor, cidade, estado, WhatsApp e descrição.</p>
                </div>
              </div>

              <div className="form-grid three">
                <label>
                  Valor *
                  <input
                    name="preco"
                    type="number"
                    placeholder="Ex: 180000"
                    required
                    value={campos.preco}
                    onChange={(e) => setCampos((prev) => ({ ...prev, preco: e.target.value }))}
                  />
                </label>

                <label>
                  Cidade <span className="optional-tag">(opcional)</span>
                  <input
                    name="cidade"
                    placeholder="Ex: Xanxerê"
                    value={campos.cidade}
                    onChange={(e) => setCampos((prev) => ({ ...prev, cidade: e.target.value }))}
                  />
                </label>

                <label>
                  Estado *
                  <select
                    name="estado"
                    value={campos.estado}
                    onChange={(e) => setCampos((prev) => ({ ...prev, estado: e.target.value }))}
                    required
                  >
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </label>

                <label>
                  WhatsApp *
                  <input
                    name="whatsapp"
                    placeholder="Ex: 5549999362681"
                    required
                    value={campos.whatsapp}
                    onChange={(e) => setCampos((prev) => ({ ...prev, whatsapp: e.target.value }))}
                  />
                  <small>Use DDI + DDD + número.</small>
                </label>

                <label className="wide description-field">
                  Descrição
                  <textarea
                    name="descricao"
                    placeholder="Ex: Mecânica em dia, pronto para trabalhar, pneus bons, documentação em dia."
                    value={campos.descricao}
                    onChange={(e) => setCampos((prev) => ({ ...prev, descricao: e.target.value }))}
                  />
                </label>
              </div>
            </section>

            <section id="revisao-envio" className="review-section">
              <div className="preview-box">
                <strong>Título automático:</strong>
                <span>Marca + Modelo + Configuração + Ano</span>
              </div>

              <footer className="form-footer">
                <p>O anúncio será enviado para aprovação.</p>
                <button type="submit">Enviar para aprovação</button>
              </footer>
            </section>
          </div>
        </div>
      </form>

      <style>{`
        .olx-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 18px;
          background: #1a2535;
          border: 1.5px solid #2563eb44;
          border-radius: 14px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }
        .olx-banner-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .olx-banner-text strong {
          color: #93c5fd;
          font-size: 14px;
          font-weight: 800;
        }
        .olx-banner-text span {
          color: #6b7280;
          font-size: 13px;
        }
        .secondary-button { min-height: 40px; display: inline-flex; align-items: center; justify-content: center; padding: 0 12px; border-radius: 12px; border: 1px solid #343a40; background: #2a2f34; color: #e8eaed; text-decoration: none; font-weight: 900; font-size: 13px; }
        .optional-tag { color: #8f99a3; font-weight: 700; font-size: 11px; margin-left: 4px; }
        .truck-form { display: grid; gap: 14px; }
        .form-shell { display: grid; grid-template-columns: 210px minmax(0, 1fr); gap: 14px; align-items: start; }
        .steps-panel { position: sticky; top: 14px; border-radius: 18px; background: #1f2327; border: 1px solid #343a40; box-shadow: 0 10px 22px rgba(0,0,0,.14); padding: 12px; }
        .vehicle-type { display: grid; gap: 3px; padding: 10px; border-radius: 14px; background: #15181b; border: 1px solid #343a40; margin-bottom: 10px; }
        .vehicle-type small { color: #8f99a3; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .04em; }
        .vehicle-type strong { color: #f4f4f5; font-size: 16px; line-height: 1.1; }
        .steps-nav { display: grid; gap: 7px; }
        .steps-nav a { display: flex; gap: 9px; align-items: center; padding: 9px; border-radius: 13px; color: #d8dee6; text-decoration: none; border: 1px solid transparent; background: #171a1d; }
        .steps-nav a:hover { border-color: #22c55e; background: #19211d; }
        .steps-nav a > span { width: 26px; height: 26px; border-radius: 9px; display: grid; place-items: center; background: #22c55e; color: #06140b; font-size: 12px; font-weight: 950; flex: 0 0 auto; }
        .steps-nav strong { display: block; font-size: 12px; line-height: 1.1; }
        .steps-nav small { display: block; margin-top: 2px; color: #8f99a3; font-size: 10px; font-weight: 800; line-height: 1.15; }
        .form-main { display: grid; gap: 14px; min-width: 0; }
        .form-section, .preview-box, .form-footer { border-radius: 18px; background: #1f2327; border: 1px solid #343a40; box-shadow: 0 10px 22px rgba(0,0,0,.14); scroll-margin-top: 16px; }
        .ai-section, .upload-section { background: #1f2327; }
        .form-section { padding: 18px; }
        .section-head { display: flex; gap: 11px; align-items: flex-start; margin-bottom: 14px; }
        .section-head span { width: 32px; height: 32px; border-radius: 11px; display: grid; place-items: center; background: #22c55e; color: #06140b; font-size: 12px; font-weight: 950; flex: 0 0 auto; }
        .section-head h2 { margin: 0 0 3px; font-size: 18px; line-height: 1.15; letter-spacing: -.025em; color: #f4f4f5; }
        .section-head p { margin: 0; color: #a7afb7; font-size: 13px; line-height: 1.35; }
        .compact-head { margin-bottom: 12px; }
        .ai-grid { display: grid; grid-template-columns: minmax(0, 1fr) 220px; gap: 12px; align-items: end; }
        .form-grid { display: grid; gap: 12px; }
        .form-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .form-grid.two { grid-template-columns: .8fr 1.2fr; }
        label { display: grid; gap: 6px; color: #cbd5df; font-size: 12px; font-weight: 900; }
        label small { color: #8f99a3; line-height: 1.35; font-weight: 700; }
        input, select, textarea { width: 100%; min-height: 44px; border-radius: 12px; border: 1px solid #343a40; background: #15181b; color: #e8eaed; padding: 0 12px; outline: none; box-sizing: border-box; font-size: 14px; }
        input::placeholder, textarea::placeholder { color: #6f7983; }
        textarea { min-height: 92px; resize: vertical; padding-top: 11px; line-height: 1.45; }
        input:focus, select:focus, textarea:focus { border-color: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,.10); }
        input[readonly] { color: #a7afb7; background: #111417; cursor: default; }
        select option { background: #15181b; color: #e8eaed; }
        .wide { min-width: 0; }
        .description-field { grid-column: span 2; }
        .review-section { display: grid; gap: 12px; scroll-margin-top: 16px; }
        .preview-box { padding: 13px 15px; display: flex; gap: 8px; flex-wrap: wrap; color: #a7afb7; font-size: 13px; }
        .preview-box strong { color: #22c55e; }
        .form-footer { padding: 15px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .form-footer p { margin: 0; color: #a7afb7; font-size: 13px; line-height: 1.4; }
        .form-footer button { min-height: 46px; border: 0; padding: 0 16px; border-radius: 13px; background: #22c55e; color: #06140b; font-weight: 950; cursor: pointer; }
        @media (max-width: 980px) {
          .form-shell { grid-template-columns: 1fr; }
          .steps-panel { position: static; }
          .vehicle-type { display: flex; justify-content: space-between; align-items: center; }
          .steps-nav { display: flex; overflow-x: auto; gap: 8px; padding-bottom: 3px; scroll-snap-type: x mandatory; }
          .steps-nav a { min-width: 132px; scroll-snap-align: start; }
          .form-grid.three, .form-grid.two, .ai-grid { grid-template-columns: 1fr; }
          .description-field { grid-column: auto; }
          .olx-banner { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 560px) {
          .truck-form, .form-main { gap: 12px; }
          .form-section { padding: 14px; border-radius: 16px; }
          .steps-panel { border-radius: 16px; padding: 10px; }
          .steps-nav a { min-width: 118px; padding: 8px; }
          .steps-nav small { display: none; }
          .section-head { gap: 9px; margin-bottom: 12px; }
          .section-head h2 { font-size: 16px; }
          .section-head p { font-size: 12px; }
          .form-footer button, .secondary-button { width: 100%; }
        }
      `}</style>
    </PanelLayout>
  );
}
