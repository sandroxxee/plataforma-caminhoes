"use client";

import Link from "next/link";
import { useState } from "react";
import { PanelLayout } from "@/components/PanelLayout";
import { WatermarkPhotoUploader } from "@/components/WatermarkPhotoUploader";
import { AutoFillTruckButton } from "@/components/AutoFillTruckButton";
import { criarAnuncio } from "../../actions";

const estados = ["SC", "PR", "RS", "SP", "MG", "MS", "MT", "GO", "BA", "RJ", "ES", "Outro"];

const MAQUINA_TIPOS = [
  "Escavadeira hidráulica", "Motoniveladora", "Pá carregadeira",
  "Retroescavadeira", "Trator agrícola", "Trator de esteira",
  "Compactador", "Miniescavadeira", "Minicarregadeira (skid steer)",
  "Guindaste", "Plataforma elevatoria", "Rolo compactador",
  "Perfuratriz", "Outro",
];

const MAQUINA_MARCAS = [
  "Caterpillar", "Komatsu", "Volvo", "Liebherr", "Doosan",
  "Hitachi", "John Deere", "Case", "New Holland", "Hyundai",
  "Kubota", "JCB", "Manitou", "Atlas Copco", "Terex", "Outra",
];

const CONSERVACOES = ["Novo", "Semi-novo", "Bom", "Regular", "Para reparo"];

type Campos = {
  tipo_implemento: string;
  implemento_marca: string;
  implemento_modelo: string;
  implemento_ano: string;
  conservacao: string;
  preco: string;
  cidade: string;
  estado: string;
  whatsapp: string;
  descricao: string;
};

