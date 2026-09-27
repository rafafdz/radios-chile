import { BroadcastIcon, HeartIcon } from './Icons'

interface Props {
  kind: 'favorites' | 'search'
  onReset: () => void
}

export function EmptyState({ kind, onReset }: Props) {
  const fav = kind === 'favorites'
  return (
    <div className="empty" role="status">
      <span className="empty__icon">{fav ? <HeartIcon size={28} /> : <BroadcastIcon size={28} />}</span>
      <h3>{fav ? 'Aún no tienes favoritas' : 'Sin señal por aquí'}</h3>
      <p>
        {fav
          ? 'Toca el corazón de cualquier emisora y aparecerá en esta lista, incluso la próxima vez que abras la app.'
          : 'No encontramos emisoras con esos filtros. Prueba con otra búsqueda o región.'}
      </p>
      <button type="button" className="btn btn--ghost" onClick={onReset}>
        {fav ? 'Ver todas las radios' : 'Limpiar filtros'}
      </button>
    </div>
  )
}
