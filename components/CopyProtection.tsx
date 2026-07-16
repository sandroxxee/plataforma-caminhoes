"use client";

import { useEffect, useState } from "react";

const PROTECTION_MESSAGE =
  "Conteúdo protegido. Para informações, fale com o Caminhões à Venda pelo WhatsApp.";

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return Boolean(
    target.closest(
      "input, textarea, select, [contenteditable='true'], [data-copy-allowed='true']"
    )
  );
}

export function CopyProtection() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const showProtectionMessage = () => {
      setMessage(PROTECTION_MESSAGE);

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setMessage(""), 2200);
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      showProtectionMessage();
    };

    const handleCopy = (event: ClipboardEvent) => {
      if (isEditableTarget(event.target)) return;

      event.preventDefault();
      showProtectionMessage();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.key) return;
      const key = event.key.toLowerCase();
      const ctrlOrMeta = event.ctrlKey || event.metaKey;
      const blockedDevToolsShortcut =
        event.key === "F12" ||
        (ctrlOrMeta && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        (ctrlOrMeta && ["u", "s"].includes(key));

      const blockedCopyShortcut =
        ctrlOrMeta && ["c", "x"].includes(key) && !isEditableTarget(event.target);

      if (!blockedDevToolsShortcut && !blockedCopyShortcut) return;

      event.preventDefault();
      event.stopPropagation();
      showProtectionMessage();
    };

    const style = document.createElement("style");
    style.setAttribute("data-copy-protection", "true");
    style.textContent = `
      body.copy-protection-active :not(input):not(textarea):not(select):not([contenteditable='true']):not([data-copy-allowed='true']) {
        -webkit-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
    `;

    document.body.classList.add("copy-protection-active");
    document.head.appendChild(style);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.body.classList.remove("copy-protection-active");
      style.remove();
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 18,
        zIndex: 9999,
        transform: "translateX(-50%)",
        width: "min(92vw, 520px)",
        borderRadius: 14,
        background: "#111827",
        color: "#ffffff",
        padding: "12px 16px",
        textAlign: "center",
        fontSize: 14,
        fontWeight: 800,
        boxShadow: "0 16px 38px rgba(0, 0, 0, .28)",
      }}
    >
      {message}
    </div>
  );
}
