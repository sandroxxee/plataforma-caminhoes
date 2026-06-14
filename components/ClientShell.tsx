"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <>
      <PwaRegister />
      <WhatsappClickTracker />
      <CopyProtection />
      <MobileBottomNav isLoggedIn={isLoggedIn} />
    </>
  );
}
