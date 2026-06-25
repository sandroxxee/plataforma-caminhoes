'use server'

import { AdDraftSchema, type AdDraft } from '@/lib/schema/ad-draft'

export async function saveDraft(draft: AdDraft): Promise<{ ok: boolean; draft: AdDraft }> {
  const parsed = AdDraftSchema.parse(draft)
  const next: AdDraft = { ...parsed, updatedAt: new Date().toISOString() }
  // TODO: persistir no Supabase
  return { ok: true, draft: next }
}
