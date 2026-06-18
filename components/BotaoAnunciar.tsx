'use client';

export default function BotaoAnunciar() {
  const abrirChat = () => {
    const evento = new CustomEvent('abrir-chat-gemini');
    window.dispatchEvent(evento);
  };

  return (
    <button
      onClick={abrirChat}
      className="bg-zinc-950 hover:bg-zinc-900 text-white font-medium text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-zinc-800 tracking-wide"
    >
      Falar com Assistente (Anunciar / Cadastrar)
    </button>
  );
}
