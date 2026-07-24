import { NextRequest, NextResponse } from "next/server";

function normalizarPlaca(placa: string): string {
  return placa.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function validarPlaca(placa: string): boolean {
  const antiga = /^[A-Z]{3}[0-9]{4}$/;
  const mercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  return antiga.test(placa) || mercosul.test(placa);
}

export async function GET(req: NextRequest) {
  const placa = req.nextUrl.searchParams.get("placa");

  if (!placa) {
    return NextResponse.json({ error: "Placa não informada" }, { status: 400 });
  }

  const placaNormalizada = normalizarPlaca(placa);

  if (!validarPlaca(placaNormalizada)) {
    return NextResponse.json({ error: "Placa inválida. Use o formato ABC-1234 ou ABC1D23." }, { status: 422 });
  }

  const apiKey = process.env.WDAPI_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Chave de API não configurada no servidor." }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://wdapi2.com.br/consulta/${placaNormalizada}/${apiKey}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      throw new Error(`Erro HTTP ${res.status}`);
    }

    const dados = await res.json();

    if (dados.erro || dados.message) {
      return NextResponse.json(
        { error: "Placa não encontrada ou inválida." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      marca: dados.MARCA || "",
      modelo: dados.MODELO || "",
      ano: dados.ANOMODELO || dados.ANOFAB || "",
      cor: dados.COR || "",
      municipio: dados.municipio || "",
      uf: dados.uf || "",
      combustivel: dados.COMBUSTIVEL || "",
    });
  } catch (err) {
    console.error("[consulta-placa]", err);
    return NextResponse.json(
      { error: "Não foi possível consultar a placa. Tente novamente." },
      { status: 500 }
    );
  }
}
