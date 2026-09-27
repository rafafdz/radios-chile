import type { Player } from '../hooks/usePlayer'
import { stationMeta } from '../lib/format'
import { ListIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, AlertIcon } from './Icons'
import { StationLogo } from './StationLogo'
import { StatusLine } from './StatusLine'
import { VolumeControl } from './VolumeControl'

interface Props {
  player: Player
  onExpand: () => void
}

export function PlayerBar({ player, onExpand }: Props) {
  const { station, status, toggle, next, previous } = player
  const active = status === 'playing' || status === 'loading'

  return (
    <section className={`player player--${status}`} aria-label="Reproductor">
      <div className="player__inner">
        <button
          type="button"
          className="player__now"
          onClick={onExpand}
          aria-label={station ? `Abrir ahora sonando: ${station.name}` : 'Abrir selector de emisoras'}
          aria-haspopup="dialog"
        >
          {station ? (
            <StationLogo station={station} size="sm" playing={status === 'playing'} />
          ) : (
            <span className="logo logo--sm logo--empty" aria-hidden="true" />
          )}
          <span className="player__text">
            <span className="player__name">{station?.name ?? 'Radio Chile'}</span>
            <span className="player__sub">
              {status === 'error' ? (
                <span className="status status--error">
                  <AlertIcon size={14} /> Sin señal
                </span>
              ) : (
                <>
                  <StatusLine player={player} />
                  {station && status !== 'playing' && status !== 'loading' && (
                    <span className="player__meta"> · {stationMeta(station)}</span>
                  )}
                </>
              )}
            </span>
          </span>
        </button>

        <div className="player__controls">
          <button type="button" className="icon-btn hide-sm" onClick={previous} aria-label="Emisora anterior">
            <PrevIcon />
          </button>
          <button
            type="button"
            className={`play-btn${status === 'loading' ? ' is-loading' : ''}`}
            onClick={toggle}
            aria-label={active ? 'Detener' : station ? `Escuchar ${station.name}` : 'Escuchar'}
          >
            {active ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
          </button>
          <button type="button" className="icon-btn hide-sm" onClick={next} aria-label="Siguiente emisora">
            <NextIcon />
          </button>
        </div>

        <div className="player__side">
          <VolumeControl player={player} id="volume-bar" />
          <button type="button" className="icon-btn" onClick={onExpand} aria-label="Cambiar emisora" aria-haspopup="dialog">
            <ListIcon />
          </button>
        </div>
      </div>
      <div className="sr-only" aria-live="polite">
        {station && status === 'playing' && `Sonando ${station.name}`}
        {status === 'error' && player.error}
      </div>
    </section>
  )
}
