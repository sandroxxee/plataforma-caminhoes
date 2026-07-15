import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactForm } from "@/components/ContactForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contato | Caminhões à Venda",
  description: "Entre em contato com a equipe do Caminhões à Venda. Tire dúvidas, reporte problemas ou saiba como anunciar seu caminhão.",
  alternates: { canonical: "https://www.caminhoesavenda.com/institucional/contato" },
};

export default function ContatoPage() {
  return (
    <main className="market-page">
      <PublicHeader />
      <div className="market-container" style={{ maxWidth: 680 }}>
        <nav style={{ display:"flex",gap:6,alignItems:"center",padding:"18px 0 0",fontSize:13,color:"var(--muted)",fontWeight:700 }}>
          <Link href="/" style={{ color:"var(--blue)",textDecoration:"none" }}>Início</Link>
          <span>›</span><span>Contato</span>
        </nav>

        <div style={{ padding:"24px 0 48px" }}>
          <h1 style={{ fontSize:"clamp(28px,4vw,42px)",fontWeight:950,letterSpacing:"-.04em",margin:"0 0 8px" }}>Fale com a gente</h1>
          <p style={{ color:"var(--muted)",fontSize:15,fontWeight:700,margin:"0 0 36px",lineHeight:1.6 }}>
            Tem dúvidas, sugestões ou precisa de ajuda? Estamos aqui.
          </p>

          <div style={{ display:"grid",gap:16,marginBottom:36 }}>
            <a href="https://wa.me/5549999362681?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20com%20meu%20an%C3%BAncio." target="_blank" rel="noreferrer"
              style={{ display:"flex",alignItems:"center",gap:16,padding:"20px 24px",borderRadius:16,background:"rgba(37,211,102,.1)",border:"1.5px solid rgba(37,211,102,.3)",textDecoration:"none",transition:".15s" }}>
              <span style={{ fontSize:28 }}>📱</span>
              <div>
                <strong style={{ display:"block",fontSize:15,color:"var(--text)",fontWeight:900 }}>WhatsApp</strong>
                <span style={{ fontSize:13,color:"var(--muted)",fontWeight:700 }}>Resposta rápida em dias úteis</span>
              </div>
            </a>

            <a href="mailto:contato@caminhoesavenda.com"
              style={{ display:"flex",alignItems:"center",gap:16,padding:"20px 24px",borderRadius:16,background:"var(--soft)",border:"1.5px solid var(--line)",textDecoration:"none",transition:".15s" }}>
              <span style={{ fontSize:28 }}>📧</span>
              <div>
                <strong style={{ display:"block",fontSize:15,color:"var(--text)",fontWeight:900 }}>E-mail</strong>
                <span style={{ fontSize:13,color:"var(--muted)",fontWeight:700 }}>contato@caminhoesavenda.com</span>
              </div>
            </a>
          </div>

          <div style={{ marginBottom: 48 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 950, letterSpacing: "-.02em" }}>Envie uma mensagem</h2>
            <ContactForm />
          </div>

          <div style={{ padding:"24px",borderRadius:16,background:"var(--soft)",border:"1px solid var(--line)" }}>
            <h2 style={{ margin:"0 0 16px",fontSize:17,fontWeight:950 }}>Perguntas frequentes</h2>
            {[
              { q:"Como anuncio meu caminhão?", a: <><Link href="/anunciar" style={{ color:"var(--blue)" }}>Clique em anunciar</Link>, preencha os dados e envie. Aprovamos em até 24h.</> },
              { q:"O anúncio é gratuito?", a: "Sim! Anúncios básicos são 100% gratuitos." },
              { q:"Como edito ou removo meu anúncio?", a: "Acesse o painel com sua conta e gerencie seus anúncios." },
              { q:"Encontrei um anúncio suspeito, como denuncio?", a: "Mande email ou WhatsApp com o link do anúncio." },
            ].map(({ q, a }) => (
              <div key={q} style={{ borderTop:"1px solid var(--line)",paddingTop:14,marginTop:14 }}>
                <strong style={{ display:"block",fontSize:14,fontWeight:900,marginBottom:4 }}>{q}</strong>
                <p style={{ margin:0,fontSize:13,fontWeight:700,color:"var(--muted)",lineHeight:1.6 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
