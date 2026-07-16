"use client";

import Link from "next/link";
import { PanelLayout } from "@/components/PanelLayout";
import { WatermarkPhotoUploader } from "@/components/WatermarkPhotoUploader";
import { AutoFillTruckButton, SugestaoAnuncio } from "@/components/AutoFillTruckButton";
import { Input, Select, Textarea, Card, StepIndicator } from "@/components/ui";
import { useFormState } from "@/hooks/useFormState";
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
  const { campos, setCampo, setCamposMassa } = useFormState<Campos>({
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

  function handleFill(s: SugestaoAnuncio) {
    setCamposMassa({
      tipo_implemento: s.carroceria && MAQUINA_TIPOS.includes(s.carroceria) ? s.carroceria : campos.tipo_implemento,
      implemento_marca: s.marca && MAQUINA_MARCAS.includes(s.marca) ? s.marca : campos.implemento_marca,
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
      title="Anunciar máquina"
      subtitle="Preencha os dados da máquina e envie para aprovação."
      badge="Nova máquina"
      actions={<Link href="/painel/anuncios/novo" className="secondary-button">Trocar tipo de anúncio</Link>}
    >
      <form action={criarAnuncio} className="truck-form" encType="multipart/form-data">
        <input type="hidden" name="tipo_anuncio" value="Máquinas" />

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
              placeholder="Cole aqui a descrição da máquina. Ex: Caterpillar 320D 2018, 8500 horas, SP, R$ 380.000"
            />
            <AutoFillTruckButton onFill={handleFill} />
          </div>
        </Card>

        {/* CARD DADOS */}
        <Card title="📋 Dados da máquina" subtitle="Informe tipo, marca, modelo, ano e conservação.">
          <div className="painel-group">
            <Select
              name="tipo_implemento"
              label="Tipo de máquina *"
              emptyOptionText="Selecione o tipo"
              options={MAQUINA_TIPOS}
              value={campos.tipo_implemento}
              onChange={(e) => setCampo("tipo_implemento", e.target.value)}
              required
            />

            <Select
              name="implemento_marca"
              label="Marca *"
              emptyOptionText="Selecione a marca"
              options={MAQUINA_MARCAS}
              value={campos.implemento_marca}
              onChange={(e) => setCampo("implemento_marca", e.target.value)}
              required
            />

            <Input
              name="implemento_modelo"
              label="Modelo / versão *"
              placeholder="Ex: 320D, 950K, 120M"
              value={campos.implemento_modelo}
              onChange={(e) => setCampo("implemento_modelo", e.target.value)}
            />

            <Input
              name="implemento_ano"
              type="number"
              label="Ano *"
              placeholder="Ex: 2019"
              value={campos.implemento_ano}
              onChange={(e) => setCampo("implemento_ano", e.target.value)}
            />

            <Input
              name="quilometragem"
              type="number"
              label="Horímetro (horas)"
              optional
              placeholder="Ex: 8500"
              helper="Horas trabalhadas. Deixe em branco se não souber."
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
              placeholder="Ex: 320000"
              value={campos.preco}
              onChange={(e) => setCampo("preco", e.target.value)}
              required
            />

            <Input
              name="cidade"
              label="Cidade"
              optional
              placeholder="Ex: Curitiba"
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
                placeholder="Ex: Escavadeira em ótimo estado, revisada, pronta para trabalhar."
                value={campos.descricao}
                onChange={(e) => setCampo("descricao", e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* CARD FOTOS */}
        <Card title="📸 Fotos da máquina" subtitle="As fotos serão preparadas com a marca d’água antes do envio.">
          <WatermarkPhotoUploader />
        </Card>

        {/* BOTÃO SUBMIT */}
        <footer className="form-footer">
          <p>Ao enviar, o anúncio fica pendente até aprovação do administrador.</p>
          <button type="submit">Enviar máquina para aprovação</button>
        </footer>
      </form>
    </PanelLayout>
  );
}
