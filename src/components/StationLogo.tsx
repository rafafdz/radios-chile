import type { Station } from '../data/stations'
import { monogram } from '../lib/format'

interface Props {
  station: Station
  size?: 'sm' | 'md' | 'lg' | 'xl'
  playing?: boolean
}

export function StationLogo({ station, size = 'md', playing = false }: Props) {
  return (
    <span
      className={`logo logo--${size}${playing ? ' is-playing' : ''}`}
      style={{ '--brand': station.color } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="logo__text">{monogram(station.name)}</span>
      {playing && (
        <span className="eq" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
    </span>
  )
}
