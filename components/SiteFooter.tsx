import Link from "next/link";
import { Truck, Shield, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="sf-inner">
        <section className="sf-section sf-about">
          <div className="sf-logo">
            <Truck size={24} />
            <strong className="sf-brand">Caminhões à Venda</strong>
          </div>
          <p className="sf-desc">
            A maior plataforma de anúncios especializados em veículos pesados do Brasil. Conectamos compradores e vendedores de forma direta e segura.
          </p>
          <div className="sf-badges">
            <div className="sf-badge"><Shield size={16} /><span>Anúncios Verificados</span></div>
          </div>
        </section>

        <section className="sf-section">
          <strong className="sf-head">Categorias</strong>
          <Link className="sf-link" href="/anuncios">Caminhões</Link>
          <Link className="sf-link" href="/carretas">Carretas</Link>
          <Link className="sf-link" href="/implementos">Implementos</Link>
          <Link className="sf-link" href="/pecas">Peças e Acessórios</Link>
          <Link className="sf-link" href="/maquinas">Máquinas Pesadas</Link>
        </section>

        <section className="sf-section">
          <strong className="sf-head">Institucional</strong>
          <Link className="sf-link" href="/sobre">Quem Somos</Link>
          <Link className="sf-link" href="/como-funciona">Como Funciona</Link>
          <Link className="sf-link" href="/anunciar">Anunciar Grátis</Link>
          <Link className="sf-link" href="/parceiros">Parceiros</Link>
        </section>

        <section className="sf-section">
          <strong className="sf-head">Suporte</strong>
          <Link className="sf-link" href="/contato">Fale Conosco</Link>
          <Link className="sf-link" href="/politica-de-privacidade">Privacidade</Link>
          <Link className="sf-link" href="/termos">Termos de Uso</Link>
        </section>

        <section className="sf-section">
          <strong className="sf-head">Contato</strong>
          <a className="sf-link sf-contact" href="https://wa.me/5549999362681" target="_blank" rel="noreferrer">
            <Phone size={14} /> WhatsApp Suporte
          </a>
          <a className="sf-link sf-contact" href="mailto:contato@caminhoesavenda.com">
            <Mail size={14} /> E-mail Comercial
          </a>
        </section>
      </div>

      <div className="sf-bottom">
        <p className="sf-copy">
          © 2026 Caminhões à Venda. A negociação e verificação do veículo são de responsabilidade das partes.
        </p>
      </div>
    </footer>
  );
}
