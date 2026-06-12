// Esta rota foi movida para /caminhoes/estado/[uf] para evitar conflito ambíguo com /anuncios/[id]
// Este arquivo NAO pode existir como rota dinâmica — o redirect deve ser feito via middleware
export { default } from "@/app/caminhoes/estado/[uf]/page";
export { generateMetadata, generateStaticParams } from "@/app/caminhoes/estado/[uf]/page";
