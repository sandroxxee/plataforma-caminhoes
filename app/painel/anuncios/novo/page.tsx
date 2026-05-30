import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { AutoFillTruckButton } from "@/components/AutoFillTruckButton";
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
      title="Cadastrar caminhão"
      subtitle="Cole uma descrição simples, use a IA para preencher os campos e revise antes de enviar para aprovação."
      badge="Novo anúncio"
      actions={<Link href="/painel/anuncios" className="secondary-button">Voltar aos anúncios</Link>}
    >
      <form action={criarAnuncio} className="truck-form" encType="multipart/form-data">
        <section className="form-section ai-section">
          <div className="section-head">
            <span>IA</span>
            <div>
              <h2>Preenchimento automático</h2>
              <p>Cole a mensagem recebida no WhatsApp, Facebook ou de um vendedor. A IA tenta identificar marca, modelo, ano, valor, categoria, tração e descrição.</p>
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
              <p>Informações que identificam o veículo no anúncio.</p>
            </div>
          </div>

          <div className="form-grid three">
            <label>
              Marca *
              <select name="marca" required defaultValue="">
                <option value="" disabled>Selecione a marca</option>
                {marcas.map((marca) => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
            </label>

            <label>
              Modelo *
              <input name="modelo" placeholder="Ex: 113, P420, FH 540" required />
            </label>

            <label>
              Ano *
              <input name="ano" type="number" placeholder="Ex: 1995" required />
            </label>

            <label>
              Carroceria *
              <select name="carroceria" required defaultValue="">
                <option value="" disabled>Selecione a carroceria</option>
                {carrocerias.map((carroceria) => (
                  <option key={carroceria} value={carroceria}>{carroceria}</option>
                ))}
              </select>
            </label>

            <label>
              Tração *
              <select name="tracao" required defaultValue="">
                <option value="" disabled>Selecione a tração</option>
                {tracoes.map((tracao) => (
                  <option key={tracao} value={tracao}>{tracao}</option>
                ))}
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
              <input name="whatsapp" placeholder="Ex: 5549999362681" required />
              <small>Use DDI + DDD + número. Exemplo: 5549999999999</small>
            </label>

            <label className="wide">
              Descrição
              <textarea
                name="descricao"
                placeholder="Ex: Caminhão conservado, mecânica em dia, pneus bons, pronto para trabalhar."
              />
            </label>
          </div>
        </section>

        <section className="form-section upload-section">
          <div className="section-head">
            <span>04</span>
            <div>
              <h2>Fotos do caminhão</h2>
              <p>Use fotos reais, nítidas e atuais. A primeira foto é a mais importante.</p>
            </div>
          </div>

          <div className="photo-grid">
            <label className="upload-field">
              <strong>Foto principal</strong>
              <small>Imagem que aparece primeiro nos anúncios.</small>
              <input name="foto_principal" type="file" accept="image/*" />
            </label>

            <label className="upload-field">
              <strong>Fotos extras</strong>
              <small>Frente, lateral, traseira, cabine, pneus e carroceria.</small>
              <input name="fotos_extras" type="file" accept="image/*" multiple />
            </label>
          </div>
        </section>

        <div className="preview-box">
          <strong>Prévia do título automático:</strong>
          <span>Marca + Modelo + Tração + Ano</span>
        </div>

        <footer className="form-footer">
          <p>Ao enviar, o anúncio fica pendente até aprovação do administrador.</p>
          <button type="submit">Enviar para aprovação</button>
        </footer>
      </form>

      <style>{`
        .secondary-button { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; padding: 0 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,.15); background: rgba(255,255,255,.06); color: white; text-decoration: none; font-weight: 900; }
        .truck-form { display: grid; gap: 18px; }
        .form-section, .preview-box, .form-footer { border-radius: 24px; background: radial-gradient(circle at 0 0, rgba(34,197,94,.10), transparent 34%), linear-gradient(180deg, rgba(16,23,26,.94), rgba(8,13,15,.94)); border: 1px solid rgba(255,255,255,.12); box-shadow: 0 22px 54px rgba(0,0,0,.20); }
        .ai-section { background: radial-gradient(circle at 0 0, rgba(34,197,94,.18), transparent 36%), linear-gradient(180deg, rgba(16,23,26,.98), rgba(8,13,15,.96)); }
        .form-section { padding: 24px; }
        .section-head { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 20px; }
        .section-head span { width: 40px; height: 40px; border-radius: 14px; display: grid; place-items: center; background: #22c55e; color: #052e16; font-weight: 950; flex: 0 0 auto; box-shadow: 0 12px 30px rgba(34,197,94,.16); }
        .section-head h2 { margin: 0 0 5px; font-size: 22px; line-height: 1.1; letter-spacing: -.035em; }
        .section-head p { margin: 0; color: #94a3b8; line-height: 1.45; }
        .ai-grid { display: grid; grid-template-columns: 1.3fr .7fr; gap: 16px; align-items: end; }
        .form-grid { display: grid; gap: 16px; }
        .form-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .form-grid.two { grid-template-columns: .8fr 1.2fr; }
        label { display: grid; gap: 8px; color: #dbeafe; font-size: 13px; font-weight: 900; }
        label small, .upload-field small { color: #94a3b8; line-height: 1.45; font-weight: 700; }
        input, select, textarea { width: 100%; min-height: 50px; border-radius: 15px; border: 1px solid rgba(255,255,255,.14); background: rgba(2,6,23,.52); color: white; padding: 0 14px; outline: none; box-sizing: border-box; }
        textarea { min-height: 130px; resize: vertical; padding-top: 13px; line-height: 1.5; }
        input:focus, select:focus, textarea:focus { border-color: rgba(34,197,94,.65); box-shadow: 0 0 0 4px rgba(34,197,94,.10); }
        select option { background: #0b1114; color: white; }
        .wide { min-width: 0; }
        .upload-section { background: radial-gradient(circle at 0 0, rgba(34,197,94,.16), transparent 34%), linear-gradient(180deg, rgba(16,23,26,.94), rgba(8,13,15,.94)); }
        .photo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .upload-field { min-height: 150px; padding: 20px; border-radius: 20px; border: 1px dashed rgba(34,197,94,.45); background: rgba(34,197,94,.07); align-content: center; }
        .upload-field strong { font-size: 18px; color: white; }
        .upload-field input { margin-top: 8px; padding: 12px; border-style: solid; background: rgba(2,6,23,.52); }
        .preview-box { padding: 16px 18px; display: flex; gap: 10px; flex-wrap: wrap; color: #cbd5e1; }
        .preview-box strong { color: #86efac; }
        .form-footer { padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
        .form-footer p { margin: 0; color: #cbd5e1; line-height: 1.55; }
        .form-footer button { min-height: 52px; border: 0; padding: 0 20px; border-radius: 16px; background: #22c55e; color: #052e16; font-weight: 950; cursor: pointer; box-shadow: 0 14px 34px rgba(34,197,94,.18); }
        @media (max-width: 980px) { .form-grid.three, .form-grid.two, .photo-grid, .ai-grid { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .form-section { padding: 18px; border-radius: 20px; } .section-head { display: grid; } .form-footer button, .secondary-button { width: 100%; } }
      `}</style>
    </PanelLayout>
  );
}
