"use client";

import dynamic from "next/dynamic";

// Componentes client-only carregados de forma lazy
// Separados do layout.tsx para compatibilidade com Turbopack
const PwaRegister = dynamic(() => import("@/components/PwaRegister"), {
  ssr: false,
  loading: () => null,
});

const WhatsappClickTracker = dynamic(() => import("@/components/WhatsappClickTracker"), {
  ssr: false,
  loading: () => null,
});

const CopyProtection = dynamic(() => import("@/components/CopyProtection"), {
  ssr: false,
  loading: () => null,
});

const MobileBottomNav = dynamic(() => import("@/components/MobileBottomNav"), {
  ssr: false,
  loading: () => null,
});

export function ClientShell() {
  return (
    <>
      <PwaRegister />
      <WhatsappClickTracker />
      <CopyProtection />
      <MobileBottomNav />
    </>
  );
}
