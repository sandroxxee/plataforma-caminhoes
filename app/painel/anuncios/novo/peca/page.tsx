import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { WatermarkPhotoUploader } from "@/components/WatermarkPhotoUploader";
import { Input, Select, Textarea, Card, StepIndicator } from "@/components/ui";
import { criarAnuncio } from "../../actions";

export const dynamic = "force-dynamic";

const estados = ["SC", "PR", "RS", "SP", "MG", "MS", "MT", "GO", "BA", "RJ", "ES", "Outro"];

const PECA_CATEGORIAS = [
  "Motor", "Câmbio", "Eixo", "Suspensão", "Freios",
  "Elétrica / Eletrônica", "Cabine / Lataria", "Escape",
  "Bomba hidráulica", "Turbo / Compressor", "Diferencial",
  "Embreagem", "Direção", "Refrigéração", "Pneu / Roda",
  "Outro",
];

const PECA_MARCAS = [
  "Mercedes-Benz", "Scania", "Volvo", "MAN", "Iveco",
  "DAF", "Renault", "Ford", "Volkswagen", "Randon",
  "Suspensys", "Guerra", "Outra",
];

const CONSERVACOES = ["Novo", "Semi-novo (usado em bom estado)", "Para reparo / Peças"];

export default async function NovoPecaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <PanelLayout
      title="Anunciar peça"
      subtitle="Preencha os dados da peça e envie para aprovação."
      badge="Nova peça"
      actions={<Link href="/painel/anuncios/novo" className="secondary-button">Trocar tipo de anúncio</Link>}
    >
      <form action={criarAnuncio} className="truck-form" encType="multipart/form-data">
        <input type="hidden" name="tipo_anuncio" value="Peças" />

        {/* STEP INDICATOR */}
        <StepIndicator activeIndex={0} />

        {/* CARD DADOS */}
        <Card title="📋 Dados da peça" subtitle="Informe categoria, marca compatível, descrição e conservação.">
          <div className="painel-group">
            <Select
              name="tipo_implemento"
              label="Categoria *"
              emptyOptionText="Selecione a categoria"
              options={PECA_CATEGORIAS}
              defaultValue=""
              required
            />

            <Select
              name="implemento_marca"
              label="Marca compatível *"
              emptyOptionText="Selecione a marca"
              options={PECA_MARCAS}
              defaultValue=""
              required
            />

            <Input
              name="implemento_modelo"
              label="Modelo / referência *"
              placeholder="Ex: OM 457, G330, D13"
              required
            />

            <Input
              name="implemento_ano"
              type="number"
              label="Ano compatível"
              optional
              placeholder="Ex: 2015"
            />

            <Select
              name="conservacao"
              label="Conservação *"
              emptyOptionText="Selecione"
              options={CONSERVACOES}
              defaultValue=""
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
              placeholder="Ex: 4500"
              required
            />

            <Input
              name="cidade"
              label="Cidade"
              optional
              placeholder="Ex: Londrina"
            />

            <Select
              name="estado"
              label="Estado *"
              options={estados}
              defaultValue="SC"
              required
            />
          </div>
        </Card>

        {/* CARD CONTATO */}
        <Card title="📞 Contato e descrição" subtitle="Informe um WhatsApp válido e uma descrição objetiva da peça.">
          <div className="painel-group">
            <div style={{ gridColumn: "span 3" }}>
              <Input
                name="whatsapp"
                label="WhatsApp *"
                placeholder="Ex: 5549999362681"
                helper="DDI + DDD + número. Exemplo: 5549999999999"
                required
              />
            </div>

            <div style={{ gridColumn: "span 3" }}>
              <Textarea
                name="descricao"
                label="Descrição"
                placeholder="Ex: Motor OM 457 retirado de truck 2016, baixa quilometragem, sem vazamentos."
              />
            </div>
          </div>
        </Card>

        {/* CARD FOTOS */}
        <Card title="📸 Fotos da peça" subtitle="As fotos serão preparadas com a marca d’água www.caminhoesavenda.com antes do envio.">
          <WatermarkPhotoUploader />
        </Card>

        {/* BOTÃO SUBMIT */}
        <footer className="form-footer">
          <p>Ao enviar, o anúncio fica pendente até aprovação do administrador.</p>
          <button type="submit">Enviar peça para aprovação</button>
        </footer>
      </form>
    </PanelLayout>
  );
}
