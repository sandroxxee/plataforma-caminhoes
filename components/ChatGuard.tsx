'use client';
import { usePathname } from 'next/navigation';
import ChatFlutuante from './ChatFlutuante';

// Rotas onde o chat público NÃO deve aparecer
const ROTAS_BLOQUEADAS = ['/admin', '/painel'];

export default function ChatGuard() {
  const pathname = usePathname();
  const bloqueado = ROTAS_BLOQUEADAS.some(rota => pathname.startsWith(rota));
  if (bloqueado) return null;
  return <ChatFlutuante />;
}
