import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CadastroForm } from "./CadastroForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CadastroPage() {
  return (
    <main className="cadastro-solo-page">
      <PublicHeader />

      <div className="cadastro-solo-center">
        <div className="cadastro-card-wrap">
          <CadastroForm />
        </div>
      </div>

      <SiteFooter />

      <style>{`
        .cadastro-solo-page {
          min-height: 100vh;
          background: var(--soft);
          display: flex;
          flex-direction: column;
        }
        .cadastro-solo-center {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .cadastro-card-wrap {
          width: 100%;
          max-width: 460px;
        }
      `}</style>
    </main>
  );
}
