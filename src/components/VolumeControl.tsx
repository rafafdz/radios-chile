import type { Player } from '../hooks/usePlayer'
import { VolumeIcon } from './Icons'

export function VolumeControl({ player, id }: { player: Player; id: string }) {
  const { volume, muted, setVolume, toggleMute } = player
  const effective = muted ? 0 : volume
  const level = effective === 0 ? 'mute' : effective < 0.5 ? 'low' : 'high'
  return (
    <div className="volume">
      <button
        type="button"
        className="icon-btn"
        onClick={toggleMute}
        aria-pressed={muted}
        aria-label={muted ? 'Activar sonido' : 'Silenciar'}
      >
        <VolumeIcon level={level} />
      </button>
      <label htmlFor={id} className="sr-only">
        Volumen
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(effective * 100)}
        onChange={(e) => setVolume(Number(e.target.value) / 100)}
        aria-valuetext={`${Math.round(effective * 100)}%`}
        style={{ '--fill': `${effective * 100}%` } as React.CSSProperties}
      />
    </div>
  )
}
