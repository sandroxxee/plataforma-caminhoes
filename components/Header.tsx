import Link from "next/link";
import { Truck } from "lucide-react";

export function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <span className="brand-icon"><Truck size={22} /></span>
          <span>CAMINHÕES EM OFERTA<small>Plataforma de anúncios de caminhões</small></span>
        </Link>
        <nav className="nav">
          <Link href="/anuncios">Anúncios</Link>
          <Link href="/anunciar">Como funciona</Link>
          <Link href="/anunciar">Vantagens</Link>
          <Link href="/anunciar">Dúvidas</Link>
        </nav>
        <div className="actions">
          <Link className="btn" href="/login">Entrar</Link>
          <Link className="btn primary" href="/anunciar">Anunciar</Link>
        </div>
      </div>
    </header>
  );
}
