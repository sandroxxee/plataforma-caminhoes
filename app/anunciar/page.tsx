 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/app/anunciar/page.tsx b/app/anunciar/page.tsx
index 56fe62c4e2f47cf6be3d67bdfb32164a0a987b84..56968048e0c7af723ee5f9c56b88e6335d5bf0b1 100644
--- a/app/anunciar/page.tsx
+++ b/app/anunciar/page.tsx
@@ -1,65 +1,84 @@
 import Link from "next/link";
 import { PublicHeader } from "@/components/PublicHeader";
 import { SiteFooter } from "@/components/SiteFooter";
 
 export const metadata = {
   title: "Anunciar caminhão | Caminhões à Venda",
   description: "Veja como anunciar seu caminhão no Caminhões à Venda.",
 };
 
 export default function AnunciarPage() {
   return (
     <main className="public-page">
       <PublicHeader />
 
       <section className="wrap public-hero">
-        <div>
-          <span className="mini">Anunciar caminhão</span>
-          <h1>Venda com apresentação organizada e contato direto.</h1>
-          <p>Envie fotos reais, dados principais, valor, cidade e WhatsApp. O anúncio fica mais claro para o comprador e mais fácil de negociar.</p>
+        <div className="hero-copy">
+          <span className="mini">Anúncios profissionais</span>
+          <h1>Anunciar caminhão</h1>
+          <p className="hero-lead">Venda seu caminhão com apresentação organizada e contato direto.</p>
+          <p>Envie fotos reais, dados principais, valor, cidade e WhatsApp.</p>
           <div className="hero-actions">
             <Link href="/cadastro" className="btn primary">Começar anúncio</Link>
             <Link href="/anuncios" className="btn ghost">Ver caminhões</Link>
           </div>
         </div>
-        <aside>
-          <strong>4 passos</strong>
-          <span>Dados, fotos, revisão e publicação.</span>
+
+        <aside className="hero-panel" aria-label="Prévia visual de um anúncio de caminhão">
+          <div className="truck-preview">
+            <div className="photo-card">
+              <div className="truck-illustration" aria-hidden="true">
+                <span className="truck-cargo" />
+                <span className="truck-cab" />
+                <span className="truck-wheel wheel-left" />
+                <span className="truck-wheel wheel-right" />
+              </div>
+            </div>
+            <div className="preview-content">
+              <span className="status-pill">Contato direto</span>
+              <strong>Caminhão anunciado com dados claros</strong>
+              <div className="preview-lines" aria-hidden="true">
+                <i />
+                <i />
+                <i />
+              </div>
+            </div>
+          </div>
         </aside>
       </section>
 
       <section className="wrap public-card-grid">
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
 
       <section className="wrap public-cta">
         <div>
           <span className="mini">Próximo passo</span>
           <h2>Crie sua conta e envie o caminhão para aprovação.</h2>
           <p>A troca entra como opção dentro do anúncio. O foco é deixar tudo simples, claro e direto.</p>
         </div>
         <Link href="/cadastro">Criar conta e anunciar</Link>
       </section>
 
       <SiteFooter />
 
       <style>{`
-        .public-page{min-height:100vh;color:var(--site-text);background:radial-gradient(circle at 82% -12%,color-mix(in srgb,var(--site-green) 18%,transparent),transparent 34%),radial-gradient(circle at 8% 4%,color-mix(in srgb,var(--site-gold) 10%,transparent),transparent 27%),linear-gradient(180deg,var(--site-bg),var(--site-bg-2));overflow-x:hidden;padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}.mini{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 28%,transparent);color:var(--site-green);font-size:12px;font-weight:950;letter-spacing:.06em;text-transform:uppercase}.public-hero{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:20px;align-items:stretch;margin-top:10px;padding:30px;border-radius:30px;background:linear-gradient(115deg,var(--site-surface),color-mix(in srgb,var(--site-surface) 70%,transparent)),radial-gradient(circle at 82% 18%,color-mix(in srgb,var(--site-green) 22%,transparent),transparent 28%);border:1px solid var(--site-line);box-shadow:var(--site-shadow);overflow:hidden}.public-hero h1{margin:14px 0 10px;max-width:840px;font-size:clamp(34px,4.4vw,58px);line-height:.98;letter-spacing:-.06em}.public-hero p{margin:0;max-width:760px;color:var(--site-muted);font-size:16px;line-height:1.55;font-weight:720}.public-hero aside{display:flex;flex-direction:column;justify-content:flex-end;padding:20px;border-radius:24px;background:var(--site-surface-2);border:1px solid var(--site-line)}.public-hero aside strong{font-size:40px;line-height:1;color:var(--site-green);letter-spacing:-.05em}.public-hero aside span{margin-top:8px;color:var(--site-muted);font-weight:900}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}.btn,.public-cta>a{min-height:50px;display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:0 20px;border-radius:999px;border:1px solid var(--site-line);font-size:12px;font-weight:950;letter-spacing:.04em;text-transform:uppercase;text-decoration:none}.primary,.public-cta>a{background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;border-color:transparent;box-shadow:0 14px 34px color-mix(in srgb,var(--site-green) 22%,transparent)}.ghost{background:var(--site-surface-2);color:var(--site-text)}.public-card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:18px}.public-card-grid article,.public-cta{background:var(--site-surface);border:1px solid var(--site-line);border-radius:24px;box-shadow:var(--site-shadow-soft);padding:24px}.public-card-grid article>span{width:40px;height:40px;border-radius:16px;background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;display:grid;place-items:center;font-weight:950;margin-bottom:16px}.public-card-grid b{display:block;color:var(--site-text);font-size:20px;margin-bottom:12px}.public-card-grid ul{margin:0;padding-left:20px;color:var(--site-muted);line-height:1.85}.public-card-grid p{margin:0;color:var(--site-muted);line-height:1.65}.public-cta{margin-top:18px;display:flex;align-items:center;justify-content:space-between;gap:22px}.public-cta h2{margin:14px 0 8px;font-size:clamp(28px,4vw,44px);line-height:1.05;letter-spacing:-.045em}.public-cta p{margin:0;color:var(--site-muted);font-size:17px;line-height:1.55}@media(max-width:900px){.public-hero,.public-card-grid{grid-template-columns:1fr}.public-cta{display:block}.public-cta>a{margin-top:18px}}@media(max-width:640px){.wrap{width:calc(100vw - 22px)}.public-hero{padding:22px;border-radius:24px}.public-hero h1{font-size:34px}.hero-actions{display:grid}.btn,.public-cta>a{width:100%}}
+        .public-page{--announce-bg:#07111f;--announce-bg-2:#0b1728;--announce-surface:rgba(255,255,255,.075);--announce-surface-2:rgba(255,255,255,.105);--announce-line:rgba(255,255,255,.14);--announce-text:#f8fafc;--announce-muted:#b7c2d1;--announce-blue:var(--blue,#1877f2);--announce-blue-2:var(--blue2,#0f5fc8);--announce-green:var(--wa,#25d366);--announce-green-soft:rgba(37,211,102,.12);--announce-shadow:0 18px 46px rgba(0,0,0,.28);--announce-shadow-soft:0 12px 30px rgba(0,0,0,.18);min-height:100vh;color:var(--announce-text);background:radial-gradient(circle at 84% -10%,rgba(24,119,242,.18),transparent 34%),radial-gradient(circle at 10% 6%,rgba(37,211,102,.11),transparent 25%),linear-gradient(180deg,var(--announce-bg),var(--announce-bg-2));overflow-x:hidden;padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}.mini{display:inline-flex;align-items:center;min-height:30px;padding:0 12px;border-radius:999px;background:var(--announce-green-soft);border:1px solid rgba(37,211,102,.28);color:var(--announce-green);font-size:12px;font-weight:950;letter-spacing:.06em;text-transform:uppercase}.public-hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(290px,370px);gap:22px;align-items:stretch;margin-top:16px;padding:28px;border-radius:28px;background:linear-gradient(120deg,rgba(255,255,255,.09),rgba(255,255,255,.055)),radial-gradient(circle at 80% 18%,rgba(24,119,242,.18),transparent 30%);border:1px solid var(--announce-line);box-shadow:var(--announce-shadow);overflow:hidden}.hero-copy{display:flex;flex-direction:column;justify-content:center;min-height:330px}.public-hero h1{margin:14px 0 10px;max-width:720px;font-size:clamp(34px,4.2vw,54px);line-height:1;letter-spacing:-.045em}.public-hero p{margin:0;max-width:650px;color:var(--announce-muted);font-size:16px;line-height:1.58;font-weight:720}.public-hero .hero-lead{margin-bottom:4px;color:var(--announce-text);font-size:clamp(18px,2vw,22px);font-weight:850}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.btn,.public-cta>a{min-height:50px;display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:0 20px;border-radius:999px;border:1px solid var(--announce-line);font-size:12px;font-weight:950;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;transition:transform .18s ease,box-shadow .18s ease,background .18s ease}.btn:hover,.public-cta>a:hover{transform:translateY(-1px)}.primary,.public-cta>a{background:linear-gradient(135deg,var(--announce-blue),var(--announce-blue-2));color:#fff;border-color:transparent;box-shadow:0 14px 34px rgba(24,119,242,.24)}.ghost{background:rgba(255,255,255,.08);color:var(--announce-text)}.hero-panel{display:flex;align-items:center;justify-content:center}.truck-preview{width:100%;display:grid;gap:14px;padding:16px;border-radius:24px;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.07));border:1px solid var(--announce-line);box-shadow:var(--announce-shadow-soft)}.photo-card{min-height:176px;border-radius:20px;background:linear-gradient(145deg,rgba(15,23,42,.96),rgba(30,41,59,.78));border:1px solid rgba(255,255,255,.12);display:grid;place-items:center;overflow:hidden}.truck-illustration{position:relative;width:min(260px,86%);height:118px}.truck-cargo,.truck-cab,.truck-wheel{position:absolute;display:block}.truck-cargo{left:5px;bottom:35px;width:148px;height:58px;border-radius:12px 10px 8px 8px;background:linear-gradient(135deg,#e8eef7,#9fb1c7);box-shadow:inset 0 -10px 18px rgba(15,23,42,.16)}.truck-cab{right:14px;bottom:35px;width:86px;height:70px;border-radius:14px 18px 10px 8px;background:linear-gradient(135deg,#2f80ed,#1260c6);box-shadow:inset 0 -12px 20px rgba(3,37,76,.25)}.truck-cab:before{content:"";position:absolute;right:12px;top:13px;width:35px;height:23px;border-radius:8px;background:rgba(255,255,255,.76)}.truck-cab:after{content:"";position:absolute;left:-154px;right:5px;bottom:-12px;height:14px;border-radius:999px;background:#253449}.truck-wheel{bottom:15px;width:34px;height:34px;border-radius:50%;background:#07111f;border:7px solid #44546a;box-shadow:0 5px 10px rgba(0,0,0,.22)}.wheel-left{left:48px}.wheel-right{right:38px}.preview-content{display:grid;gap:10px}.status-pill{width:max-content;min-height:28px;display:inline-flex;align-items:center;padding:0 10px;border-radius:999px;background:var(--announce-green-soft);color:var(--announce-green);font-size:12px;font-weight:950}.preview-content strong{font-size:18px;line-height:1.2;letter-spacing:-.025em}.preview-lines{display:grid;gap:7px}.preview-lines i{display:block;height:9px;border-radius:999px;background:rgba(255,255,255,.12)}.preview-lines i:nth-child(1){width:78%}.preview-lines i:nth-child(2){width:58%}.preview-lines i:nth-child(3){width:66%}.public-card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:18px}.public-card-grid article,.public-cta{background:var(--announce-surface);border:1px solid var(--announce-line);border-radius:24px;box-shadow:var(--announce-shadow-soft);padding:24px}.public-card-grid article>span{width:40px;height:40px;border-radius:15px;background:rgba(37,211,102,.13);border:1px solid rgba(37,211,102,.28);color:var(--announce-green);display:grid;place-items:center;font-weight:950;margin-bottom:16px}.public-card-grid b{display:block;color:var(--announce-text);font-size:20px;margin-bottom:12px;letter-spacing:-.025em}.public-card-grid ul{margin:0;padding-left:20px;color:var(--announce-muted);line-height:1.85}.public-card-grid p{margin:0;color:var(--announce-muted);line-height:1.65}.public-cta{margin-top:18px;display:flex;align-items:center;justify-content:space-between;gap:22px;background:linear-gradient(120deg,rgba(255,255,255,.09),rgba(255,255,255,.06))}.public-cta h2{margin:14px 0 8px;font-size:clamp(26px,3.4vw,40px);line-height:1.05;letter-spacing:-.04em}.public-cta p{margin:0;color:var(--announce-muted);font-size:17px;line-height:1.55}@media(max-width:900px){.public-hero,.public-card-grid{grid-template-columns:1fr}.hero-copy{min-height:auto}.hero-panel{justify-content:stretch}.public-cta{display:block}.public-cta>a{margin-top:18px}}@media(max-width:640px){.wrap{width:calc(100vw - 22px)}.public-hero{margin-top:12px;padding:20px;border-radius:24px}.public-hero h1{font-size:34px}.hero-actions{display:grid}.btn,.public-cta>a{width:100%}.photo-card{min-height:150px}.truck-illustration{transform:scale(.86)}.public-card-grid article,.public-cta{padding:20px}}
       `}</style>
     </main>
   );
 }
 
EOF
)
