import { forwardRef } from 'react'
import { CATEGORIES, REGIONS } from '../data/stations'
import type { StationFilter } from '../lib/filter'
import { ChevronDownIcon, CloseIcon, HeartIcon, SearchIcon } from './Icons'

interface Props {
  filter: StationFilter
  favoritesCount: number
  onChange: (patch: Partial<StationFilter>) => void
}

export const Toolbar = forwardRef<HTMLInputElement, Props>(function Toolbar(
  { filter, favoritesCount, onChange },
  searchRef,
) {
  return (
    <div className="toolbar" role="search">
      <div className="search">
        <SearchIcon className="search__icon" />
        <label htmlFor="search" className="sr-only">
          Buscar emisora
        </label>
        <input
          ref={searchRef}
          id="search"
          type="search"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Busca una radio, ciudad o dial…"
          value={filter.query}
          onChange={(e) => onChange({ query: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              if (filter.query) onChange({ query: '' })
              else e.currentTarget.blur()
            }
          }}
        />
        {filter.query ? (
          <button type="button" className="search__clear" onClick={() => onChange({ query: '' })} aria-label="Limpiar búsqueda">
            <CloseIcon size={16} />
          </button>
        ) : (
          <kbd className="search__kbd" aria-hidden="true">
            /
          </kbd>
        )}
      </div>

      <div className="filters">
        <div className="chips" role="group" aria-label="Filtrar por categoría">
          <button
            type="button"
            className="chip"
            aria-pressed={filter.category === 'all' && !filter.favoritesOnly}
            onClick={() => onChange({ category: 'all', favoritesOnly: false })}
          >
            Todas
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              aria-pressed={filter.category === c.id}
              onClick={() => onChange({ category: filter.category === c.id ? 'all' : c.id })}
            >
              {c.label}
            </button>
          ))}
          <button
            type="button"
            className="chip chip--fav"
            aria-pressed={filter.favoritesOnly}
            onClick={() => onChange({ favoritesOnly: !filter.favoritesOnly })}
          >
            <HeartIcon size={15} filled={filter.favoritesOnly} />
            Mis favoritos
            {favoritesCount > 0 && <span className="chip__count">{favoritesCount}</span>}
          </button>
        </div>

        <div className="select">
          <label htmlFor="region" className="sr-only">
            Filtrar por región
          </label>
          <select
            id="region"
            value={filter.region}
            onChange={(e) => onChange({ region: e.target.value as StationFilter['region'] })}
          >
            <option value="all">Todo Chile</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r === 'Metropolitana' ? 'Región Metropolitana' : r}
              </option>
            ))}
          </select>
          <ChevronDownIcon size={16} className="select__chevron" />
        </div>
      </div>
    </div>
  )
})
