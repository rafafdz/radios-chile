import { describe, expect, it } from 'vitest'
import { CATEGORIES, isAvailable, REGIONS, STATIONS, VERIFIED_AT } from '../src/data/stations'

describe('catálogo de emisoras', () => {
  it('tiene ids únicos', () => {
    const ids = STATIONS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('usa HTTPS en todo stream disponible (evita bloqueo por contenido mixto)', () => {
    for (const s of STATIONS.filter(isAvailable)) {
      expect(s.streamUrl, s.id).toMatch(/^https:\/\//)
      expect(s.homepage, s.id).toMatch(/^https:\/\//)
    }
  })

  it('explica por qué una emisora no está disponible', () => {
    for (const s of STATIONS.filter((s) => !isAvailable(s))) {
      expect(s.unavailableReason, s.id).toBeTruthy()
    }
  })

  it('usa categorías y regiones válidas y colores hex', () => {
    const cats = new Set<string>(CATEGORIES.map((c) => c.id))
    for (const s of STATIONS) {
      expect(REGIONS).toContain(s.region)
      expect(s.categories.length, s.id).toBeGreaterThan(0)
      for (const c of s.categories) expect(cats.has(c), `${s.id}:${c}`).toBe(true)
      expect(s.color, s.id).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it('cubre todas las categorías y muchas regiones', () => {
    const available = STATIONS.filter(isAvailable)
    expect(available.length).toBeGreaterThanOrEqual(60)
    for (const c of CATEGORIES) {
      expect(available.filter((s) => s.categories.includes(c.id)).length, c.id).toBeGreaterThanOrEqual(5)
    }
    expect(new Set(available.map((s) => s.region)).size).toBeGreaterThanOrEqual(12)
  })

  it('declara fecha de verificación', () => {
    expect(VERIFIED_AT).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
