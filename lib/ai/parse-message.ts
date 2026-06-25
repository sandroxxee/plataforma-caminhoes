import type { AdDraft } from '@/lib/schema/ad-draft'

const YEAR_MIN = 1950
const YEAR_MAX = new Date().getFullYear() + 1

const BR_STATES = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

export function parseAdMessage(message: string, current: AdDraft): AdDraft {
  const text = message.trim()
  const next: AdDraft = structuredClone(current)

  // Ano
  const yearMatch = text.match(/\b(19\d{2}|20\d{2})\b/)
  if (yearMatch) {
    const year = Number(yearMatch[1])
    if (year >= YEAR_MIN && year <= YEAR_MAX) {
      next.vehicle.year = year
      next.status.confidence.year = 'high'
    }
  }

  // Preco
  const priceMatch = text.match(/(?:r\$|rs\.?)?\s*([\d.]+(?:,\d{1,2})?)/i)
  if (priceMatch) {
    const raw = priceMatch[1].replace(/\./g, '').replace(',', '.')
    const val = parseFloat(raw)
    if (!isNaN(val) && val > 1000) {
      next.price = val
      next.status.confidence.price = 'high'
    }
  }

  // Quilometragem
  const kmMatch = text.match(/([\d.]+)\s*(?:mil)?\s*km/i)
  if (kmMatch) {
    let val = parseFloat(kmMatch[1].replace(/\./g, ''))
    if (text.toLowerCase().includes('mil km')) val = val * 1000
    if (!isNaN(val)) {
      next.vehicle.mileage = val
      next.status.confidence.mileage = 'high'
    }
  }

  // Estado
  const stateRe = new RegExp(`\\b(${BR_STATES.join('|')})\\b`, 'i')
  const stateMatch = text.match(stateRe)
  if (stateMatch) {
    next.location.state = stateMatch[1].toUpperCase()
    next.status.confidence.state = 'high'
  }

  // WhatsApp
  const waMatch = text.match(/(\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4})/)
  if (waMatch) {
    next.contact.whatsapp = waMatch[1].trim()
    next.status.confidence.whatsapp = 'high'
  }

  // Marca (primeira palavra se brand vazio)
  if (!next.vehicle.brand) {
    const firstWord = text.split(/\s+/)[0]
    if (firstWord && firstWord.length > 1) {
      next.vehicle.brand = firstWord
      next.status.confidence.brand = 'low'
    }
  }

  return next
}
