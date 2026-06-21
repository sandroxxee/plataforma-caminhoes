"use client";

import { PublicHeaderClient } from "./PublicHeaderClient";

export function PanelHeaderWrapper({ isLoggedIn }: { isLoggedIn: boolean }) {
  return <PublicHeaderClient isLoggedIn={isLoggedIn} />;
}
