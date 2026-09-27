import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORIES, isAvailable, STATIONS, type Station } from './data/stations'
import { DEFAULT_FILTER, filterStations, type StationFilter } from './lib/filter'
import { greeting, stationMeta } from './lib/format'
import { readJSON, STORAGE_KEYS, writeJSON } from './lib/storage'
import { useFavorites } from './hooks/useFavorites'
import { usePlayer } from './hooks/usePlayer'
import { Toolbar } from './components/Toolbar'
import { StationCard } from './components/StationCard'
import { StationLogo } from './components/StationLogo'
import { PlayerBar } from './components/PlayerBar'
import { NowPlaying } from './components/NowPlaying'
import { Onboarding } from './components/Onboarding'
import { EmptyState } from './components/EmptyState'
import { StatusLine } from './components/StatusLine'
import { Banners, InstallButton } from './components/Banners'
import { BroadcastIcon, HeartIcon } from './components/Icons'

const AVAILABLE_COUNT = STATIONS.filter(isAvailable).length
const REGION_COUNT = new Set(STATIONS.filter(isAvailable).map((s) => s.region)).size

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
}

export default function App() {
  const [filter, setFilter] = useState<StationFilter>(DEFAULT_FILTER)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [onboarded, setOnboarded] = useState(() => readJSON<boolean>(STORAGE_KEYS.onboarded, false) === true)
  const { favorites, toggle: toggleFavorite } = useFavorites()
  const searchRef = useRef<HTMLInputElement>(null)

  const deferredQuery = useDeferredValue(filter.query)
  const results = useMemo(
    () => filterStations(STATIONS, { ...filter, query: deferredQuery }, favorites),
    [filter, deferredQuery, favorites],
  )
  // La cola del reproductor (anterior/siguiente) sigue lo que el usuario está viendo.
  const queue = results.some(isAvailable) ? results : STATIONS
  const player = usePlayer(queue)

  const favoriteStations = useMemo(() => STATIONS.filter((s) => favorites.has(s.id)), [favorites])
  const isDefaultView =
    !filter.query && filter.category === 'all' && filter.region === 'all' && !filter.favoritesOnly

  const dismissOnboarding = useCallback(() => {
    setOnboarded(true)
    writeJSON(STORAGE_KEYS.onboarded, true)
  }, [])

  const { play, stop, status: playerStatus } = player
  const currentId = player.station?.id
  const handlePlay = useCallback(
    (station: Station) => {
      dismissOnboarding()
      const isCurrent = currentId === station.id
      if (isCurrent && (playerStatus === 'playing' || playerStatus === 'loading')) stop()
      else void play(station)
    },
    [dismissOnboarding, currentId, playerStatus, play, stop],
  )

  const updateFilter = useCallback((patch: Partial<StationFilter>) => setFilter((f) => ({ ...f, ...patch })), [])
  const resetFilter = useCallback(() => setFilter(DEFAULT_FILTER), [])

  // Atajos: "/" busca, espacio o "k" reproduce/pausa, "f" marca favorito.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target) || sheetOpen) return
      if (e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      } else if (e.key === 'k' || (e.key === ' ' && e.target === document.body)) {
        e.preventDefault()
        player.toggle()
      } else if (e.key === 'f' && player.station) {
        toggleFavorite(player.station.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [player, sheetOpen, toggleFavorite])

  // Título de la pestaña refleja lo que suena.
  useEffect(() => {
    document.title =
      player.station && player.status === 'playing' ? `▶ ${player.station.name} · Radio Chile` : 'Radio Chile — Radios chilenas en vivo'
  }, [player.station, player.status])

  const listTitle = filter.favoritesOnly
    ? 'Mis favoritos'
    : filter.category !== 'all'
      ? CATEGORIES.find((c) => c.id === filter.category)!.label
      : filter.query
        ? 'Resultados'
        : 'Todas las emisoras'

  return (
    <>
      <a className="skip-link" href="#emisoras">
        Saltar a las emisoras
      </a>
      <header className="topbar">
        <div className="topbar__inner">
          <a className="brand" href="/" aria-label="Radio Chile, inicio">
            <span className="brand__mark" aria-hidden="true">
              <BroadcastIcon size={18} />
            </span>
            <span className="brand__name">
              Radio <em>Chile</em>
            </span>
          </a>
          <InstallButton />
        </div>
      </header>

      <Banners />

      <main className="main" id="main">
        {!onboarded && !player.station ? (
          <Onboarding
            availableCount={AVAILABLE_COUNT}
            regionCount={REGION_COUNT}
            onPick={handlePlay}
            onDismiss={dismissOnboarding}
          />
        ) : (
          <section className="hello" aria-labelledby="hello-title">
            <div>
              <p className="eyebrow">{greeting()}</p>
              <h1 id="hello-title" className="display display--sm">
                ¿Qué suena <em>hoy</em>?
              </h1>
            </div>
            {player.station && (
              <button
                type="button"
                className={`now-card now-card--${player.status}`}
                style={{ '--brand': player.station.color } as React.CSSProperties}
                onClick={() => setSheetOpen(true)}
                aria-haspopup="dialog"
                aria-label={`Ahora sonando: ${player.station.name}. Abrir reproductor`}
              >
                <StationLogo station={player.station} size="md" playing={player.status === 'playing'} />
                <span className="now-card__text">
                  <span className="now-card__label">Ahora sonando</span>
                  <span className="now-card__name">{player.station.name}</span>
                  <span className="now-card__meta">{stationMeta(player.station)}</span>
                </span>
                <StatusLine player={player} />
              </button>
            )}
          </section>
        )}

        {isDefaultView && favoriteStations.length > 0 && (
          <section className="favs" aria-labelledby="favs-title">
            <div className="section-head">
              <h2 id="favs-title" className="section-title">
                <HeartIcon size={16} filled /> Tus favoritas
              </h2>
              <button type="button" className="link-btn" onClick={() => updateFilter({ favoritesOnly: true })}>
                Ver todas
              </button>
            </div>
            <ul className="favs__row">
              {favoriteStations.map((s) => {
                const current = player.station?.id === s.id
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={`fav-tile${current ? ' is-current' : ''}`}
                      onClick={() => handlePlay(s)}
                      aria-label={`${current && player.status === 'playing' ? 'Detener' : 'Escuchar'} ${s.name}`}
                      disabled={!isAvailable(s)}
                    >
                      <StationLogo station={s} size="lg" playing={current && player.status === 'playing'} />
                      <span className="fav-tile__name">{s.name}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <Toolbar ref={searchRef} filter={filter} favoritesCount={favorites.size} onChange={updateFilter} />

        <section id="emisoras" className="stations" aria-labelledby="list-title" tabIndex={-1}>
          <div className="section-head">
            <h2 id="list-title" className="section-title">
              {listTitle}
              {filter.region !== 'all' && <span className="section-title__sub"> · {filter.region}</span>}
            </h2>
            <p className="section-count" aria-live="polite">
              {results.length} {results.length === 1 ? 'emisora' : 'emisoras'}
            </p>
          </div>

          {results.length === 0 ? (
            <EmptyState
              kind={filter.favoritesOnly && favorites.size === 0 ? 'favorites' : 'search'}
              onReset={resetFilter}
            />
          ) : (
            <ul className="grid">
              {results.map((s) => (
                <StationCard
                  key={s.id}
                  station={s}
                  isCurrent={player.station?.id === s.id}
                  status={player.status}
                  isFavorite={favorites.has(s.id)}
                  onPlay={handlePlay}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </ul>
          )}
        </section>

        <footer className="footer">
          <p>
            Radio Chile reúne señales públicas de cada emisora; el audio y las marcas pertenecen a sus dueños. Si una
            radio no suena, puede que haya cambiado su stream.
          </p>
          <p className="footer__keys">
            Atajos: <kbd>/</kbd> buscar · <kbd>K</kbd> reproducir/detener · <kbd>F</kbd> favorito
          </p>
        </footer>
      </main>

      <PlayerBar player={player} onExpand={() => setSheetOpen(true)} />
      <NowPlaying
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        player={player}
        queue={queue}
        isFavorite={(id) => favorites.has(id)}
        onToggleFavorite={toggleFavorite}
      />
    </>
  )
}
