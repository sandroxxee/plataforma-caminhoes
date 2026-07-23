import { createServiceClient } from "@/lib/supabase/service";

/**
 * Formata o User Agent em uma string amigável de Navegador + Sistema Operacional
 * Exemplo: "Chrome 126 no Windows", "Safari (iPhone / iOS)", "Edge no macOS"
 */
export function parseUserAgent(ua?: string | null): string {
  if (!ua) return "Navegador Desconhecido";

  let browser = "Navegador Desconhecido";
  let os = "Sistema Desconhecido";

  // Detecção de Sistema Operacional
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS (iPhone/iPad)";
  else if (/android/i.test(ua)) os = "Android";
  else if (/linux/i.test(ua)) os = "Linux";

  // Detecção de Navegador
  if (/edg\//i.test(ua)) {
    const match = ua.match(/edg\/([\d.]+)/i);
    browser = `Microsoft Edge ${match ? match[1].split(".")[0] : ""}`.trim();
  } else if (/opr\/|opera/i.test(ua)) {
    const match = ua.match(/(?:opr|opera)\/([\d.]+)/i);
    browser = `Opera ${match ? match[1].split(".")[0] : ""}`.trim();
  } else if (/chrome|crios/i.test(ua) && !/chromium|edg|opr/i.test(ua)) {
    const match = ua.match(/(?:chrome|crios)\/([\d.]+)/i);
    browser = `Google Chrome ${match ? match[1].split(".")[0] : ""}`.trim();
  } else if (/firefox|fxios/i.test(ua)) {
    const match = ua.match(/(?:firefox|fxios)\/([\d.]+)/i);
    browser = `Mozilla Firefox ${match ? match[1].split(".")[0] : ""}`.trim();
  } else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) {
    const match = ua.match(/version\/([\d.]+)/i);
    browser = `Apple Safari ${match ? match[1].split(".")[0] : ""}`.trim();
  }

  return `${browser} no ${os}`;
}

/**
 * Extrai IP do cliente a partir dos cabeçalhos da requisição
 */
export function getClientIP(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  return "127.0.0.1";
}

/**
 * Obtém a cidade e estado da requisição (utiliza cabeçalhos da Vercel/Cloudflare ou IP Geolocation)
 */
export async function getClientLocation(headers: Headers, clientIp?: string): Promise<{ cidade: string; estado: string; pais: string }> {
  // 1. Cabeçalhos Vercel / Cloudflare
  const vercelCity = headers.get("x-vercel-ip-city");
  const vercelRegion = headers.get("x-vercel-ip-country-region");
  const vercelCountry = headers.get("x-vercel-ip-country");

  if (vercelCity) {
    const cityDecoded = decodeURIComponent(vercelCity);
    const stateStr = vercelRegion ? ` - ${vercelRegion}` : "";
    return {
      cidade: `${cityDecoded}${stateStr}`,
      estado: vercelRegion || "",
      pais: vercelCountry || "BR"
    };
  }

  const cfCity = headers.get("cf-ipcity");
  if (cfCity) {
    const region = headers.get("cf-region-code") || "";
    const stateStr = region ? ` - ${region}` : "";
    return {
      cidade: `${cfCity}${stateStr}`,
      estado: region,
      pais: headers.get("cf-ipcountry") || "BR"
    };
  }

  // 2. Se for IP remoto válido, consultar IP API
  if (clientIp && clientIp !== "127.0.0.1" && clientIp !== "::1" && !clientIp.startsWith("192.168.")) {
    try {
      const res = await fetch(`https://ipapi.co/${clientIp}/json/`, {
        next: { revalidate: 3600 }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.city) {
          const region = data.region_code || data.region || "";
          const stateStr = region ? ` - ${region}` : "";
          return {
            cidade: `${data.city}${stateStr}`,
            estado: region,
            pais: data.country_name || "Brasil"
          };
        }
      }
    } catch {
      // Ignorar falha de API externa
    }
  }

  return {
    cidade: "Local / Não identificado",
    estado: "",
    pais: "BR"
  };
}

/**
 * Auxiliar para registrar um log de auditoria no Supabase
 */
export async function registrarAuditoria(params: {
  usuario_id?: string | null;
  acao: string;
  detalhes?: any;
  ip?: string | null;
  navegador?: string | null;
  cidade?: string | null;
  entidade?: string | null;
  path?: string | null;
}) {
  try {
    const supabase = createServiceClient();
    await supabase.from("audit_logs").insert([
      {
        usuario_id: params.usuario_id || null,
        acao: params.acao,
        detalhes: params.detalhes || {},
        ip: params.ip || null,
        navegador: params.navegador || null,
        cidade: params.cidade || null,
        entidade: params.entidade || null,
        path: params.path || null,
        created_at: new Date().toISOString()
      }
    ]);
  } catch (err) {
    console.error("Erro ao gravar log de auditoria:", err);
  }
}
