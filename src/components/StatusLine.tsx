import type { Player } from '../hooks/usePlayer'
import { useNow } from '../hooks/useNow'
import { formatElapsed } from '../lib/format'

/** "En vivo · 12:04", "Conectando…", "Pausado" o el error actual. */
export function StatusLine({ player, long = false }: { player: Player; long?: boolean }) {
  const { status, startedAt, error, station } = player
  const now = useNow(status === 'playing' && startedAt != null)

  let content: React.ReactNode
  switch (status) {
    case 'playing':
      content = (
        <>
          <span className="live-dot" aria-hidden="true" />
          <span>En vivo</span>
          {startedAt != null && (
            <span className="status__time" aria-hidden="true">
              · {formatElapsed(now - startedAt)}
            </span>
          )}
        </>
      )
      break
    case 'loading':
      content = (
        <>
          <span className="spinner" aria-hidden="true" />
          <span>Conectando…</span>
        </>
      )
      break
    case 'paused':
      content = <span>Pausado</span>
      break
    case 'error':
      content = <span>{long ? error : 'Sin señal'}</span>
      break
    default:
      content = <span>{station ? 'Listo para sonar' : 'Elige una emisora'}</span>
  }
  return <span className={`status status--${status}`}>{content}</span>
}
