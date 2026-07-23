import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { parseUserAgent, getClientIP, getClientLocation } from "@/lib/security-tracking";

export async function POST(request: Request) {
  try {
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Não autenticado." }, { status: 401 });
    }

    const { data: profile } = await supabaseUser
      .from("profiles")
      .select("role, email, name, nome")
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.role === "admin";

    const body = await request.json();
    const { sessionToken, isHeartbeat } = body;

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Token de sessão é obrigatório." }, { status: 400 });
    }

    const headers = request.headers;
    const rawUserAgent = headers.get("user-agent") || "";
    const navegador = parseUserAgent(rawUserAgent);
    const ip = getClientIP(headers);
    const location = await getClientLocation(headers, ip);
    const cidade = location.cidade;

    const supabaseAdmin = createServiceClient();

    // 1. Verificar se a sessão já existe
    const { data: sessionExistente } = await supabaseAdmin
      .from("user_sessions")
      .select("id, online_seconds, session_token")
      .eq("session_token", sessionToken)
      .maybeSingle();

    if (sessionExistente) {
      // Atualizar sessão existente (Heartbeat)
      const newOnlineSeconds = (sessionExistente.online_seconds || 0) + (isHeartbeat ? 30 : 0);
      await supabaseAdmin
        .from("user_sessions")
        .update({
          ultimo_acesso: new Date().toISOString(),
          online_seconds: newOnlineSeconds,
          status: "online",
          ip,
          cidade,
          navegador
        })
        .eq("id", sessionExistente.id);

      return NextResponse.json({
        success: true,
        session_id: sessionExistente.id,
        online_seconds: newOnlineSeconds,
        cidade,
        navegador
      });
    } else {
      // 2. Nova Sessão Criada
      const { data: newSession, error: createError } = await supabaseAdmin
        .from("user_sessions")
        .insert([
          {
            user_id: user.id,
            session_token: sessionToken,
            user_agent: rawUserAgent,
            navegador,
            ip,
            cidade,
            estado: location.estado,
            pais: location.pais,
            is_admin: isAdmin,
            status: "online",
            online_seconds: 0,
            ultimo_acesso: new Date().toISOString(),
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error("Erro ao criar sessão:", createError);
      }

      // 3. Se for ADMINISTRADOR e uma nova sessão foi iniciada, disparar Alerta de Segurança Multidispositivo!
      if (isAdmin) {
        const nomeUsuario = profile?.name || profile?.nome || profile?.email || "Administrador";

        await supabaseAdmin.from("admin_security_alerts").insert([
          {
            user_id: user.id,
            session_id: newSession?.id || null,
            titulo: "🚨 Novo Login de Admin Detectado",
            mensagem: `Novo acesso iniciado por ${nomeUsuario} em ${navegador} (${cidade} - IP: ${ip}).`,
            navegador,
            cidade,
            ip,
            lido: false,
            created_at: new Date().toISOString()
          }
        ]);

        // Registrar também na auditoria geral
        await supabaseAdmin.from("audit_logs").insert([
          {
            usuario_id: user.id,
            acao: "login_admin",
            detalhes: {
              session_token: sessionToken,
              navegador,
              cidade,
              ip
            },
            ip,
            navegador,
            cidade,
            entidade: "autenticacao",
            path: "/admin",
            created_at: new Date().toISOString()
          }
        ]);
      }

      return NextResponse.json({
        success: true,
        session_id: newSession?.id,
        is_new_session: true,
        cidade,
        navegador
      });
    }
  } catch (error: any) {
    console.error("Erro na API de sessão:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Não autenticado." }, { status: 401 });
    }

    const { data: profile } = await supabaseUser
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ success: false, error: "Acesso negado." }, { status: 403 });
    }

    const supabaseAdmin = createServiceClient();

    const { data: sessions, error } = await supabaseAdmin
      .from("user_sessions")
      .select("*, perfis(id, email, nome, role)")
      .order("ultimo_acesso", { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ success: true, data: sessions || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
