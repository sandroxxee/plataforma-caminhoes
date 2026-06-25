// Re-export para compatibilidade com imports existentes
import AgentChat from "./AgentChat";
import React from "react";
export default function AgentePublico() {
  return <AgentChat variant="publico" />;
}
