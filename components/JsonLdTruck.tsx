type Props = { titulo: string; descricao?: string; preco?: number | null; imagem?: string; marca?: string; modelo?: string; ano?: number; url: string; };

export function JsonLdTruck({ titulo, descricao, preco, imagem, marca, modelo, ano, url }: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: titulo,
    description: descricao || titulo,
    ...(imagem ? { image: imagem } : {}),
    ...(marca ? { brand: { "@type": "Brand", name: marca } } : {}),
    ...(modelo || ano ? { model: [modelo, ano].filter(Boolean).join(" ") } : {}),
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      ...(preco ? { price: preco } : { priceSpecification: { "@type": "UnitPriceSpecification", description: "Consulte" } }),
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Plataforma de Caminhões" },
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
