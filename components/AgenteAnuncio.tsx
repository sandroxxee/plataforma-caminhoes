// Re-export para compatibilidade com imports existentes
export { AgentChat as AgenteAnuncio } from "./AgentChat";

import AgentChat from "./AgentChat";
import React from "react";
export default function AgenteAnuncioCompat() {
  return <AgentChat variant="anuncio" />;
}
