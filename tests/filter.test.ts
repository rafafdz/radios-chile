import { describe, expect, it } from 'vitest'
import { STATIONS } from '../src/data/stations'
import { DEFAULT_FILTER, filterStations, normalize } from '../src/lib/filter'
import { formatElapsed, monogram } from '../src/lib/format'

const none = new Set<string>()

describe('normalize', () => {
  it('ignora tildes y mayúsculas', () => {
    expect(normalize('  Ñuble BÍO-BÍO ')).toBe('nuble bio-bio')
  })
})

describe('filterStations', () => {
  it('sin filtros devuelve todo', () => {
    expect(filterStations(STATIONS, DEFAULT_FILTER, none)).toHaveLength(STATIONS.length)
  })

  it('busca sin importar tildes, por nombre, ciudad o dial', () => {
    const byName = filterStations(STATIONS, { ...DEFAULT_FILTER, query: 'bio bio' }, none)
    expect(byName.map((s) => s.id)).toContain('biobio-santiago')
    const byCity = filterStations(STATIONS, { ...DEFAULT_FILTER, query: 'chillan' }, none)
    expect(byCity.length).toBeGreaterThan(0)
    expect(byCity.every((s) => s.region === 'Ñuble')).toBe(true)
    const byDial = filterStations(STATIONS, { ...DEFAULT_FILTER, query: '93.3' }, none)
    expect(byDial.map((s) => s.id)).toContain('cooperativa')
  })

  it('combina categoría y región', () => {
    const res = filterStations(STATIONS, { ...DEFAULT_FILTER, category: 'noticias', region: 'Biobío' }, none)
    expect(res.length).toBeGreaterThan(0)
    expect(res.every((s) => s.region === 'Biobío' && s.categories.includes('noticias'))).toBe(true)
  })

  it('filtra favoritos', () => {
    const favs = new Set(['cooperativa', 'beethoven'])
    const res = filterStations(STATIONS, { ...DEFAULT_FILTER, favoritesOnly: true }, favs)
    expect(res.map((s) => s.id).sort()).toEqual(['beethoven', 'cooperativa'])
  })

  it('devuelve vacío cuando nada coincide', () => {
    expect(filterStations(STATIONS, { ...DEFAULT_FILTER, query: 'zzzz-no-existe' }, none)).toEqual([])
  })
})

describe('formato', () => {
  it('genera monogramas legibles', () => {
    expect(monogram('Radio Bío-Bío')).toBe('BB')
    expect(monogram('Cooperativa')).toBe('Co')
    expect(monogram('13c Radio')).toBe('13')
    expect(monogram('Rock & Pop')).toBe('RP')
  })
  it('formatea tiempo en vivo', () => {
    expect(formatElapsed(65_000)).toBe('1:05')
    expect(formatElapsed(3_725_000)).toBe('1:02:05')
  })
})
