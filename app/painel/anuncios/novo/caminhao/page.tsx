"use client";

import Link from "next/link";
import { useRef } from "react";
import { PanelLayout } from "@/components/PanelLayout";
import { AutoFillTruckButton } from "@/components/AutoFillTruckButton";
import { TruckConfigurationFields } from "@/components/TruckConfigurationFields";
import { WatermarkPhotoUploader } from "@/components/WatermarkPhotoUploader";
import { ImportarOLX } from "@/components/ImportarOLX";
import { Input, Select, Textarea, Card, StepIndicator } from "@/components/ui";
import { useFormState } from "@/hooks/useFormState";
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
  video_url: string;
};

export default function NovoCaminhaoPage() {
  const formRef = useRef<HTMLFormElement>(null);

  const { campos, setCampo, setCamposMassa, limpar } = useFormState<Campos>({
    marca: "",
    modelo: "",
    ano: "",
    preco: "",
    cidade: "",
    estado: "SC",
    carroceria: "",
    whatsapp: "",
    descricao: "",
    video_url: "",
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
      .replace(/mercedes[-]?benz|scania|volvo|volkswagen|ford|iveco|daf/gi, "")
      .replace(/\d{4}/, "")
      .trim();

    setCamposMassa({
      modelo: modeloExtraido || campos.modelo,
      preco: dados.preco ? String(dados.preco) : campos.preco,
      cidade: dados.cidade || campos.cidade,
      estado: dados.estado || campos.estado,
      descricao: dados.descricao || campos.descricao,
    });
  }

  function handleFill(sugestao: Partial<Campos>) {
    setCamposMassa({
      marca: sugestao.marca && marcas.includes(sugestao.marca) ? sugestao.marca : campos.marca,
      modelo: sugestao.modelo || campos.modelo,
      ano: sugestao.ano || campos.ano,
      preco: sugestao.preco || campos.preco,
      cidade: sugestao.cidade || campos.cidade,
      estado: sugestao.estado && estados.includes(sugestao.estado) ? sugestao.estado : campos.estado,
      carroceria: sugestao.carroceria && carrocerias.includes(sugestao.carroceria) ? sugestao.carroceria : campos.carroceria,
      whatsapp: sugestao.whatsapp || campos.whatsapp,
      descricao: sugestao.descricao || campos.descricao,
      video_url: sugestao.video_url || campos.video_url,
    });
  }

  function handleLimpar() {
    limpar();
    if (formRef.current) {
      formRef.current.reset();
    }
  }

  return (
    <PanelLayout role="anunciante">
      <div className="painel-wrap" style={{ padding: "28px 0 64px" }}>

        {/* 1. CABEÇALHO INTEGRADO COM BOTÃO OLX */}
        <div className="painel-header" style={{ justifyContent: "flex-end", marginBottom: "16px" }}>
          <ImportarOLX onImportar={handleImportar} />
        </div>

        {/* 2. STEP INDICATOR */}
        <StepIndicator activeIndex={0} />

        {/* 3. FORMULÁRIO PRINCIPAL */}
        <form ref={formRef} action={criarAnuncio} className="truck-form" encType="multipart/form-data">
          <input type="hidden" name="tipo_anuncio" value="Caminhão" />

          {/* CARD A: DADOS DO CAMINHÃO */}
          <Card title="📋 Dados do caminhão" subtitle="Marca, modelo, ano, carroceria e configuração.">
            <div className="painel-group">
              <Select
                id="brand-select"
                name="marca"
                label="Marca do caminhão *"
                emptyOptionText="Selecione a marca"
                options={marcas}
                value={campos.marca}
                onChange={(e) => setCampo("marca", e.target.value)}
                required
              />

              <Select
                id="carroceria-select"
                name="carroceria"
                label="Carroceria *"
                emptyOptionText="Selecione a carroceria"
                options={carrocerias}
                value={campos.carroceria}
                onChange={(e) => setCampo("carroceria", e.target.value)}
                required
              />

              <Input
                id="modelo-input"
                name="modelo"
                label="Modelo do caminhão *"
                placeholder="Ex: 113, P420, FH 540"
                value={campos.modelo}
                onChange={(e) => setCampo("modelo", e.target.value)}
                required
              />

              <Input
                id="ano-input"
                name="ano"
                type="number"
                label="Ano do caminhão *"
                placeholder="Ex: 1995"
                value={campos.ano}
                onChange={(e) => setCampo("ano", e.target.value)}
                required
              />

              <TruckConfigurationFields />

              <Input
                id="km-input"
                name="quilometragem"
                type="number"
                label="Quilometragem"
                optional
                placeholder="Ex: 450000"
                helper="Em km. Deixe em branco se não souber."
              />
            </div>
          </Card>

          {/* CARD B: IMPORTAR COM IA */}
          <Card
            title="🤖 Importar com IA"
            subtitle="Cole o texto do anúncio – OLX, Facebook Marketplace, WhatsApp ou qualquer fonte. A IA preenche os campos automaticamente."
            style={{ border: "2px solid #c084fc", background: "var(--bg-card)" }}
            titleStyle={{ color: "#a855f7" }}
          >
            <Textarea
              id="ia-textarea"
              name="texto_ia"
              label="Texto do anúncio"
              rows={4}
              placeholder="Cole aqui a descrição do anúncio (OLX, Facebook Marketplace, WhatsApp...). Ex: Scania R440 6x4 ano 2018, com baú frigorífico, 680mil km, SP, R$ 320.000"
              style={{ background: "var(--soft)", borderColor: "#e9d5ff" }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <AutoFillTruckButton onFill={handleFill} />
            </div>
          </Card>

          {/* CARD C: FOTOS DO CAMINHÃO */}
          <Card title="📸 Fotos do caminhão" subtitle="Adicione fotos reais do veículo. A primeira será a principal do anúncio.">
            <WatermarkPhotoUploader />
          </Card>

          {/* CARD D: LOCALIZAÇÃO E CONTATO */}
          <Card title="📍 Localização e contato" subtitle="Valor, cidade, estado, WhatsApp e descrição detalhada.">
            <div className="painel-group">
              <Input
                id="preco-input"
                name="preco"
                type="number"
                label="Valor (R$) *"
                placeholder="Ex: 180000"
                value={campos.preco}
                onChange={(e) => setCampo("preco", e.target.value)}
                required
              />

              <Input
                id="cidade-input"
                name="cidade"
                label="Cidade"
                optional
                placeholder="Ex: Xanxerê"
                value={campos.cidade}
                onChange={(e) => setCampo("cidade", e.target.value)}
              />

              <Select
                id="estado-select"
                name="estado"
                label="Estado *"
                options={estados}
                value={campos.estado}
                onChange={(e) => setCampo("estado", e.target.value)}
                required
              />

              <Input
                id="whatsapp-input"
                name="whatsapp"
                label="WhatsApp de contato *"
                placeholder="Ex: 5549999362681"
                value={campos.whatsapp}
                onChange={(e) => setCampo("whatsapp", e.target.value)}
                helper="Use DDI + DDD + número (ex: 5549999362681)."
                required
              />

              <Input
                id="video-url-input"
                name="video_url"
                label="Vídeo de Funcionamento (Link do YouTube, TikTok ou Instagram)"
                optional
                placeholder="Ex: https://www.youtube.com/watch?v=..."
                value={campos.video_url}
                onChange={(e) => setCampo("video_url", e.target.value)}
                helper="Vídeo do motor ligado, cabine em movimento ou operação."
              />

              <div style={{ gridColumn: "span 3" }}>
                <Textarea
                  id="descricao-textarea"
                  name="descricao"
                  label="Descrição complementar"
                  placeholder="Mecânica em dia, pronto para trabalhar, pneus novos, único dono..."
                  value={campos.descricao}
                  onChange={(e) => setCampo("descricao", e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* BOTÕES DE AÇÃO FINAIS */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginTop: "2rem", 
            paddingTop: "1.5rem", 
            borderTop: "1px solid var(--line)",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <button type="button" onClick={handleLimpar} className="painel-btn" style={{ background: "var(--soft)" }}>
              🗑️ Limpar tudo
            </button>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/painel/anuncios" className="painel-btn painel-btn-outline">Cancelar</Link>
              <button type="submit" className="painel-btn painel-btn-primary" style={{ padding: "0.9rem 2.5rem" }}>
                ✅ Enviar para aprovação
              </button>
            </div>
          </div>

        </form>
      </div>
    </PanelLayout>
  );
}
