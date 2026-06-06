import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { AutoFillTruckButton } from "@/components/AutoFillTruckButton";
import { TruckConfigurationFields } from "@/components/TruckConfigurationFields";
import { WatermarkPhotoUploader } from "@/components/WatermarkPhotoUploader";
import { criarAnuncio } from "../../actions";

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
const estados = ["SC", "PR", "RS", "SP", "MG", "MS", "MT", "GO", "BA", "RJ", "ES", "Outro"];

const etapas = [
  { href: "#categoria", numero: "1", titulo: "Categoria", texto: "Caminhão" },
  { href: "#dados", numero: "2", titulo: "Dados do caminhão", texto: "Marca, modelo e ano" },
  { href: "#fotos", numero: "3", titulo: "Fotos", texto: "Imagens do anúncio" },
  { href: "#localizacao-contato", numero: "4", titulo: "Localização e contato", texto: "Cidade, estado e WhatsApp" },
  { href: "#revisao-envio", numero: "5", titulo: "Revisão e envio", texto: "Enviar para aprovação" },
];

export default async function NovoCaminhaoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <PanelLayout
      title="Anunciar caminhão"
      subtitle="Cadastro separado para caminhões. O tipo do caminhão define automaticamente configuração e tração para evitar anúncio errado."
      badge="Novo caminhão"
      actions={<Link href="/painel/anuncios/novo" className="secondary-button">Trocar tipo de anúncio</Link>}
    >
      <form action={criarAnuncio} className="truck-form" encType="multipart/form-data">
        <input type="hidden" name="tipo_anuncio" value="Caminhão" />

        <div className="form-shell">
          <aside className="steps-panel" aria-label="Etapas do cadastro do caminhão">
            <div className="steps-title">
              <strong>Etapas do anúncio</strong>
              <span>Preencha por partes</span>
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
            <section id="categoria" className="form-section category-section">
              <div className="section-head">
                <span>01</span>
                <div>
                  <h2>Categoria</h2>
                  <p>Este cadastro é exclusivo para caminhões. Para outro tipo de anúncio, use a opção de trocar tipo.</p>
                </div>
              </div>

              <div className="category-card">
                <div>
                  <small>Tipo selecionado</small>
                  <strong>Caminhão</strong>
                </div>
                <Link href="/painel/anuncios/novo" className="category-link">Trocar tipo</Link>
              </div>
            </section>

            <section className="form-section ai-section">
              <div className="section-head">
                <span>IA</span>
                <div>
                  <h2>Preenchimento automático</h2>
                  <p>Cole a mensagem recebida no WhatsApp, Facebook ou de um vendedor para ajudar no cadastro do caminhão.</p>
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

            <section id="dados" className="form-section">
              <div className="section-head">
                <span>02</span>
                <div>
                  <h2>Dados do caminhão</h2>
                  <p>Informe marca, modelo, ano, carroceria e tipo do caminhão. Configuração e tração são automáticas.</p>
                </div>
              </div>

              <div className="form-grid three">
                <label>
                  Marca do caminhão *
                  <select name="marca" defaultValue="" required>
                    <option value="" disabled>Selecione a marca</option>
                    {marcas.map((marca) => (
                      <option key={marca} value={marca}>{marca}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Modelo do caminhão *
                  <input name="modelo" placeholder="Ex: 113, P420, FH 540" required />
                </label>

                <label>
                  Ano do caminhão *
                  <input name="ano" type="number" placeholder="Ex: 1995" required />
                </label>

                <label>
                  Carroceria *
                  <select name="carroceria" defaultValue="" required>
                    <option value="" disabled>Selecione a carroceria</option>
                    {carrocerias.map((carroceria) => (
                      <option key={carroceria} value={carroceria}>{carroceria}</option>
                    ))}
                  </select>
                </label>

                <TruckConfigurationFields />
              </div>
            </section>

            <section id="localizacao-contato" className="form-section">
              <div className="section-head">
                <span>03</span>
                <div>
                  <h2>Localização e contato</h2>
                  <p>Informe valor, cidade, estado e WhatsApp para o comprador falar direto com o anunciante.</p>
                </div>
              </div>

              <div className="form-grid three">
                <label>
                  Valor *
                  <input name="preco" type="number" placeholder="Ex: 180000" required />
                </label>

                <label>
                  Cidade *
                  <input name="cidade" placeholder="Ex: Xanxerê" required />
                </label>

                <label>
                  Estado *
                  <select name="estado" defaultValue="SC" required>
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </label>

                <label>
                  WhatsApp *
                  <input name="whatsapp" placeholder="Ex: 5549999362681" required />
                  <small>Use DDI + DDD + número. Exemplo: 5549999999999</small>
                </label>

                <label className="wide description-field">
                  Descrição
                  <textarea
                    name="descricao"
                    placeholder="Ex: Conservado, pronto para trabalhar, pneus bons, documentação em dia."
                  />
                </label>
              </div>
            </section>

            <section id="fotos" className="form-section upload-section">
              <div className="section-head">
                <span>04</span>
                <div>
                  <h2>Fotos do caminhão</h2>
                  <p>As fotos serão preparadas com a marca d’água www.caminhoesavenda.com antes do envio.</p>
                </div>
              </div>

              <WatermarkPhotoUploader />
            </section>

            <section id="revisao-envio" className="review-section">
              <div className="preview-box">
                <strong>Prévia do título automático:</strong>
                <span>Marca + Modelo + Configuração + Ano</span>
              </div>

              <footer className="form-footer">
                <p>Ao enviar, o anúncio fica pendente até aprovação do administrador.</p>
                <button type="submit">Enviar caminhão para aprovação</button>
              </footer>
            </section>
          </div>
        </div>
      </form>

      <style>{`
        .secondary-button { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; padding: 0 14px; border-radius: 14px; border: 1px solid #343a40; background: #2a2f34; color: #e8eaed; text-decoration: none; font-weight: 900; }
        .truck-form { display: grid; gap: 18px; }
        .form-shell { display: grid; grid-template-columns: 270px minmax(0, 1fr); gap: 18px; align-items: start; }
        .steps-panel { position: sticky; top: 18px; border-radius: 24px; background: #1f2327; border: 1px solid #343a40; box-shadow: 0 16px 34px rgba(0,0,0,.18); padding: 16px; }
        .steps-title { display: grid; gap: 4px; padding: 4px 4px 14px; border-bottom: 1px solid #343a40; margin-bottom: 12px; }
        .steps-title strong { color: #f4f4f5; font-size: 15px; }
        .steps-title span { color: #8f99a3; font-size: 12px; font-weight: 800; }
        .steps-nav { display: grid; gap: 8px; }
        .steps-nav a { display: flex; gap: 10px; align-items: center; padding: 11px; border-radius: 16px; color: #d8dee6; text-decoration: none; border: 1px solid transparent; background: #171a1d; }
        .steps-nav a:hover { border-color: #22c55e; background: #19211d; }
        .steps-nav a > span { width: 30px; height: 30px; border-radius: 11px; display: grid; place-items: center; background: #22c55e; color: #06140b; font-weight: 950; flex: 0 0 auto; }
        .steps-nav strong { display: block; font-size: 13px; line-height: 1.15; }
        .steps-nav small { display: block; margin-top: 3px; color: #8f99a3; font-size: 11px; font-weight: 800; line-height: 1.2; }
        .form-main { display: grid; gap: 18px; min-width: 0; }
        .form-section, .preview-box, .form-footer { border-radius: 24px; background: #1f2327; border: 1px solid #343a40; box-shadow: 0 16px 34px rgba(0,0,0,.18); scroll-margin-top: 18px; }
        .ai-section, .upload-section, .category-section { background: #1f2327; }
        .form-section { padding: 24px; }
        .section-head { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 20px; }
        .section-head span { width: 40px; height: 40px; border-radius: 14px; display: grid; place-items: center; background: #22c55e; color: #06140b; font-weight: 950; flex: 0 0 auto; }
        .section-head h2 { margin: 0 0 5px; font-size: 22px; line-height: 1.1; letter-spacing: -.035em; color: #f4f4f5; }
        .section-head p { margin: 0; color: #a7afb7; line-height: 1.45; }
        .category-card { display: flex; justify-content: space-between; align-items: center; gap: 14px; padding: 16px; border-radius: 18px; background: #15181b; border: 1px solid #343a40; }
        .category-card small { display: block; color: #8f99a3; font-size: 12px; font-weight: 900; margin-bottom: 4px; }
        .category-card strong { color: #f4f4f5; font-size: 18px; }
        .category-link { min-height: 42px; display: inline-flex; align-items: center; justify-content: center; padding: 0 14px; border-radius: 14px; background: #2a2f34; color: #e8eaed; text-decoration: none; font-weight: 900; white-space: nowrap; }
        .ai-grid { display: grid; grid-template-columns: 1.3fr .7fr; gap: 16px; align-items: end; }
        .form-grid { display: grid; gap: 16px; }
        .form-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .form-grid.two { grid-template-columns: .8fr 1.2fr; }
        label { display: grid; gap: 8px; color: #cbd5df; font-size: 13px; font-weight: 900; }
        label small { color: #8f99a3; line-height: 1.45; font-weight: 700; }
        input, select, textarea { width: 100%; min-height: 50px; border-radius: 15px; border: 1px solid #343a40; background: #15181b; color: #e8eaed; padding: 0 14px; outline: none; box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #6f7983; }
        textarea { min-height: 130px; resize: vertical; padding-top: 13px; line-height: 1.5; }
        input:focus, select:focus, textarea:focus { border-color: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,.12); }
        input[readonly] { color: #a7afb7; background: #111417; cursor: default; }
        select option { background: #15181b; color: #e8eaed; }
        .wide { min-width: 0; }
        .description-field { grid-column: span 2; }
        .review-section { display: grid; gap: 18px; scroll-margin-top: 18px; }
        .preview-box { padding: 16px 18px; display: flex; gap: 10px; flex-wrap: wrap; color: #a7afb7; }
        .preview-box strong { color: #22c55e; }
        .form-footer { padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
        .form-footer p { margin: 0; color: #a7afb7; line-height: 1.55; }
        .form-footer button { min-height: 52px; border: 0; padding: 0 20px; border-radius: 16px; background: #22c55e; color: #06140b; font-weight: 950; cursor: pointer; }
        @media (max-width: 980px) {
          .form-shell { grid-template-columns: 1fr; }
          .steps-panel { position: static; }
          .steps-title { border-bottom: 0; margin-bottom: 10px; padding-bottom: 0; }
          .steps-nav { display: flex; overflow-x: auto; gap: 10px; padding-bottom: 4px; scroll-snap-type: x mandatory; }
          .steps-nav a { min-width: 190px; scroll-snap-align: start; }
          .form-grid.three, .form-grid.two, .ai-grid { grid-template-columns: 1fr; }
          .description-field { grid-column: auto; }
        }
        @media (max-width: 560px) {
          .form-section { padding: 18px; border-radius: 20px; }
          .steps-panel { border-radius: 20px; padding: 14px; }
          .steps-nav a { min-width: 168px; padding: 10px; }
          .section-head { display: grid; }
          .category-card { align-items: stretch; flex-direction: column; }
          .category-link, .form-footer button, .secondary-button { width: 100%; }
        }
      `}</style>
    </PanelLayout>
  );
}
