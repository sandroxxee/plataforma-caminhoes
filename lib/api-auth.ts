import { NextRequest } from 'next/server'
import { createPublicClient } from '@/lib/supabase/public'

// Reutiliza o singleton com service_role de public.ts — sem criar novo cliente
const supabaseAdmin = createPublicClient()

export type ApiAuthResult =
  | { success: true; keyId: string; keyName: string }
  | { success: false; error: string; status: number }

type ApiKeyRow = {
  id: string
  name: string
  is_active: boolean
  request_count: number
}

/**
 * Gera hash SHA-256 de uma string (usado na validação e na criação de chaves)
 */
export async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(key)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Valida a API Key recebida no header Authorization: Bearer <key>
 * Retorna sucesso com metadados da chave ou erro com status HTTP.
 */
export async function validateApiKey(req: NextRequest): Promise<ApiAuthResult> {
  const authHeader = req.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      error: 'Missing or invalid Authorization header. Use: Bearer <api_key>',
      status: 401,
    }
  }

  const rawKey = authHeader.replace('Bearer ', '').trim()

  if (!rawKey || rawKey.length < 16) {
    return {
      success: false,
      error: 'Invalid API key format.',
      status: 401,
    }
  }

  const keyHash = await hashApiKey(rawKey)

  const { data, error } = await (supabaseAdmin
    .from('api_keys')
    .select('id, name, is_active, request_count')
    .eq('key_hash', keyHash)
    .single() as unknown as Promise<{ data: ApiKeyRow | null; error: unknown }>)

  if (error || !data) {
    return {
      success: false,
      error: 'Invalid API key.',
      status: 401,
    }
  }

  if (!data.is_active) {
    return {
      success: false,
      error: 'This API key has been revoked.',
      status: 403,
    }
  }

  // Atualiza last_used_at e incrementa request_count (fire-and-forget)
  supabaseAdmin
    .from('api_keys')
    .update({
      last_used_at: new Date().toISOString(),
      request_count: data.request_count + 1,
    })
    .eq('id', data.id)

  return {
    success: true,
    keyId: data.id,
    keyName: data.name,
  }
}

/**
 * Gera uma nova API key aleatória no formato: pk_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * Retorna { rawKey, keyHash, keyPrefix } — rawKey deve ser exibido UMA vez e descartado.
 */
export async function generateApiKey(): Promise<{
  rawKey: string
  keyHash: string
  keyPrefix: string
}> {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32))
  const randomHex = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  const rawKey = `pk_live_${randomHex}`
  const keyHash = await hashApiKey(rawKey)
  const keyPrefix = rawKey.slice(0, 15)
  return { rawKey, keyHash, keyPrefix }
}
