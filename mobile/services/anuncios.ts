import { supabase } from '@/lib/supabase';
import type { Anuncio, AnuncioFiltros } from '@/types/anuncio';

const SELECT_FIELDS = `
  id, user_id, titulo, marca, modelo, ano_modelo, ano_fabricacao,
  preco, cidade, estado, carroceria, tracao, motor, cambio, km,
  descricao, whatsapp, destaque, views, status, vendido, perfil,
  created_at, truck_images(image_url, principal, ordem)
`.trim();

export async function getAnuncios(filtros: AnuncioFiltros = {}, limite = 20): Promise<Anuncio[]> {
  let query = supabase
    .from('trucks')
    .select(SELECT_FIELDS)
    .eq('status', 'aprovado')
    .eq('vendido', false)
    .order('destaque', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limite);

  if (filtros.marca) query = query.ilike('marca', filtros.marca);
  if (filtros.estado) query = query.eq('estado', filtros.estado);
  if (filtros.q) {
    query = query.or(
      `titulo.ilike.%${filtros.q}%,marca.ilike.%${filtros.q}%,modelo.ilike.%${filtros.q}%,cidade.ilike.%${filtros.q}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error('Erro ao buscar anúncios:', error.message);
    return [];
  }
  return (data || []) as Anuncio[];
}

export async function getAnuncioById(id: string): Promise<Anuncio | null> {
  const { data, error } = await supabase
    .from('trucks')
    .select(`
      id, user_id, titulo, marca, modelo, ano_modelo, ano_fabricacao,
      preco, cidade, estado, carroceria, tracao, motor, cambio, km,
      descricao, whatsapp, destaque, views, status, vendido, perfil,
      created_at, truck_images(image_url, principal, ordem)
    `)
    .eq('id', id)
    .eq('status', 'aprovado')
    .eq('vendido', false)
    .maybeSingle();

  if (error || !data) return null;
  return data as Anuncio;
}

export async function getAnunciosDestaque(limite = 6): Promise<Anuncio[]> {
  const { data, error } = await supabase
    .from('trucks')
    .select(SELECT_FIELDS)
    .eq('status', 'aprovado')
    .eq('vendido', false)
    .eq('destaque', true)
    .order('created_at', { ascending: false })
    .limit(limite);

  if (error) return [];
  return (data || []) as Anuncio[];
}

export async function getAnunciosRecentes(limite = 12): Promise<Anuncio[]> {
  const { data, error } = await supabase
    .from('trucks')
    .select(SELECT_FIELDS)
    .eq('status', 'aprovado')
    .eq('vendido', false)
    .order('created_at', { ascending: false })
    .limit(limite);

  if (error) return [];
  return (data || []) as Anuncio[];
}

export async function getAnunciosPorMarca(marca: string, limite = 20): Promise<Anuncio[]> {
  const { data, error } = await supabase
    .from('trucks')
    .select(SELECT_FIELDS)
    .eq('status', 'aprovado')
    .eq('vendido', false)
    .ilike('marca', marca)
    .order('created_at', { ascending: false })
    .limit(limite);

  if (error) return [];
  return (data || []) as Anuncio[];
}

export async function incrementarViews(id: string): Promise<void> {
  await supabase.rpc('increment_views', { truck_id: id }).catch(() => {});
}

export async function getFavoritos(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('favoritos')
    .select('truck_id')
    .eq('user_id', userId);

  if (error) return [];
  return (data || []).map((f: { truck_id: string }) => f.truck_id);
}

export async function toggleFavorito(userId: string, truckId: string, isFavorito: boolean): Promise<boolean> {
  if (isFavorito) {
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('user_id', userId)
      .eq('truck_id', truckId);
    return !error;
  } else {
    const { error } = await supabase
      .from('favoritos')
      .insert({ user_id: userId, truck_id: truckId });
    return !error;
  }
}

export async function getAnunciosFavoritos(ids: string[]): Promise<Anuncio[]> {
  if (!ids.length) return [];
  const { data, error } = await supabase
    .from('trucks')
    .select(SELECT_FIELDS)
    .in('id', ids)
    .eq('status', 'aprovado');

  if (error) return [];
  return (data || []) as Anuncio[];
}
