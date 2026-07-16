"use client";

import Link from "next/link";
import { PanelLayout } from "@/components/PanelLayout";
import { WatermarkPhotoUploader } from "@/components/WatermarkPhotoUploader";
import { AutoFillTruckButton, SugestaoAnuncio } from "@/components/AutoFillTruckButton";
import { Input, Select, Textarea, Card, StepIndicator } from "@/components/ui";
import { useFormState } from "@/hooks/useFormState";
import { criarAnuncio } from "../../actions";

const estados = ["SC", "PR", "RS", "SP", "MG", "MS", "MT", "GO", "BA", "RJ", "ES", "Outro"];

const CARRETA_TIPOS = [
  "Graneleira", "Porta-contêiner", "Prancha", "Frigorífica",
  "Tanque", "Sider", "Baú", "Caçamba", "Dolly",
  "Plataforma", "Cegonheiro", "Florestal", "Outra",
];

const CARRETA_MARCAS = [
  "Randon", "Guerra", "Noma", "Librelato", "Facchini",
  "Krone", "Triel", "Rodovale", "São Paulo Implementos",
  "Brascontainer", "Outra",
];

const EIXOS = ["1 eixo", "2 eixos", "3 eixos", "4 eixos", "Outra"];
const CONSERVACOES = ["Novo", "Semi-novo", "Bom", "Regular", "Para reparo"];

type Campos = {
  tipo_implemento: string;
  implemento_marca: string;
  implemento_modelo: string;
  implemento_ano: string;
  numero_eixos: string;
  conservacao: string;
  preco: string;
  cidade: string;
  estado: string;
  whatsapp: string;
  descricao: string;
};

