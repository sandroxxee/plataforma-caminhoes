async headers() {
  return [
    {
      // só para rotas autenticadas (painel, admin)
      source: "/(painel|admin)(.*)",
      headers: [
        { key: "Cache-Control", value: "no-store" },
      ],
    },
    {
      // rotas públicas — permite cache
      source: "/(anuncios|caminhoes|carretas|maquinas)(.*)",
      headers: [
        { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" },
      ],
    },
  ];
}
