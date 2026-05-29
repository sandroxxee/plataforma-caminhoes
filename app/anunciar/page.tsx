import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Anunciar caminhão | Caminhões à Venda",
  description: "Veja como anunciar seu caminhão no Caminhões à Venda.",
};

export default function AnunciarPage() {
  return (
    <main className="page">
      <PublicHeader />

      <section className="hero">
        <div className="wrap heroContent">
          <p>Envie fotos reais, dados principais, valor, cidade e informe se aceita troca. O anúncio fica organizado para gerar contato direto pelo WhatsApp.</p>
          <div className="heroActions">
            <Link href="/cadastro" className="btn primary">Começar anúncio</Link>
            <Link href="/anuncios" className="btn ghost">Ver caminhões</Link>
          </div>
        </div>
      </section>

      <section className="wrap cards">
        <article>
          <span>01</span>
          <b>Dados principais</b>
          <ul><li>Marca, modelo e ano</li><li>Tração e carroceria</li><li>Cidade, valor e WhatsApp</li><li>Se aceita troca ou não</li></ul>
        </article>
        <article>
          <span>02</span>
          <b>Fotos reais</b>
          <ul><li>Frente, lateral e traseira</li><li>Cabine, pneus e carroceria</li><li>Imagens limpas e atuais</li><li>Sem aparência artificial</li></ul>
        </article>
        <article>
          <span>03</span>
          <b>Publicação</b>
          <p>O anúncio pode passar por revisão antes de aparecer publicamente. Isso mantém a plataforma organizada e confiável.</p>
        </article>
      </section>

      <section className="wrap sellBox">
        <div>
          <span className="kicker">Próximo passo</span>
          <h2>Crie sua conta e envie o caminhão para aprovação.</h2>
          <p>A troca não é uma aba separada: ela entra como opção marcada dentro do anúncio.</p>
        </div>
        <Link href="/cadastro">Criar conta e anunciar</Link>
      </section>

      <SiteFooter />

      <style>{`
        .page{--green:#22c55e;min-height:100vh;color:#f8fafc;background:radial-gradient(circle at 8% 5%,rgba(34,197,94,.17),transparent 28%),radial-gradient(circle at 82% 12%,rgba(34,197,94,.10),transparent 24%),linear-gradient(135deg,#020506 0%,#06110e 48%,#030608 100%);overflow-x:hidden;padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}.hero{margin-top:-90px;min-height:430px;display:flex;align-items:end;background:linear-gradient(90deg,rgba(2,6,8,.96),rgba(2,6,8,.72) 45%,rgba(2,6,8,.25));border-bottom:1px solid rgba(255,255,255,.08)}.heroContent{padding:150px 0 64px}.kicker{display:inline-flex;align-items:center;gap:9px;min-height:34px;padding:0 13px;border-radius:999px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.32);color:#bbf7d0;font-size:12px;font-weight:950;letter-spacing:.07em;text-transform:uppercase}h1{margin:18px 0 14px;font-size:clamp(38px,5.4vw,68px);line-height:1.02;letter-spacing:-.055em;max-width:760px}h1 span{color:var(--green)}.hero p{margin:0;max-width:660px;color:#d7dee8;font-size:17px;line-height:1.6}.heroActions{display:flex;flex-wrap:wrap;gap:12px;margin-top:27px}.btn,.sellBox a{min-height:52px;display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:0 22px;border-radius:8px;border:1px solid rgba(255,255,255,.15);font-size:13px;font-weight:950;letter-spacing:.04em;text-transform:uppercase;text-decoration:none}.primary,.sellBox a{background:var(--green);color:#03220f;border-color:transparent}.ghost{background:rgba(3,7,10,.58);color:#f8fafc}.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:30px}.cards article,.sellBox{background:linear-gradient(180deg,rgba(16,23,26,.94),rgba(8,13,15,.94));border:1px solid rgba(255,255,255,.12);border-radius:16px;box-shadow:0 18px 45px rgba(0,0,0,.22);padding:26px}.cards span{width:38px;height:38px;border-radius:999px;background:var(--green);color:#042913;display:grid;place-items:center;font-weight:950;margin-bottom:16px}.cards b{display:block;color:#f8fafc;font-size:20px;margin-bottom:12px}.cards ul{margin:0;padding-left:20px;color:#dbeafe;line-height:1.85}.cards p{margin:0;color:#dbeafe;line-height:1.65}.sellBox{margin-top:18px;display:flex;align-items:center;justify-content:space-between;gap:22px;background:linear-gradient(135deg,rgba(34,197,94,.12),rgba(255,255,255,.045));border-color:rgba(34,197,94,.20)}.sellBox h2{margin:14px 0 8px;font-size:clamp(28px,4vw,46px);line-height:1.05;letter-spacing:-.04em}.sellBox p{margin:0;color:#d6dee8;font-size:17px;line-height:1.55}@media(max-width:900px){.cards{grid-template-columns:1fr}.sellBox{display:block}.sellBox a{margin-top:18px}}@media(max-width:640px){.wrap{width:calc(100vw - 22px)}.hero{margin-top:-152px;min-height:500px}.heroContent{padding:235px 0 44px}h1{font-size:38px}.heroActions{display:grid}.btn,.sellBox a{width:100%}}
      `}</style>
    </main>
  );
}