export default function NovaCarretaPage() {
  const { campos, setCampo, setCamposMassa } = useFormState<Campos>({
    tipo_implemento: "",
    implemento_marca: "",
    implemento_modelo: "",
    implemento_ano: "",
    numero_eixos: "",
    conservacao: "",
    preco: "",
    cidade: "",
    estado: "SC",
    whatsapp: "",
    descricao: "",
  });

  function handleFill(s: SugestaoAnuncio) {
    setCamposMassa({
      tipo_implemento: s.carroceria && CARRETA_TIPOS.includes(s.carroceria) ? s.carroceria : campos.tipo_implemento,
      implemento_marca: s.marca && CARRETA_MARCAS.includes(s.marca) ? s.marca : campos.implemento_marca,
      implemento_modelo: s.modelo || campos.implemento_modelo,
      implemento_ano: s.ano || campos.implemento_ano,
      preco: s.preco || campos.preco,
      cidade: s.cidade || campos.cidade,
      estado: s.estado && estados.includes(s.estado) ? s.estado : campos.estado,
      whatsapp: s.whatsapp || campos.whatsapp,
      descricao: s.descricao || campos.descricao,
    });
  }

  return (
    <PanelLayout
      title="Anunciar carreta"
      subtitle="Preencha os dados da carreta e envie para aprovação."
      badge="Nova carreta"
      actions={<Link href="/painel/anuncios/novo" className="secondary-button">Trocar tipo de anúncio</Link>}
    >
      <form action={criarAnuncio} className="truck-form" encType="multipart/form-data">
        <input type="hidden" name="tipo_anuncio" value="Carretas" />

        {/* STEP INDICATOR */}
        <StepIndicator activeIndex={0} />

        {/* CARD IA */}
        <Card
          title="🤖 Importar com IA"
          subtitle="Cole o texto do anúncio — OLX, Facebook Marketplace, WhatsApp ou qualquer fonte. A IA preenche os campos automaticamente."
          style={{ border: "2px solid #c084fc", background: "var(--bg-card)" }}
          titleStyle={{ color: "#a855f7" }}
        >
          <div className="ai-grid">
            <Textarea
              name="texto_ia"
              label="Texto do anúncio"
              placeholder="Cole aqui a descrição da carreta (OLX, Facebook Marketplace, WhatsApp...). Ex: Randon graneleira 3 eixos 2020, pneus bons, SP, R$ 95.000"
            />
            <AutoFillTruckButton onFill={handleFill} />
          </div>
        </Card>

        {/* CARD DADOS */}
        <Card title="📋 Dados da carreta" subtitle="Informe tipo, marca, eixos, ano e conservação.">
          <div className="painel-group">
            <Select
              name="tipo_implemento"
              label="Tipo de carreta *"
              emptyOptionText="Selecione o tipo"
              options={CARRETA_TIPOS}
              value={campos.tipo_implemento}
              onChange={(e) => setCampo("tipo_implemento", e.target.value)}
              required
            />

            <Select
              name="implemento_marca"
              label="Marca *"
              emptyOptionText="Selecione a marca"
              options={CARRETA_MARCAS}
              value={campos.implemento_marca}
              onChange={(e) => setCampo("implemento_marca", e.target.value)}
              required
            />

            <Input
              name="implemento_modelo"
              label="Modelo / versão *"
              placeholder="Ex: Graneleira LS 3 eixos"
              value={campos.implemento_modelo}
              onChange={(e) => setCampo("implemento_modelo", e.target.value)}
            />

            <Input
              name="implemento_ano"
              type="number"
              label="Ano *"
              placeholder="Ex: 2020"
              value={campos.implemento_ano}
              onChange={(e) => setCampo("implemento_ano", e.target.value)}
            />

            <Select
              name="numero_eixos"
              label="Número de eixos *"
              emptyOptionText="Selecione"
              options={EIXOS}
              value={campos.numero_eixos}
              onChange={(e) => setCampo("numero_eixos", e.target.value)}
              required
            />

            <Select
              name="conservacao"
              label="Conservação *"
              emptyOptionText="Selecione"
              options={CONSERVACOES}
              value={campos.conservacao}
              onChange={(e) => setCampo("conservacao", e.target.value)}
              required
            />
          </div>
        </Card>

        {/* CARD LOCALIZAÇÃO */}
        <Card title="📍 Valor e localização" subtitle="Esses dados ajudam o comprador a decidir rapidamente.">
          <div className="painel-group">
            <Input
              name="preco"
              type="number"
              label="Valor *"
              placeholder="Ex: 95000"
              value={campos.preco}
              onChange={(e) => setCampo("preco", e.target.value)}
              required
            />

            <Input
              name="cidade"
              label="Cidade"
              optional
              placeholder="Ex: Cascavel"
              value={campos.cidade}
              onChange={(e) => setCampo("cidade", e.target.value)}
            />

            <Select
              name="estado"
              label="Estado *"
              options={estados}
              value={campos.estado}
              onChange={(e) => setCampo("estado", e.target.value)}
              required
            />
          </div>
        </Card>

        {/* CARD CONTATO */}
        <Card title="📞 Contato e descrição" subtitle="Informe um WhatsApp válido e uma descrição objetiva.">
          <div className="painel-group">
            <div style={{ gridColumn: "span 3" }}>
              <Input
                name="whatsapp"
                label="WhatsApp *"
                placeholder="Ex: 5549999362681"
                value={campos.whatsapp}
                onChange={(e) => setCampo("whatsapp", e.target.value)}
                helper="DDI + DDD + número. Exemplo: 5549999999999"
                required
              />
            </div>

            <div style={{ gridColumn: "span 3" }}>
              <Textarea
                name="descricao"
                label="Descrição"
                placeholder="Ex: Graneleira Randon 3 eixos 2020, pneus bons, documentos em dia."
                value={campos.descricao}
                onChange={(e) => setCampo("descricao", e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* CARD FOTOS */}
        <Card title="📸 Fotos da carreta" subtitle="As fotos serão preparadas com a marca d’água antes do envio.">
          <WatermarkPhotoUploader />
        </Card>

        {/* BOTÃO SUBMIT */}
        <footer className="form-footer">
          <p>Ao enviar, o anúncio fica pendente até aprovação do administrador.</p>
          <button type="submit">Enviar carreta para aprovação</button>
        </footer>
      </form>
    </PanelLayout>
  );
}
