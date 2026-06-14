"use client";

import dynamic from "next/dynamic";

const PwaRegister = dynamic(
  () => import("@/components/PwaRegister").then((m) => ({ default: m.PwaRegister })),
  { ssr: false, loading: () => null }
);

const WhatsappClickTracker = dynamic(
  () => import("@/components/WhatsappClickTracker").then((m) => ({ default: m.WhatsappClickTracker })),
  { ssr: false, loading: () => null }
);

const CopyProtection = dynamic(
  () => import("@/components/CopyProtection").then((m) => ({ default: m.CopyProtection })),
  { ssr: false, loading: () => null }
);

const MobileBottomNav = dynamic(
  () => import("@/components/MobileBottomNav").then((m) => ({ default: m.MobileBottomNav })),
  { ssr: false, loading: () => null }
);

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
