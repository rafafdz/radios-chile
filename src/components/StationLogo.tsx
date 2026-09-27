import { useState } from 'react'
import type { Station } from '../data/stations'
import { LOGOS, logoUrl } from '../data/logos'
import { monogram } from '../lib/format'

interface Props {
  station: Station
  size?: 'sm' | 'md' | 'lg' | 'xl'
  playing?: boolean
}

const PIXELS = { sm: 44, md: 56, lg: 72, xl: 200 } as const

/** URLs que ya fallaron en esta sesión: no se vuelven a intentar. */
const failed = new Set<string>()

/** Remonta al cambiar de emisora para reiniciar el estado de carga. */
export function StationLogo(props: Props) {
  return <Logo key={props.station.id} {...props} />
}

function Logo({ station, size = 'md', playing = false }: Props) {
  const src = logoUrl(station.id)
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(() =>
    src && !failed.has(src) ? 'loading' : 'error',
  )
  const showImage = src != null && status !== 'error'
  const fit = LOGOS[station.id] ?? 'contain'

  return (
    <span
      className={`logo logo--${size}${playing ? ' is-playing' : ''}${status === 'loaded' ? ` has-image logo--${fit}` : ''}`}
      style={{ '--brand': station.color } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* El monograma queda debajo: se ve mientras carga y si la imagen falla. */}
      <span className="logo__text">{monogram(station.name)}</span>
      {showImage && (
        <img
          className="logo__img"
          src={src}
          alt={`Logo de ${station.name}`}
          width={PIXELS[size]}
          height={PIXELS[size]}
          loading={size === 'xl' ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setStatus('loaded')}
          onError={() => {
            failed.add(src)
            setStatus('error')
          }}
        />
      )}
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