export default function NovoMaquinaPage() {
  const [campos, setCampos] = useState<Campos>({
    tipo_implemento: "",
    implemento_marca: "",
    implemento_modelo: "",
    implemento_ano: "",
    conservacao: "",
    preco: "",
    cidade: "",
    estado: "SC",
    whatsapp: "",
    descricao: "",
  });

  function handleFill(s: Partial<Record<string, string>>) {
    setCampos((prev) => ({
      tipo_implemento: s.carroceria && MAQUINA_TIPOS.includes(s.carroceria) ? s.carroceria : prev.tipo_implemento,
      implemento_marca: s.marca && MAQUINA_MARCAS.includes(s.marca) ? s.marca : prev.implemento_marca,
      implemento_modelo: s.modelo || prev.implemento_modelo,
      implemento_ano: s.ano || prev.implemento_ano,
      conservacao: prev.conservacao,
      preco: s.preco || prev.preco,
      cidade: s.cidade || prev.cidade,
      estado: s.estado && estados.includes(s.estado) ? s.estado : prev.estado,
      whatsapp: s.whatsapp || prev.whatsapp,
      descricao: s.descricao || prev.descricao,
    }));
  }

  return (
    <PanelLayout
      title="Anunciar máquina"
      subtitle="Preencha os dados da máquina e envie para aprovação."
      badge="Nova máquina"
      actions={<Link href="/painel/anuncios/novo" className="secondary-button">Trocar tipo de anúncio</Link>}
    >
      <form action={criarAnuncio} className="truck-form" encType="multipart/form-data">
        <input type="hidden" name="tipo_anuncio" value="Máquinas" />

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
                placeholder="Cole aqui a descrição da máquina. Ex: Caterpillar 320D 2018, 8500 horas, SP, R$ 380.000"
              />
            </label>
            <AutoFillTruckButton onFill={handleFill} />
          </div>
        </section>

        <section className="form-section">
          <div className="section-head">
            <span>01</span>
            <div>
              <h2>Dados da máquina</h2>
              <p>Informe tipo, marca, modelo, ano e conservação.</p>
            </div>
          </div>

          <div className="form-grid three">
            <label>
              Tipo de máquina *
              <select name="tipo_implemento" value={campos.tipo_implemento} onChange={(e) => setCampos((p) => ({ ...p, tipo_implemento: e.target.value }))} required>
                <option value="" disabled>Selecione o tipo</option>
                {MAQUINA_TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>

            <label>
              Marca *
              <select name="implemento_marca" value={campos.implemento_marca} onChange={(e) => setCampos((p) => ({ ...p, implemento_marca: e.target.value }))} required>
                <option value="" disabled>Selecione a marca</option>
                {MAQUINA_MARCAS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>

            <label>
              Modelo / versão *
              <input name="implemento_modelo" placeholder="Ex: 320D, 950K, 120M" value={campos.implemento_modelo} onChange={(e) => setCampos((p) => ({ ...p, implemento_modelo: e.target.value }))} />
            </label>

            <label>
              Ano *
              <input name="implemento_ano" type="number" placeholder="Ex: 2019" value={campos.implemento_ano} onChange={(e) => setCampos((p) => ({ ...p, implemento_ano: e.target.value }))} />
            </label>

            <label>
              Horímetro (horas) <span className="optional-tag">(opcional)</span>
              <input name="quilometragem" type="number" placeholder="Ex: 8500" />
              <small>Horas trabalhadas. Deixe em branco se não souber.</small>
            </label>

            <label>
              Conservação *
              <select name="conservacao" value={campos.conservacao} onChange={(e) => setCampos((p) => ({ ...p, conservacao: e.target.value }))} required>
                <option value="" disabled>Selecione</option>
                {CONSERVACOES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="form-section">
          <div className="section-head">
            <span>02</span>
            <div>
              <h2>Valor e localização</h2>
              <p>Esses dados ajudam o comprador a decidir rapidamente.</p>
            </div>
          </div>
          <div className="form-grid three">
            <label>
              Valor *
              <input name="preco" type="number" placeholder="Ex: 320000" value={campos.preco} onChange={(e) => setCampos((p) => ({ ...p, preco: e.target.value }))} required />
            </label>
            <label>
              Cidade <span className="optional-tag">(opcional)</span>
              <input name="cidade" placeholder="Ex: Curitiba" value={campos.cidade} onChange={(e) => setCampos((p) => ({ ...p, cidade: e.target.value }))} />
            </label>
            <label>
              Estado *
              <select name="estado" value={campos.estado} onChange={(e) => setCampos((p) => ({ ...p, estado: e.target.value }))} required>
                {estados.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="form-section">
          <div className="section-head">
            <span>03</span>
            <div>
              <h2>Contato e descrição</h2>
              <p>Informe um WhatsApp válido e uma descrição objetiva.</p>
            </div>
          </div>
          <div className="form-grid two">
            <label>
              WhatsApp *
              <input name="whatsapp" placeholder="Ex: 5549999362681" value={campos.whatsapp} onChange={(e) => setCampos((p) => ({ ...p, whatsapp: e.target.value }))} required />
              <small>DDI + DDD + número. Exemplo: 5549999999999</small>
            </label>
            <label className="wide">
              Descrição
              <textarea name="descricao" placeholder="Ex: Escavadeira em ótimo estado, revisada, pronta para trabalhar." value={campos.descricao} onChange={(e) => setCampos((p) => ({ ...p, descricao: e.target.value }))} />
            </label>
          </div>
        </section>

        <section className="form-section upload-section">
          <div className="section-head">
            <span>04</span>
            <div>
              <h2>Fotos da máquina</h2>
              <p>As fotos serão preparadas com a marca d’água www.caminhoesavenda.com antes do envio.</p>
            </div>
          </div>
          <WatermarkPhotoUploader />
        </section>

        <footer className="form-footer">
          <p>Ao enviar, o anúncio fica pendente até aprovação do administrador.</p>
          <button type="submit">Enviar máquina para aprovação</button>
        </footer>
      </form>

      <style>{`
        .secondary-button { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; padding: 0 14px; border-radius: 14px; border: 1px solid #343a40; background: #2a2f34; color: #e8eaed; text-decoration: none; font-weight: 900; }
        .optional-tag { color: #8f99a3; font-weight: 700; font-size: 11px; margin-left: 4px; }
        .truck-form { display: grid; gap: 18px; }
        .form-section, .form-footer { border-radius: 24px; background: #1f2327; border: 1px solid #343a40; box-shadow: 0 16px 34px rgba(0,0,0,.18); }
        .ai-section { background: #1a2535; border-color: #2563eb44; }
        .form-section { padding: 24px; }
        .section-head { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 20px; }
        .compact-head { margin-bottom: 14px; }
        .section-head span { width: 40px; height: 40px; border-radius: 14px; display: grid; place-items: center; background: #22c55e; color: #06140b; font-weight: 950; flex: 0 0 auto; }
        .section-head h2 { margin: 0 0 5px; font-size: 22px; line-height: 1.1; letter-spacing: -.035em; color: #f4f4f5; }
        .section-head p { margin: 0; color: #a7afb7; line-height: 1.45; }
        .ai-grid { display: grid; grid-template-columns: minmax(0,1fr) 220px; gap: 12px; align-items: end; }
        .form-grid { display: grid; gap: 16px; }
        .form-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .form-grid.two { grid-template-columns: .8fr 1.2fr; }
        label { display: grid; gap: 8px; color: #cbd5df; font-size: 13px; font-weight: 900; }
        label small { color: #8f99a3; line-height: 1.45; font-weight: 700; }
        input, select, textarea { width: 100%; min-height: 50px; border-radius: 15px; border: 1px solid #343a40; background: #15181b; color: #e8eaed; padding: 0 14px; outline: none; box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #6f7983; }
        textarea { min-height: 130px; resize: vertical; padding-top: 13px; line-height: 1.5; }
        input:focus, select:focus, textarea:focus { border-color: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,.12); }
        select option { background: #15181b; color: #e8eaed; }
        .wide { min-width: 0; }
        .form-footer { padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
        .form-footer p { margin: 0; color: #a7afb7; line-height: 1.55; }
        .form-footer button { min-height: 52px; border: 0; padding: 0 20px; border-radius: 16px; background: #22c55e; color: #06140b; font-weight: 950; cursor: pointer; }
        @media (max-width: 980px) { .form-grid.three, .form-grid.two, .ai-grid { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .form-section { padding: 18px; border-radius: 20px; } .section-head { display: grid; } .form-footer button, .secondary-button { width: 100%; } }
      `}</style>
    </PanelLayout>
  );
}
