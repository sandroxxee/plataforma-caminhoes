'use server'

import { AdDraftSchema, type AdDraft } from '@/lib/schema/ad-draft'

export async function publishAd(draft: AdDraft): Promise<{ ok: boolean; publishedId?: string; requiredMissing?: string[] }> {
  const parsed = AdDraftSchema.parse(draft)

  const missing = [
    !parsed.category ? 'category' : null,
    !parsed.vehicle.brand ? 'vehicle.brand' : null,
    !parsed.vehicle.model ? 'vehicle.model' : null,
    !parsed.vehicle.year ? 'vehicle.year' : null,
    !parsed.price ? 'price' : null,
    !parsed.location.city ? 'location.city' : null,
    !parsed.location.state ? 'location.state' : null,
    !parsed.contact.whatsapp ? 'contact.whatsapp' : null,
  ].filter(Boolean) as string[]

  if (missing.length > 0) return { ok: false, requiredMissing: missing }

  // TODO: salvar no Supabase e publicar
  return { ok: true, publishedId: crypto.randomUUID() }
}
