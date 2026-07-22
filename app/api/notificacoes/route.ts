import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, corpo, revenda_id, expo_tokens, dados } = body;

    if (!titulo || !corpo) {
      return NextResponse.json({ success: false, error: "Título e Corpo são obrigatórios." }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Salvar notificação na base
    const { data, error } = await supabase
      .from("notificacoes_push")
      .insert([
        {
          revenda_id: revenda_id || null,
          titulo,
          corpo,
          dados: dados || {},
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Se houver tokens da Expo, enviar para a API da Expo
    let expoResult = null;
    if (expo_tokens && Array.isArray(expo_tokens) && expo_tokens.length > 0) {
      const messages = expo_tokens.map((token: string) => ({
        to: token,
        sound: "default",
        title: titulo,
        body: corpo,
        data: dados || {},
      }));

      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });

      expoResult = await response.json();
    }

    return NextResponse.json({
      success: true,
      data,
      expo_result: expoResult || "Notificação registrada no banco. (Sem tokens informados para envio imediato)",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
