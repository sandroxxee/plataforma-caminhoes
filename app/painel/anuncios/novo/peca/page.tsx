import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { WatermarkPhotoUploader } from "@/components/WatermarkPhotoUploader";
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

        <section className="form-section">
          <div className="section-head">
            <span>01</span>
            <div>
              <h2>Dados da peça</h2>
              <p>Informe categoria, marca compatível, descrição e conservação.</p>
            </div>
          </div>

          <div className="form-grid three">
            <label>
              Categoria *
              <select name="tipo_implemento" defaultValue="">
                <option value="" disabled>Selecione a categoria</option>
                {PECA_CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>

            <label>
              Marca compatível *
              <select name="implemento_marca" defaultValue="">
                <option value="" disabled>Selecione a marca</option>
                {PECA_MARCAS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>

            <label>
              Modelo / referência *
              <input name="implemento_modelo" placeholder="Ex: OM 457, G330, D13" />
            </label>

            <label>
              Ano compatível <span className="optional-tag">(opcional)</span>
              <input name="implemento_ano" type="number" placeholder="Ex: 2015" />
            </label>

            <label>
              Conservação *
              <select name="conservacao" defaultValue="">
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
              <input name="preco" type="number" placeholder="Ex: 4500" />
            </label>
            <label>
              Cidade <span className="optional-tag">(opcional)</span>
              <input name="cidade" placeholder="Ex: Londrina" />
            </label>
            <label>
              Estado *
              <select name="estado" defaultValue="SC">
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
              <p>Informe um WhatsApp válido e uma descrição objetiva da peça.</p>
            </div>
          </div>
          <div className="form-grid two">
            <label>
              WhatsApp *
              <input name="whatsapp" placeholder="Ex: 5549999362681" />
              <small>DDI + DDD + número. Exemplo: 5549999999999</small>
            </label>
            <label className="wide">
              Descrição
              <textarea name="descricao" placeholder="Ex: Motor OM 457 retirado de truck 2016, baixa quilometragem, sem vazamentos." />
            </label>
          </div>
        </section>

        <section className="form-section upload-section">
          <div className="section-head">
            <span>04</span>
            <div>
              <h2>Fotos da peça</h2>
              <p>As fotos serão preparadas com a marca d’água www.caminhoesavenda.com antes do envio.</p>
            </div>
          </div>
          <WatermarkPhotoUploader />
        </section>

        <footer className="form-footer">
          <p>Ao enviar, o anúncio fica pendente até aprovação do administrador.</p>
          <button type="submit">Enviar peça para aprovação</button>
        </footer>
      </form>

      <style>{`
        .secondary-button { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; padding: 0 14px; border-radius: 14px; border: 1px solid #343a40; background: #2a2f34; color: #e8eaed; text-decoration: none; font-weight: 900; }
        .optional-tag { color: #8f99a3; font-weight: 700; font-size: 11px; margin-left: 4px; }
        .truck-form { display: grid; gap: 18px; }
        .form-section, .form-footer { border-radius: 24px; background: #1f2327; border: 1px solid #343a40; box-shadow: 0 16px 34px rgba(0,0,0,.18); }
        .form-section { padding: 24px; }
        .section-head { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 20px; }
        .section-head span { width: 40px; height: 40px; border-radius: 14px; display: grid; place-items: center; background: #22c55e; color: #06140b; font-weight: 950; flex: 0 0 auto; }
        .section-head h2 { margin: 0 0 5px; font-size: 22px; line-height: 1.1; letter-spacing: -.035em; color: #f4f4f5; }
        .section-head p { margin: 0; color: #a7afb7; line-height: 1.45; }
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
        @media (max-width: 980px) { .form-grid.three, .form-grid.two { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .form-section { padding: 18px; border-radius: 20px; } .section-head { display: grid; } .form-footer button, .secondary-button { width: 100%; } }
      `}</style>
    </PanelLayout>
  );
}
