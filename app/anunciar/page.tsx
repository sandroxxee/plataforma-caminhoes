export default function AnunciarPage() {
  return (
    <main className="min-h-screen bg-[#f3f6fb] px-4 py-8">
      <section className="mx-auto max-w-6xl">

        {/* TOPO */}
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[28px] bg-white p-8 shadow-sm border border-black/5">
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-700">
              Anunciar no Caminhões à Venda
            </span>

            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-zinc-950 md:text-6xl">
              Escolha o tipo de anúncio
            </h1>

            <p className="mt-5 max-w-2xl text-lg font-semibold leading-relaxed text-zinc-600">
              Cadastre caminhões ou implementos em um fluxo separado, organizado e enviado para aprovação antes de aparecer no site.
            </p>
          </div>

          <div className="rounded-[28px] bg-zinc-950 p-7 text-white shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-blue-300">
              Fluxo organizado
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-black">
                  1
                </span>
                <p className="font-bold">Escolha caminhão ou implemento</p>
              </div>

              <div className="flex gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-black">
                  2
                </span>
                <p className="font-bold">Entre ou crie sua conta</p>
              </div>

              <div className="flex gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-black">
                  3
                </span>
                <p className="font-bold">Preencha dados e fotos</p>
              </div>

              <div className="flex gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-black">
                  4
                </span>
                <p className="font-bold">Envie para aprovação</p>
              </div>
            </div>
          </div>
        </div>

        {/* ESCOLHA DO TIPO */}
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <a
            href="/painel/novo-anuncio?tipo=caminhao"
            className="group relative overflow-hidden rounded-[30px] bg-blue-600 p-8 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute right-[-40px] top-[-40px] h-44 w-44 rounded-full bg-white/10" />
            <div className="absolute bottom-[-60px] right-10 h-36 w-36 rounded-full bg-white/10" />

            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-sm font-black">
              01
            </span>

            <p className="mt-8 text-sm font-black uppercase tracking-wide text-blue-100">
              Anúncio de caminhão
            </p>

            <h2 className="mt-2 text-4xl font-black tracking-tight">
              Anunciar caminhão
            </h2>

            <p className="mt-4 max-w-md font-semibold leading-relaxed text-blue-50">
              Cavalo mecânico, truck, bitruck, toco, caçamba, baú, prancha, tanque, munck e outros caminhões.
            </p>

            <div className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-blue-700 transition group-hover:scale-105">
              Começar como caminhão
            </div>
          </a>

          <a
            href="/painel/novo-anuncio?tipo=implemento"
            className="group relative overflow-hidden rounded-[30px] bg-white p-8 text-zinc-950 shadow-sm border border-black/5 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute right-[-40px] top-[-40px] h-44 w-44 rounded-full bg-blue-50" />
            <div className="absolute bottom-[-60px] right-10 h-36 w-36 rounded-full bg-blue-50" />

            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-blue-700">
              02
            </span>

            <p className="mt-8 text-sm font-black uppercase tracking-wide text-zinc-500">
              Anúncio de implemento
            </p>

            <h2 className="mt-2 text-4xl font-black tracking-tight">
              Anunciar implemento
            </h2>

            <p className="mt-4 max-w-md font-semibold leading-relaxed text-zinc-600">
              Carreta, caçamba, prancha, graneleiro, tanque, baú, sider, dolly, bitrem e outros implementos.
            </p>

            <div className="mt-8 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white transition group-hover:scale-105">
              Começar como implemento
            </div>
          </a>
        </div>

        {/* JÁ TEM CONTA */}
        <div className="mt-5 flex flex-col gap-4 rounded-[24px] bg-white p-5 shadow-sm border border-black/5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-black text-zinc-950">
              Já tem conta?
            </h3>
            <p className="mt-1 font-semibold text-zinc-600">
              Entre no painel para cadastrar, revisar ou acompanhar seus anúncios.
            </p>
          </div>

          <a
            href="/painel"
            className="inline-flex justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-600"
          >
            Entrar no painel
          </a>
        </div>

        {/* ETAPAS */}
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            ["1", "Escolha o tipo", "Caminhão e implemento têm informações diferentes, por isso começam separados."],
            ["2", "Acesse sua conta", "Crie cadastro ou entre no painel para manter seus anúncios organizados."],
            ["3", "Preencha os dados", "Informe modelo, ano, valor, WhatsApp, descrição e fotos reais."],
            ["4", "Envie para aprovação", "O anúncio fica pendente até revisão antes de aparecer publicamente."],
          ].map(([numero, titulo, texto]) => (
            <div
              key={numero}
              className="rounded-[24px] bg-white p-5 shadow-sm border border-black/5"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-blue-700">
                {numero}
              </span>

              <h4 className="mt-5 text-lg font-black text-zinc-950">
                {titulo}
              </h4>

              <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600">
                {texto}
              </p>
            </div>
          ))}
        </div>

        {/* AVISO */}
        <div className="mt-5 rounded-[24px] border border-blue-100 bg-blue-50 p-5">
          <p className="text-sm font-bold leading-relaxed text-blue-900">
            O anúncio só aparece no site depois de aprovado. Isso ajuda a manter os anúncios organizados, com informações claras e melhor apresentação para compradores.
          </p>
        </div>

      </section>
    </main>
  );
}
