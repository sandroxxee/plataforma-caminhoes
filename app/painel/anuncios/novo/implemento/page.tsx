"use client";

import Link from "next/link";
import { PanelLayout } from "@/components/PanelLayout";
import { WatermarkPhotoUploader } from "@/components/WatermarkPhotoUploader";
import { AutoFillTruckButton, SugestaoAnuncio } from "@/components/AutoFillTruckButton";
import { Input, Select, Textarea, Card, StepIndicator } from "@/components/ui";
import { useFormState } from "@/hooks/useFormState";
import {
  IMPLEMENTO_COMPOSICOES,
  IMPLEMENTO_CONSERVACOES,
  IMPLEMENTO_EIXOS,
  IMPLEMENTO_MARCAS,
  IMPLEMENTO_PNEUS,
  IMPLEMENTO_SUSPENSOES,
  IMPLEMENTO_TIPOS,
} from "@/lib/implementos";
import { criarAnuncio } from "../../actions";

const estados = ["SC", "PR", "RS", "SP", "MG", "MS", "MT", "GO", "BA", "RJ", "ES", "Outro"];

type Campos = {
  tipo_implemento: string;
  implemento_marca: string;
  implemento_modelo: string;
  implemento_ano: string;
  numero_eixos: string;
  composicao: string;
  pneus: string;
  suspensao: string;
  conservacao: string;
  preco: string;
  cidade: string;
  estado: string;
  whatsapp: string;
  descricao: string;
};

export default function NovoImplementoPage() {
  const { campos, setCampo, setCamposMassa } = useFormState<Campos>({
    tipo_implemento: "",
    implemento_marca: "",
    implemento_modelo: "",
    implemento_ano: "",
    numero_eixos: "",
    composicao: "",
    pneus: "",
    suspensao: "",
    conservacao: "",
    preco: "",
    cidade: "",
    estado: "SC",
    whatsapp: "",
    descricao: "",
  });

  const marcasNomes = IMPLEMENTO_MARCAS.map((m) => m.nome);
  const tiposNomes = IMPLEMENTO_TIPOS.map((t) => t.nome);

  function handleFill(s: SugestaoAnuncio) {
    setCamposMassa({
      tipo_implemento: s.carroceria && tiposNomes.includes(s.carroceria) ? s.carroceria : campos.tipo_implemento,
      implemento_marca: s.marca && marcasNomes.includes(s.marca) ? s.marca : campos.implemento_marca,
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
      title="Anunciar implemento"
      subtitle="Cadastro separado para implementos. Preencha os dados do equipamento e envie para aprovação."
      badge="Novo implemento"
      actions={<Link href="/painel/anuncios/novo" className="secondary-button">Trocar tipo de anúncio</Link>}
    >
      <form action={criarAnuncio} className="truck-form" encType="multipart/form-data">
        <input type="hidden" name="tipo_anuncio" value="Implemento" />

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
              placeholder="Cole aqui a descrição do implemento. Ex: Randon graneleira 3 eixos 2019, pneus bons, PR, R$ 85.000"
            />
            <AutoFillTruckButton onFill={handleFill} />
          </div>
        </Card>

        {/* CARD DADOS */}
        <Card title="📋 Dados do implemento" subtitle="Informe tipo, marca, modelo, ano, eixos e condições principais do implemento.">
          <div className="painel-group">
            <Select
              name="tipo_implemento"
              label="Tipo de implemento *"
              emptyOptionText="Selecione o tipo"
              options={IMPLEMENTO_TIPOS.map((tipo) => ({ value: tipo.nome, label: tipo.nome }))}
              value={campos.tipo_implemento}
              onChange={(e) => setCampo("tipo_implemento", e.target.value)}
              required
            />

            <Select
              name="implemento_marca"
              label="Marca do implemento *"
              emptyOptionText="Selecione a marca"
              options={IMPLEMENTO_MARCAS.map((marca) => ({ value: marca.nome, label: marca.nome }))}
              value={campos.implemento_marca}
              onChange={(e) => setCampo("implemento_marca", e.target.value)}
              required
            />

            <Input
              name="implemento_modelo"
              label="Modelo / versão *"
              placeholder="Ex: Basculante meia-cana, LS, graneleira"
              value={campos.implemento_modelo}
              onChange={(e) => setCampo("implemento_modelo", e.target.value)}
            />

            <Input
              name="implemento_ano"
              type="number"
              label="Ano do implemento *"
              placeholder="Ex: 2020"
              value={campos.implemento_ano}
              onChange={(e) => setCampo("implemento_ano", e.target.value)}
            />

            <Select
              name="numero_eixos"
              label="Número de eixos *"
              emptyOptionText="Selecione"
              options={IMPLEMENTO_EIXOS.map((eixo) => ({ value: eixo.nome, label: eixo.nome }))}
              value={campos.numero_eixos}
              onChange={(e) => setCampo("numero_eixos", e.target.value)}
              required
            />

            <Select
              name="composicao"
              label="Composição"
              optional
              emptyOptionText="Selecione"
              options={IMPLEMENTO_COMPOSICOES.map((c) => ({ value: c.nome, label: c.nome }))}
              value={campos.composicao}
              onChange={(e) => setCampo("composicao", e.target.value)}
            />

            <Select
              name="pneus"
              label="Pneus *"
              emptyOptionText="Selecione"
              options={IMPLEMENTO_PNEUS.map((p) => ({ value: p.nome, label: p.nome }))}
              value={campos.pneus}
              onChange={(e) => setCampo("pneus", e.target.value)}
              required
            />

            <Select
              name="suspensao"
              label="Suspensão"
              optional
              emptyOptionText="Selecione"
              options={IMPLEMENTO_SUSPENSOES.map((s) => ({ value: s.nome, label: s.nome }))}
              value={campos.suspensao}
              onChange={(e) => setCampo("suspensao", e.target.value)}
            />

            <Select
              name="conservacao"
              label="Conservação *"
              emptyOptionText="Selecione"
              options={IMPLEMENTO_CONSERVACOES.map((c) => ({ value: c.nome, label: c.nome }))}
              value={campos.conservacao}
              onChange={(e) => setCampo("conservacao", e.target.value)}
              required
            />

            <Input
              name="quilometragem"
              type="number"
              label="Quilometragem"
              optional
              placeholder="Ex: 380000"
              helper="Em km. Deixe em branco se não souber."
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
              placeholder="Ex: 180000"
              value={campos.preco}
              onChange={(e) => setCampo("preco", e.target.value)}
              required
            />

            <Input
              name="cidade"
              label="Cidade"
              optional
              placeholder="Ex: Xanxerê"
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
                helper="Use DDI + DDD + número. Exemplo: 5549999999999"
                required
              />
            </div>

            <div style={{ gridColumn: "span 3" }}>
              <Textarea
                name="descricao"
                label="Descrição"
                placeholder="Ex: Caçamba conservada, pneus bons, pronta para trabalhar."
                value={campos.descricao}
                onChange={(e) => setCampo("descricao", e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* CARD FOTOS */}
        <Card title="📸 Fotos do implemento" subtitle="As fotos serão preparadas com a marca d’água antes do envio.">
          <WatermarkPhotoUploader />
        </Card>

        <div className="preview-box">
          <strong>Prévia do título automático:</strong>
          <span>Marca + Modelo + Tipo + Eixos + Ano</span>
        </div>

        {/* BOTÃO SUBMIT */}
        <footer className="form-footer">
          <p>Ao enviar, o anúncio fica pendente até aprovação do administrador.</p>
          <button type="submit">Enviar implemento para aprovação</button>
        </footer>
      </form>
    </PanelLayout>
  );
}
