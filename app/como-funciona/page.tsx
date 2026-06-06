import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Como funciona | Caminhões à Venda",
  description: "Entenda como comprar, vender e anunciar caminhões na plataforma Caminhões à Venda.",
};

export default function ComoFuncionaPage() {
  return (
    <main className="market-page trust-page">
      <PublicHeader />

      <section className="market-container trust-hero">
        <div>
          <span className="trust-eyebrow">Como funciona</span>
          <h1>Compra e venda de caminhões de forma simples.</h1>
          <p>Encontre caminhões reais, veja fotos e informações principais, compare os anúncios e fale direto com o anunciante pelo WhatsApp.</p>
        </div>
        <aside>
          <span>Comprar, anunciar e negociar com mais clareza.</span>
        </aside>
      </section>

      <section className="market-container trust-grid three">
        <article>
          <span>01</span>
          <b>Para comprar</b>
          <h2>Procure no estoque.</h2>
          <p>Navegue pelo estoque, use os filtros, abra o anúncio e confira fotos, ano, tração, carroceria, cidade, preço e descrição.</p>
          <Link href="/anuncios">Ver caminhões</Link>
        </article>

        <article>
          <span>02</span>
          <b>Para vender</b>
          <h2>Cadastre o anúncio.</h2>
          <p>Crie sua conta, cadastre os dados do caminhão, envie fotos reais e aguarde aprovação para aparecer publicamente.</p>
          <Link href="/cadastro">Criar conta</Link>
        </article>

        <article>
          <span>03</span>
          <b>Segurança</b>
          <h2>Confira antes de fechar.</h2>
          <p>A plataforma divulga anúncios. Antes de fechar negócio, confira documentos, procedência, estado do veículo e dados do vendedor.</p>
          <Link href="/sobre">Entender melhor</Link>
        </article>
      </section>

      <section className="market-container trust-steps">
        <article>
          <span className="trust-eyebrow">Fluxo do comprador</span>
          <h2>Escolha, confira e chame no WhatsApp.</h2>
          <ol>
            <li>Entrar no site e ver os caminhões disponíveis.</li>
            <li>Filtrar por marca, modelo, tração ou carroceria.</li>
            <li>Abrir o anúncio e analisar as informações.</li>
            <li>Chamar o anunciante no WhatsApp para negociar.</li>
          </ol>
        </article>

        <article>
          <span className="trust-eyebrow">Fluxo do anunciante</span>
          <h2>Cadastre, envie e aguarde aprovação.</h2>
          <ol>
            <li>Criar cadastro no site.</li>
            <li>Informar dados principais do caminhão.</li>
            <li>Enviar fotos reais do veículo.</li>
            <li>Aguardar análise e aprovação do anúncio.</li>
          </ol>
        </article>
      </section>

      <section className="market-container trust-cta">
        <div>
          <span className="trust-eyebrow">Pronto para negociar?</span>
          <h2>Veja o estoque ou anuncie seu caminhão.</h2>
        </div>
        <div className="trust-actions end">
          <Link className="trust-btn ghost" href="/anuncios">Ver estoque</Link>
          <Link className="trust-btn primary" href="/cadastro">Anunciar caminhão</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
