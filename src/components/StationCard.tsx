import { memo } from 'react'
import { CATEGORIES, isAvailable, type Station } from '../data/stations'
import { stationMeta } from '../lib/format'
import type { PlayerStatus } from '../hooks/usePlayer'
import { StationLogo } from './StationLogo'
import { HeartIcon, PauseIcon, PlayIcon } from './Icons'

interface Props {
  station: Station
  isCurrent: boolean
  status: PlayerStatus
  isFavorite: boolean
  onPlay: (s: Station) => void
  onToggleFavorite: (id: string) => void
}

const categoryLabel = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]))

export const StationCard = memo(function StationCard({
  station,
  isCurrent,
  status,
  isFavorite,
  onPlay,
  onToggleFavorite,
}: Props) {
  const available = isAvailable(station)
  const active = isCurrent && (status === 'playing' || status === 'loading')
  const titleId = `st-${station.id}`
  const action = !available ? 'no disponible' : active ? 'Detener' : 'Escuchar'

  return (
    <li className={`card${isCurrent ? ' is-current' : ''}${available ? '' : ' is-unavailable'}`}>
      <StationLogo station={station} playing={isCurrent && status === 'playing'} />
      <div className="card__body">
        <h3 className="card__title" id={titleId}>
          <button
            type="button"
            className="card__main"
            onClick={() => onPlay(station)}
            aria-label={available ? `${action} ${station.name}` : `${station.name}, stream no disponible`}
            aria-pressed={available ? active : undefined}
            aria-describedby={`${titleId}-meta`}
          >
            {station.name}
          </button>
        </h3>
        <p className="card__meta" id={`${titleId}-meta`}>
          {stationMeta(station)}
        </p>
        <p className="card__tagline">{available ? station.tagline : 'Stream no disponible'}</p>
        <ul className="card__tags" aria-label="Categorías">
          {station.categories.map((c) => (
            <li key={c}>{categoryLabel[c]}</li>
          ))}
        </ul>
      </div>
      <div className="card__actions">
        <button
          type="button"
          className={`icon-btn fav${isFavorite ? ' is-on' : ''}`}
          onClick={() => onToggleFavorite(station.id)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Quitar ${station.name} de favoritos` : `Agregar ${station.name} a favoritos`}
        >
          <HeartIcon filled={isFavorite} />
        </button>
        {available && (
          <span className={`card__play${active ? ' is-active' : ''}`} aria-hidden="true">
            {active ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          </span>
        )}
      </div>
    </li>
  )
})
