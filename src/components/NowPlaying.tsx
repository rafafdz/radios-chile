import { useEffect, useRef } from 'react'
import { isAvailable, type Station } from '../data/stations'
import type { Player } from '../hooks/usePlayer'
import { stationMeta } from '../lib/format'
import {
  AlertIcon,
  ChevronDownIcon,
  ExternalIcon,
  HeartIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
} from './Icons'
import { StationLogo } from './StationLogo'
import { StatusLine } from './StatusLine'
import { VolumeControl } from './VolumeControl'

interface Props {
  open: boolean
  onClose: () => void
  player: Player
  queue: Station[]
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
}

export function NowPlaying({ open, onClose, player, queue, isFavorite, onToggleFavorite }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const { station, status, toggle, next, previous, play, error } = player
  const active = status === 'playing' || status === 'loading'
  const choices = queue.filter(isAvailable)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // Lleva la emisora actual a la vista dentro del selector.
      const current = listRef.current?.querySelector<HTMLElement>('[aria-current="true"]')
      current?.scrollIntoView({ block: 'center' })
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="np-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose() // clic en el fondo
      }}
    >
      <div className="sheet__panel">
        <header className="sheet__head">
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar ahora sonando">
            <ChevronDownIcon />
          </button>
          <p className="eyebrow">Ahora sonando</p>
          <span className="sheet__spacer" />
        </header>

        <div className="np">
          {station ? (
            <>
              <div className={`np__art${status === 'playing' ? ' is-playing' : ''}`}>
                <span className="np__ring" aria-hidden="true" />
                <span className="np__ring np__ring--2" aria-hidden="true" />
                <StationLogo station={station} size="xl" playing={status === 'playing'} />
              </div>
              <h2 id="np-title" className="np__title">
                {station.name}
              </h2>
              <p className="np__meta">{stationMeta(station)}</p>
              <p className="np__tagline">{station.tagline}</p>
              <div className="np__status">
                {status === 'error' ? (
                  <p className="np__error" role="alert">
                    <AlertIcon size={16} /> {error}
                  </p>
                ) : (
                  <StatusLine player={player} long />
                )}
              </div>

              <div className="np__controls">
                <button type="button" className="icon-btn icon-btn--lg" onClick={previous} aria-label="Emisora anterior">
                  <PrevIcon size={24} />
                </button>
                <button
                  type="button"
                  className={`play-btn play-btn--lg${status === 'loading' ? ' is-loading' : ''}`}
                  onClick={toggle}
                  aria-label={active ? 'Detener' : `Escuchar ${station.name}`}
                >
                  {active ? <PauseIcon size={30} /> : <PlayIcon size={30} />}
                </button>
                <button type="button" className="icon-btn icon-btn--lg" onClick={next} aria-label="Siguiente emisora">
                  <NextIcon size={24} />
                </button>
              </div>

              <div className="np__row">
                <VolumeControl player={player} id="volume-sheet" />
              </div>
              <div className="np__row np__links">
                <button
                  type="button"
                  className={`btn btn--ghost fav${isFavorite(station.id) ? ' is-on' : ''}`}
                  onClick={() => onToggleFavorite(station.id)}
                  aria-pressed={isFavorite(station.id)}
                >
                  <HeartIcon size={18} filled={isFavorite(station.id)} />
                  {isFavorite(station.id) ? 'En favoritos' : 'Favorito'}
                </button>
                <a className="btn btn--ghost" href={station.homepage} target="_blank" rel="noopener noreferrer">
                  Sitio oficial <ExternalIcon size={16} />
                </a>
              </div>
            </>
          ) : (
            <>
              <h2 id="np-title" className="np__title">
                Nada sonando todavía
              </h2>
              <p className="np__tagline">Elige una emisora de la lista para empezar.</p>
            </>
          )}
        </div>

        <section className="picker" aria-labelledby="picker-title">
          <h3 id="picker-title" className="picker__title">
            Cambiar emisora <span className="picker__count">{choices.length}</span>
          </h3>
          <ul ref={listRef} className="picker__list">
            {choices.map((s) => {
              const current = s.id === station?.id
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className="picker__item"
                    aria-current={current ? 'true' : undefined}
                    onClick={() => void play(s)}
                  >
                    <StationLogo station={s} size="sm" playing={current && status === 'playing'} />
                    <span className="picker__text">
                      <span className="picker__name">{s.name}</span>
                      <span className="picker__meta">{stationMeta(s)}</span>
                    </span>
                    {current && <span className="picker__badge">{status === 'playing' ? 'Sonando' : 'Actual'}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </dialog>
  )
}
