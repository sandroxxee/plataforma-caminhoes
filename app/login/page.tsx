import { PublicHeader } from "@/components/PublicHeader";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginPage() {
  return (
    <main className="login-solo-page">
      <PublicHeader />

      <div className="login-solo-center">
        <LoginForm />
      </div>

      <style>{`
        .login-solo-page {
          min-height: 100vh;
          background: var(--soft);
          display: flex;
          flex-direction: column;
        }
        .login-solo-center {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .login-solo-center .card {
          width: 100%;
          max-width: 440px;
        }
      `}</style>
    </main>
  );
}
