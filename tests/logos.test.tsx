import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { LOGOS, logoUrl } from '../src/data/logos'
import { STATIONS } from '../src/data/stations'
import { StationLogo } from '../src/components/StationLogo'

const sources = JSON.parse(readFileSync('public/logos/sources.json', 'utf8')).logos as Record<string, { source: string }>

describe('logos', () => {
  it('cada logo corresponde a una emisora, existe en disco y documenta su origen', () => {
    const ids = new Set(STATIONS.map((s) => s.id))
    for (const id of Object.keys(LOGOS)) {
      expect(ids.has(id), id).toBe(true)
      expect(existsSync(`public/logos/${id}.webp`), id).toBe(true)
      expect(sources[id]?.source, id).toMatch(/^https:\/\//)
    }
  })

  it('las emisoras principales tienen logo', () => {
    for (const id of ['biobio-santiago', 'cooperativa', 'adn', 'pudahuel', 'rockandpop', 'los40', 'concierto', 'futuro']) {
      expect(logoUrl(id), id).not.toBeNull()
    }
  })

  it('usa lazy loading y alt, y vuelve al monograma si la imagen falla', () => {
    const station = STATIONS.find((s) => s.id === 'cooperativa')!
    const { container } = render(<StationLogo station={station} />)
    const img = container.querySelector('img')!
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('alt', 'Logo de Cooperativa')
    fireEvent.error(img)
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('.logo__text')).toHaveTextContent('Co')
  })

  it('sin logo muestra sólo el monograma', () => {
    const station = STATIONS.find((s) => !(s.id in LOGOS))!
    const { container } = render(<StationLogo station={station} />)
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('.logo__text')?.textContent).toBeTruthy()
  })
})
