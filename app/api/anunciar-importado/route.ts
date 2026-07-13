import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { nome, email, telefone, senha, dadosOlx } = await req.json();

    if (!nome || !email || !telefone || !senha || !dadosOlx) {
      return NextResponse.json({ error: "Preencha todos os campos do formulário." }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Cadastrar usuário no Auth
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          full_name: nome,
          name: nome,
          telefone: telefone.replace(/\D/g, ""),
        },
      },
    });

    if (signupError) {
      return NextResponse.json({ error: signupError.message }, { status: 400 });
    }

    // 2. Fazer login automático para obter a sessão/cookies
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (loginError) {
      return NextResponse.json({ error: "Conta criada, mas falhou ao entrar automaticamente. Entre pela tela de login." }, { status: 400 });
    }

    const userId = loginData.user?.id || signupData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Erro ao criar perfil de usuário." }, { status: 400 });
    }

    // 3. Atualizar/Inserir perfil do anunciante
    await supabase.from("profiles").upsert({
      id: userId,
      email,
      nome,
      telefone: telefone.replace(/\D/g, ""),
      role: "anunciante",
    });

    // Extrair dados da OLX
    const titulo = dadosOlx.titulo || "Veículo importado";
    const preco = dadosOlx.preco || null;
    const cidade = dadosOlx.cidade || "";
    const estado = dadosOlx.estado || "";
    const descricao = dadosOlx.descricao || "";

    // Tentar extrair marca/modelo baseado no título
    let marca = "";
    let modelo = "";
    const lowerTitle = titulo.toLowerCase();
    if (lowerTitle.includes("volvo")) { marca = "Volvo"; modelo = titulo.replace(/volvo/i, "").trim(); }
    else if (lowerTitle.includes("scania")) { marca = "Scania"; modelo = titulo.replace(/scania/i, "").trim(); }
    else if (lowerTitle.includes("mercedes") || lowerTitle.includes("mb")) { marca = "Mercedes-Benz"; modelo = titulo.replace(/mercedes-benz|mercedes|mb/i, "").trim(); }
    else if (lowerTitle.includes("volkswagen") || lowerTitle.includes("vw")) { marca = "Volkswagen"; modelo = titulo.replace(/volkswagen|vw/i, "").trim(); }
    else if (lowerTitle.includes("iveco")) { marca = "Iveco"; modelo = titulo.replace(/iveco/i, "").trim(); }
    else if (lowerTitle.includes("daf")) { marca = "DAF"; modelo = titulo.replace(/daf/i, "").trim(); }
    else { marca = "Outra"; modelo = titulo; }

    // 4. Criar o anúncio (tabela trucks)
    const { data: truck, error: truckError } = await supabase
      .from("trucks")
      .insert({
        user_id: userId,
        titulo,
        marca,
        modelo: modelo.slice(0, 50),
        ano_fabricacao: null,
        ano_modelo: null,
        preco,
        cidade,
        estado,
        carroceria: "",
        tracao: "",
        quilometragem: "",
        motor: "",
        cambio: "",
        combustivel: "",
        cor: "",
        descricao,
        whatsapp: telefone.replace(/\D/g, ""),
        status: "pendente",
        destaque: false,
        vendido: false,
        perfil: "Caminhão",
      })
      .select("id")
      .single();

    if (truckError || !truck) {
      return NextResponse.json({ error: "Erro ao cadastrar o anúncio na base de dados." }, { status: 400 });
    }

    // 5. Baixar as imagens remotas e fazer upload para o Storage
    const imagens = dadosOlx.imagens || [];
    for (let i = 0; i < imagens.length; i++) {
      const imgUrl = imagens[i];
      try {
        const resFoto = await fetch(imgUrl);
        if (!resFoto.ok) continue;

        const blob = await resFoto.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const extensao = "jpg";
        const nomeArquivo = `${userId}/${truck.id}/${Date.now()}-${i + 1}.${extensao}`;

        const { error: uploadError } = await supabase.storage
          .from("truck-images")
          .upload(nomeArquivo, buffer, {
            contentType: blob.type,
            cacheControl: "3600",
            upsert: false
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage.from("truck-images").getPublicUrl(nomeArquivo);
          await supabase.from("truck_images").insert({
            truck_id: truck.id,
            user_id: userId,
            image_url: publicUrlData.publicUrl,
            storage_path: nomeArquivo,
            principal: i === 0,
            ordem: i + 1,
          });
        }
      } catch (err) {
        console.error("Erro no download/upload da imagem da OLX:", imgUrl, err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no cadastro importado da OLX:", error);
    return NextResponse.json({ error: "Erro interno no servidor de importação." }, { status: 500 });
  }
}
