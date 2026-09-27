import type { CategoryId, Region, Station } from '../data/stations'

export interface StationFilter {
  query: string
  category: CategoryId | 'all'
  region: Region | 'all'
  favoritesOnly: boolean
}

export const DEFAULT_FILTER: StationFilter = {
  query: '',
  category: 'all',
  region: 'all',
  favoritesOnly: false,
}

/** Minúsculas y sin tildes: "Ñuble" → "nuble", "Bío-Bío" → "bio-bio". */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

function haystack(s: Station): string {
  return normalize(
    [s.name, s.frequency, s.tagline, s.city, s.region, ...s.categories].filter(Boolean).join(' '),
  )
}

export function filterStations(
  stations: Station[],
  filter: StationFilter,
  favorites: ReadonlySet<string>,
): Station[] {
  const terms = normalize(filter.query).split(/\s+/).filter(Boolean)
  return stations.filter((s) => {
    if (filter.favoritesOnly && !favorites.has(s.id)) return false
    if (filter.category !== 'all' && !s.categories.includes(filter.category)) return false
    if (filter.region !== 'all' && s.region !== filter.region) return false
    if (terms.length) {
      const text = haystack(s)
      return terms.every((t) => text.includes(t))
    }
    return true
  })
}
