'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function BotaoAnunciarFlutuante() {
  const pathname = usePathname()
  const [hover, setHover] = useState(false)

  // Nao exibe na propria pagina do agente ou no painel admin
  if (
    pathname?.startsWith('/anunciar-gratis') ||
    pathname?.startsWith('/painel') ||
    pathname?.startsWith('/admin')
  ) return null

  return (
    <Link
      href="/anunciar-gratis"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-2xl transition-all duration-300 group"
      style={{
        padding: hover ? '14px 22px' : '14px 18px',
      }}
      aria-label="Anunciar caminhao gratis"
    >
      <span className="text-2xl leading-none">🚛</span>
      <span
        className="overflow-hidden whitespace-nowrap transition-all duration-300 text-sm"
        style={{ maxWidth: hover ? '160px' : '0px', opacity: hover ? 1 : 0 }}
      >
        Anunciar Grátis
      </span>
    </Link>
  )
}
