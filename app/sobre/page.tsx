import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function SobrePage() {
  return (
    <main className="about-page">
      <PublicHeader />

      <section className="wrap aboutHero">
        <span className="mini">Sobre a plataforma</span>
        <h1>Um site de anúncios para conectar compradores e vendedores de caminhões.</h1>
        <p>
          Nosso objetivo é reunir anúncios recentes em um só lugar, facilitar a busca de quem procura caminhões e ajudar quem vende a apresentar melhor suas oportunidades.
        </p>
      </section>

      <section className="wrap aboutGrid">
        <div className="aboutCard">
          <span className="mini">Para quem compra</span>
          <h2>Encontre caminhões com informação clara.</h2>
          <p>Veja fotos, valor, cidade, configuração e chame direto no WhatsApp para confirmar disponibilidade e negociar.</p>
          <Link href="/anuncios">Procurar caminhões</Link>
        </div>

        <div className="aboutCard">
          <span className="mini">Para quem vende</span>
          <h2>Anuncie com mais organização e alcance.</h2>
          <p>Cadastre dados, fotos, valor e contato. O anúncio passa por revisão antes de aparecer publicamente.</p>
          <Link href="/anunciar">Quero anunciar</Link>
        </div>
      </section>

      <section className="wrap missionCard">
        <span className="mini">Nossa direção</span>
        <h2>Mais que listar caminhões, queremos melhorar a experiência de compra e venda.</h2>
        <p>
          A plataforma Caminhões à Venda foi criada para aproximar compradores e vendedores com anúncios organizados, recentes e fáceis de consultar. A ideia é evoluir sempre: melhorar fotos, informações, apresentação dos anúncios, atendimento e confiança para que cada negociação comece de forma mais clara.
        </p>
        <p>
          Buscamos construir um ambiente simples, direto e útil para quem vive do transporte, do comércio de caminhões ou procura uma boa oportunidade para trabalhar.
        </p>
      </section>

      <section className="wrap valueGrid">
        <div>
          <strong>Anúncios recentes</strong>
          <span>Estoque apresentado de forma organizada para facilitar a busca.</span>
        </div>
        <div>
          <strong>Compra e venda</strong>
          <span>Um ponto de encontro entre quem procura e quem anuncia caminhões.</span>
        </div>
        <div>
          <strong>Evolução constante</strong>
          <span>Melhorias contínuas para deixar a plataforma mais prática e confiável.</span>
        </div>
      </section>

      <section className="wrap finalCta">
        <div>
          <span className="mini">Caminhões à venda</span>
          <h2>Veja o estoque ou anuncie seu caminhão.</h2>
        </div>
        <div className="actions">
          <Link className="btn primary" href="/anuncios">Ver caminhões</Link>
          <Link className="btn ghost" href="/anunciar">Anunciar</Link>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .about-page{--green:#22c55e;min-height:100vh;color:#f8fafc;background:radial-gradient(circle at 8% 5%,rgba(34,197,94,.17),transparent 28%),radial-gradient(circle at 82% 12%,rgba(34,197,94,.10),transparent 24%),linear-gradient(135deg,#020506 0%,#06110e 48%,#030608 100%);overflow-x:hidden;padding-bottom:30px}
        .wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}
        .mini{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.30);color:#bbf7d0;font-size:12px;font-weight:950;letter-spacing:.07em;text-transform:uppercase}
        .aboutHero{padding:44px 0 28px}
        .aboutHero h1{max-width:920px;margin:16px 0 14px;font-size:clamp(36px,5vw,68px);line-height:1;letter-spacing:-.06em;text-wrap:balance}
        .aboutHero p{max-width:760px;margin:0;color:#d7dee8;font-size:19px;line-height:1.6}
        .aboutGrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
        .aboutCard,.missionCard,.finalCta{padding:clamp(22px,3vw,34px);border-radius:18px;background:linear-gradient(135deg,rgba(34,197,94,.12),rgba(255,255,255,.045));border:1px solid rgba(34,197,94,.20);box-shadow:0 18px 45px rgba(0,0,0,.18)}
        .aboutCard h2,.missionCard h2,.finalCta h2{margin:12px 0 10px;font-size:clamp(28px,3.6vw,44px);line-height:1.03;letter-spacing:-.045em}
        .aboutCard p,.missionCard p{margin:0 0 18px;color:#d6dee8;line-height:1.6;font-size:17px}
        .aboutCard a{min-height:46px;padding:0 16px;border-radius:10px;background:var(--green);color:#052e16;text-decoration:none;font-weight:950;display:inline-flex;align-items:center}
        .missionCard{margin-bottom:16px;background:linear-gradient(180deg,rgba(16,23,26,.94),rgba(8,13,15,.94));border-color:rgba(255,255,255,.12)}
        .valueGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px}
        .valueGrid div{padding:20px;border-radius:16px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.10);display:grid;gap:8px}
        .valueGrid strong{font-size:18px}
        .valueGrid span{color:#cbd5e1;line-height:1.5}
        .finalCta{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:34px}
        .actions{display:flex;flex-wrap:wrap;gap:12px}
        .btn{min-height:52px;display:inline-flex;align-items:center;justify-content:center;padding:0 22px;border-radius:10px;border:1px solid rgba(255,255,255,.16);font-weight:950;text-decoration:none;text-transform:uppercase;font-size:13px;letter-spacing:.04em}
        .primary{background:var(--green);color:#03220f;border-color:transparent;box-shadow:0 12px 28px rgba(34,197,94,.22)}
        .ghost{background:rgba(2,6,8,.55);color:white}
        @media(max-width:900px){.aboutGrid,.valueGrid{grid-template-columns:1fr}.finalCta{display:block}.actions{margin-top:18px}}
        @media(max-width:640px){.wrap{width:calc(100vw - 22px)}.aboutHero{padding:26px 0 22px}.aboutHero h1{font-size:38px}.aboutHero p{font-size:16px}.actions{display:grid;grid-template-columns:1fr}.btn{width:100%}}
      `}</style>
    </main>
  );
}
