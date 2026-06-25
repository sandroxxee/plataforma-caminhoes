import { z } from 'zod'

export const AdCategorySchema = z.enum([
  'caminhao',
  'carreta',
  'maquina',
  'implemento',
  'peca',
])

export const AdDraftSchema = z.object({
  id: z.string().optional(),
  category: AdCategorySchema.optional(),
  vehicle: z.object({
    brand: z.string().optional(),
    model: z.string().optional(),
    year: z.number().int().optional(),
    bodyType: z.string().optional(),
    mileage: z.number().int().optional(),
  }).default({}),
  price: z.number().optional(),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
  }).default({}),
  contact: z.object({
    whatsapp: z.string().optional(),
  }).default({}),
  description: z.string().optional(),
  photos: z.array(z.string()).default([]),
  status: z.object({
    step: z.string().default('category'),
    requiredMissing: z.array(z.string()).default([]),
    confidence: z.record(z.enum(['high', 'medium', 'low'])).default({}),
  }).default({}),
  updatedAt: z.string().optional(),
})

export type AdDraft = z.infer<typeof AdDraftSchema>

export const emptyAdDraft: AdDraft = {
  vehicle: {},
  location: {},
  contact: {},
  photos: [],
  status: {
    step: 'category',
    requiredMissing: [],
    confidence: {},
  },
}
