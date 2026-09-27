import type { Station } from '../data/stations'

const SKIP = new Set(['radio', 'la', 'el', 'fm', 'de', 'del', 'the'])

/** Iniciales para el logo tipográfico: "Radio Bío-Bío" → "BB", "Cooperativa" → "Co". */
export function monogram(name: string): string {
  const words = name
    .split(/[\s-]+/)
    .filter((w) => w && !SKIP.has(w.toLowerCase()) && w !== '&')
  if (!words.length) return name.slice(0, 2)
  if (words.length === 1) {
    const w = words[0]
    return /^\d/.test(w) ? w.replace(/\D.*$/, '').slice(0, 3) || w.slice(0, 2) : w.slice(0, 2)
  }
  return (words[0][0] + words[1][0]).toUpperCase()
}

export function stationMeta(s: Station): string {
  const place = s.city ?? `Región de ${s.region}`
  return [s.frequency ?? (s.online ? 'Online' : null), place].filter(Boolean).join(' · ')
}

export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mm = String(m).padStart(h ? 2 : 1, '0')
  const ss = String(s).padStart(2, '0')
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export function greeting(date = new Date()): string {
  const h = date.getHours()
  if (h < 6) return 'Buenas noches'
  if (h < 12) return 'Buenos días'
  if (h < 20) return 'Buenas tardes'
  return 'Buenas noches'
}
