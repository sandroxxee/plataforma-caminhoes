import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { AutoFillTruckButton } from "@/components/AutoFillTruckButton";
import { WatermarkPhotoUploader } from "@/components/WatermarkPhotoUploader";
import {
  IMPLEMENTO_COMPOSICOES,
  IMPLEMENTO_CONSERVACOES,
  IMPLEMENTO_EIXOS,
  IMPLEMENTO_MARCAS,
  IMPLEMENTO_PNEUS,
  IMPLEMENTO_SUSPENSOES,
  IMPLEMENTO_TIPOS,
} from "@/lib/implementos";
import { criarAnuncio } from "../actions";

export const dynamic = "force-dynamic";

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
const tracoes = ["4x2", "6x2", "6x4", "8x2", "8x4", "Truck", "Bitruck", "Traçado"];
const estados = ["SC", "PR", "RS", "SP", "MG", "MS", "MT", "GO", "BA", "RJ", "ES", "Outro"];

export default async function NovoAnuncioPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <PanelLayout
      title="Cadastrar anúncio"
      subtitle="Escolha se o anúncio é de caminhão ou implemento, preencha os dados principais e envie para aprovação."
      badge="Novo anúncio"
      actions={<Link href="/painel/anuncios" className="secondary-button">Voltar aos anúncios</Link>}
    >
      <form action={criarAnuncio} className="truck-form" encType="multipart/form-data">
        <section className="form-section tipo-section">
          <div className="section-head">
            <span>00</span>
            <div>
              <h2>Tipo de anúncio</h2>
              <p>Selecione o tipo correto antes de preencher. Caminhão mantém o cadastro atual; implemento usa campos próprios.</p>
            </div>
          </div>

          <div className="choice-grid">
            <label className="choice-card">
              <input type="radio" name="tipo_anuncio" value="Caminhão" defaultChecked />
              <strong>Caminhão</strong>
              <small>Cavalo mecânico, truck, toco, 3/4, basculante, baú, tanque e outros caminhões.</small>
            </label>

            <label className="choice-card">
              <input type="radio" name="tipo_anuncio" value="Implemento" />
              <strong>Implemento</strong>
              <small>Carreta, caçamba, bi-caçamba, bitrem, prancha, tanque, baú, sider, dolly e outros.</small>
            </label>
          </div>
        </section>

        <section className="form-section ai-section">
          <div className="section-head">
            <span>IA</span>
            <div>
              <h2>Preenchimento automático</h2>
              <p>Cole a mensagem recebida no WhatsApp, Facebook ou de um vendedor. A IA ajuda principalmente no cadastro de caminhão.</p>
            </div>
          </div>

          <div className="ai-grid">
            <label>
              Texto base para a IA
              <textarea
                name="texto_ia"
                placeholder="Ex: VW 24.280 8x2 com tanque, ano 2014, pronto para trabalhar, valor 249 no chassi e 278 com tanque."
              />
              <small>A IA apenas sugere. Confira tudo antes de enviar o anúncio.</small>
            </label>

            <AutoFillTruckButton />
          </div>
        </section>

        <section className="form-section">
          <div className="section-head">
            <span>01</span>
            <div>
              <h2>Dados do caminhão</h2>
              <p>Preencha esta parte quando o anúncio for de caminhão.</p>
            </div>
          </div>

          <div className="form-grid three">
            <label>
              Marca do caminhão
              <select name="marca" defaultValue="">
                <option value="" disabled>Selecione a marca</option>
                {marcas.map((marca) => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
            </label>

            <label>
              Modelo do caminhão
              <input name="modelo" placeholder="Ex: 113, P420, FH 540" />
            </label>

            <label>
              Ano do caminhão
              <input name="ano" type="number" placeholder="Ex: 1995" />
            </label>

            <label>
              Carroceria
              <select name="carroceria" defaultValue="">
                <option value="" disabled>Selecione a carroceria</option>
                {carrocerias.map((carroceria) => (
                  <option key={carroceria} value={carroceria}>{carroceria}</option>
                ))}
              </select>
            </label>

            <label>
              Tração
              <select name="tracao" defaultValue="">
                <option value="" disabled>Selecione a tração</option>
                {tracoes.map((tracao) => (
                  <option key={tracao} value={tracao}>{tracao}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="form-section implemento-section">
          <div className="section-head">
            <span>02</span>
            <div>
              <h2>Dados do implemento</h2>
              <p>Preencha esta parte quando o anúncio for de implemento rodoviário.</p>
            </div>
          </div>

          <div className="form-grid three">
            <label>
              Tipo de implemento
              <select name="tipo_implemento" defaultValue="">
                <option value="" disabled>Selecione o tipo</option>
                {IMPLEMENTO_TIPOS.map((tipo) => (
                  <option key={tipo.id} value={tipo.nome}>{tipo.nome}</option>
                ))}
              </select>
            </label>

            <label>
              Marca do implemento
              <select name="implemento_marca" defaultValue="">
                <option value="" disabled>Selecione a marca</option>
                {IMPLEMENTO_MARCAS.map((marca) => (
                  <option key={marca.id} value={marca.nome}>{marca.nome}</option>
                ))}
              </select>
            </label>

            <label>
              Modelo / versão
              <input name="implemento_modelo" placeholder="Ex: Basculante meia-cana, LS, graneleira" />
            </label>

            <label>
              Ano do implemento
              <input name="implemento_ano" type="number" placeholder="Ex: 2020" />
            </label>

            <label>
              Número de eixos
              <select name="numero_eixos" defaultValue="">
                <option value="" disabled>Selecione</option>
                {IMPLEMENTO_EIXOS.map((eixo) => (
                  <option key={eixo.id} value={eixo.nome}>{eixo.nome}</option>
                ))}
              </select>
            </label>

            <label>
              Composição
              <select name="composicao" defaultValue="">
                <option value="" disabled>Selecione</option>
                {IMPLEMENTO_COMPOSICOES.map((composicao) => (
                  <option key={composicao.id} value={composicao.nome}>{composicao.nome}</option>
                ))}
              </select>
            </label>

            <label>
              Pneus
              <select name="pneus" defaultValue="">
                <option value="" disabled>Selecione</option>
                {IMPLEMENTO_PNEUS.map((pneu) => (
                  <option key={pneu.id} value={pneu.nome}>{pneu.nome}</option>
                ))}
              </select>
            </label>

            <label>
              Suspensão
              <select name="suspensao" defaultValue="">
                <option value="" disabled>Selecione</option>
                {IMPLEMENTO_SUSPENSOES.map((suspensao) => (
                  <option key={suspensao.id} value={suspensao.nome}>{suspensao.nome}</option>
                ))}
              </select>
            </label>

            <label>
              Conservação
              <select name="conservacao" defaultValue="">
                <option value="" disabled>Selecione</option>
                {IMPLEMENTO_CONSERVACOES.map((conservacao) => (
                  <option key={conservacao.id} value={conservacao.nome}>{conservacao.nome}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="form-section">
          <div className="section-head">
            <span>03</span>
            <div>
              <h2>Valor e localização</h2>
              <p>Esses dados ajudam o comprador a decidir rapidamente.</p>
            </div>
          </div>

          <div className="form-grid three">
            <label>
              Valor *
              <input name="preco" type="number" placeholder="Ex: 180000" />
            </label>

            <label>
              Cidade *
              <input name="cidade" placeholder="Ex: Xanxerê" />
            </label>

            <label>
              Estado *
              <select name="estado" defaultValue="SC">
                {estados.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="form-section">
          <div className="section-head">
            <span>04</span>
            <div>
              <h2>Contato e descrição</h2>
              <p>Informe um WhatsApp válido e uma descrição objetiva.</p>
            </div>
          </div>

          <div className="form-grid two">
            <label>
              WhatsApp *
              <input name="whatsapp" placeholder="Ex: 5549999362681" />
              <small>Use DDI + DDD + número. Exemplo: 5549999999999</small>
            </label>

            <label className="wide">
              Descrição
              <textarea
                name="descricao"
                placeholder="Ex: Conservado, pronto para trabalhar, pneus bons, documentação em dia."
              />
            </label>
          </div>
        </section>

        <section className="form-section upload-section">
          <div className="section-head">
            <span>05</span>
            <div>
              <h2>Fotos do anúncio</h2>
              <p>As fotos serão preparadas com a marca d’água www.caminhoesavenda.com antes do envio.</p>
            </div>
          </div>

          <WatermarkPhotoUploader />
        </section>

        <div className="preview-box">
          <strong>Prévia do título automático:</strong>
          <span>Caminhão: Marca + Modelo + Tração + Ano | Implemento: Marca + Modelo + Tipo + Eixos + Ano</span>
        </div>

        <footer className="form-footer">
          <p>Ao enviar, o anúncio fica pendente até aprovação do administrador.</p>
          <button type="submit">Enviar para aprovação</button>
        </footer>
      </form>

      <style>{`
        .secondary-button { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; padding: 0 14px; border-radius: 14px; border: 1px solid #343a40; background: #2a2f34; color: #e8eaed; text-decoration: none; font-weight: 900; }
        .truck-form { display: grid; gap: 18px; }
        .form-section, .preview-box, .form-footer { border-radius: 24px; background: #1f2327; border: 1px solid #343a40; box-shadow: 0 16px 34px rgba(0,0,0,.18); }
        .ai-section, .upload-section, .tipo-section, .implemento-section { background: #1f2327; }
        .form-section { padding: 24px; }
        .section-head { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 20px; }
        .section-head span { width: 40px; height: 40px; border-radius: 14px; display: grid; place-items: center; background: #22c55e; color: #06140b; font-weight: 950; flex: 0 0 auto; }
        .section-head h2 { margin: 0 0 5px; font-size: 22px; line-height: 1.1; letter-spacing: -.035em; color: #f4f4f5; }
        .section-head p { margin: 0; color: #a7afb7; line-height: 1.45; }
        .ai-grid { display: grid; grid-template-columns: 1.3fr .7fr; gap: 16px; align-items: end; }
        .choice-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .choice-card { display: grid; grid-template-columns: auto 1fr; gap: 6px 12px; align-items: start; min-height: 96px; padding: 16px; border-radius: 18px; border: 1px solid #343a40; background: #15181b; cursor: pointer; }
        .choice-card input { width: 18px; min-height: 18px; margin-top: 2px; accent-color: #22c55e; }
        .choice-card strong { color: #f4f4f5; font-size: 15px; }
        .choice-card small { grid-column: 2; color: #8f99a3; line-height: 1.45; font-weight: 700; }
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
        .preview-box { padding: 16px 18px; display: flex; gap: 10px; flex-wrap: wrap; color: #a7afb7; }
        .preview-box strong { color: #22c55e; }
        .form-footer { padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
        .form-footer p { margin: 0; color: #a7afb7; line-height: 1.55; }
        .form-footer button { min-height: 52px; border: 0; padding: 0 20px; border-radius: 16px; background: #22c55e; color: #06140b; font-weight: 950; cursor: pointer; }
        @media (max-width: 980px) { .form-grid.three, .form-grid.two, .ai-grid, .choice-grid { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .form-section { padding: 18px; border-radius: 20px; } .section-head { display: grid; } .form-footer button, .secondary-button { width: 100%; } }
      `}</style>
    </PanelLayout>
  );
}
