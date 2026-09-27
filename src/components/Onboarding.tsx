import { STATIONS, type Station } from '../data/stations'
import { StationLogo } from './StationLogo'

const PICKS: { label: string; id: string }[] = [
  { label: 'Para informarte', id: 'biobio-santiago' },
  { label: 'Para cantar', id: 'concierto' },
  { label: 'Para concentrarte', id: 'beethoven' },
]

interface Props {
  availableCount: number
  regionCount: number
  onPick: (s: Station) => void
  onDismiss: () => void
}

export function Onboarding({ availableCount, regionCount, onPick, onDismiss }: Props) {
  const picks = PICKS.map((p) => ({ ...p, station: STATIONS.find((s) => s.id === p.id)! })).filter((p) => p.station)
  return (
    <section className="onboarding" aria-labelledby="onb-title">
      <p className="eyebrow">Bienvenida</p>
      <h1 id="onb-title" className="display">
        Todo el dial de Chile,
        <br />
        <em>en un solo lugar.</em>
      </h1>
      <p className="lede">
        {availableCount} radios en vivo de {regionCount} regiones — noticias, música, deportes y cultura. Toca una
        emisora para escucharla y guarda tus favoritas con el corazón.
      </p>
      <ul className="picks" aria-label="Sugerencias para empezar">
        {picks.map(({ label, station }) => (
          <li key={station.id}>
            <button type="button" className="pick" onClick={() => onPick(station)}>
              <StationLogo station={station} size="sm" />
              <span>
                <span className="pick__label">{label}</span>
                <span className="pick__name">{station.name}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="link-btn" onClick={onDismiss}>
        Explorar por mi cuenta
      </button>
    </section>
  )
}
