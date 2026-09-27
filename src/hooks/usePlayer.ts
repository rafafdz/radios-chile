import { useCallback, useEffect, useRef, useState } from 'react'
import type Hls from 'hls.js'
import { isAvailable, STATIONS, type Station } from '../data/stations'
import { readJSON, STORAGE_KEYS, writeJSON } from '../lib/storage'

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export interface PlayerState {
  station: Station | null
  status: PlayerStatus
  error: string | null
  volume: number
  muted: boolean
  /** Momento (ms) en que empezó a sonar la sesión actual. */
  startedAt: number | null
}

/** Si un stream no empieza a sonar en este tiempo, lo damos por caído. */
const LOAD_TIMEOUT_MS = 20_000

const clamp = (n: number) => Math.min(1, Math.max(0, n))

function initialStation(): Station | null {
  const id = readJSON<string | null>(STORAGE_KEYS.lastStation, null)
  return STATIONS.find((s) => s.id === id) ?? null
}

export function usePlayer(queue: Station[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hlsRef = useRef<Hls | null>(null)
  const timeoutRef = useRef<number | undefined>(undefined)
  const queueRef = useRef(queue)
  queueRef.current = queue
  /** Token para ignorar eventos de reproducciones anteriores. */
  const sessionRef = useRef(0)
  /** `true` mientras el audio suena por decisión nuestra (distingue pausas del sistema). */
  const liveRef = useRef(false)

  const [state, setState] = useState<PlayerState>(() => ({
    station: initialStation(),
    status: 'idle',
    error: null,
    volume: clamp(readJSON<number>(STORAGE_KEYS.volume, 0.8)),
    muted: readJSON<boolean>(STORAGE_KEYS.muted, false) === true,
    startedAt: null,
  }))
  const stateRef = useRef(state)
  stateRef.current = state

  const patch = useCallback((p: Partial<PlayerState>) => setState((s) => ({ ...s, ...p })), [])

  const clearLoadTimeout = () => window.clearTimeout(timeoutRef.current)

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio()
      audio.preload = 'none'
      audioRef.current = audio
    }
    return audioRef.current
  }, [])

  const teardown = useCallback(() => {
    liveRef.current = false
    clearLoadTimeout()
    hlsRef.current?.destroy()
    hlsRef.current = null
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load() // corta la descarga del stream en vivo
    }
  }, [])

  const fail = useCallback(
    (message: string) => {
      teardown()
      patch({ status: 'error', error: message, startedAt: null })
    },
    [patch, teardown],
  )

  const play = useCallback(
    async (station: Station) => {
      const session = ++sessionRef.current
      teardown()
      writeJSON(STORAGE_KEYS.lastStation, station.id)

      if (!isAvailable(station)) {
        patch({ station, status: 'error', error: 'Esta emisora no tiene un stream disponible por ahora.', startedAt: null })
        return
      }

      patch({ station, status: 'loading', error: null, startedAt: null })
      const audio = getAudio()
      audio.volume = stateRef.current.volume
      audio.muted = stateRef.current.muted

      timeoutRef.current = window.setTimeout(() => {
        if (sessionRef.current === session) fail('La emisora no responde. Intenta de nuevo en unos minutos.')
      }, LOAD_TIMEOUT_MS)

      try {
        if (station.streamType === 'hls' && !audio.canPlayType('application/vnd.apple.mpegurl')) {
          const { default: HlsCtor } = await import('hls.js/light')
          if (sessionRef.current !== session) return
          if (!HlsCtor.isSupported()) throw new Error('hls-unsupported')
          const hls = new HlsCtor({ lowLatencyMode: false })
          hlsRef.current = hls
          hls.on(HlsCtor.Events.ERROR, (_e, data) => {
            if (data.fatal && sessionRef.current === session) fail('No pudimos conectar con la señal.')
          })
          hls.loadSource(station.streamUrl)
          hls.attachMedia(audio)
        } else {
          audio.src = station.streamUrl
        }
        await audio.play()
      } catch (err) {
        if (sessionRef.current !== session) return
        const name = err instanceof DOMException ? err.name : ''
        if (name === 'AbortError') return // otra emisora tomó el control
        clearLoadTimeout()
        if (name === 'NotAllowedError') {
          // Autoplay bloqueado: el usuario debe tocar play.
          patch({ status: 'paused', error: null })
          return
        }
        fail(
          name === 'NotSupportedError'
            ? 'Tu navegador no puede reproducir el formato de esta emisora.'
            : 'No pudimos conectar con la señal.',
        )
      }
    },
    [fail, getAudio, patch, teardown],
  )

  const stop = useCallback(() => {
    sessionRef.current++
    teardown()
    patch({ status: 'paused', startedAt: null })
  }, [patch, teardown])

  const toggle = useCallback(() => {
    const { station, status } = stateRef.current
    if (!station) {
      const first = queueRef.current.find(isAvailable)
      if (first) void play(first)
      return
    }
    if (status === 'playing' || status === 'loading') stop()
    else void play(station)
  }, [play, stop])

  const step = useCallback(
    (dir: 1 | -1) => {
      const list = queueRef.current.filter(isAvailable)
      if (!list.length) return
      const idx = list.findIndex((s) => s.id === stateRef.current.station?.id)
      const next = list[(idx + dir + list.length) % list.length]
      void play(next)
    },
    [play],
  )
  const next = useCallback(() => step(1), [step])
  const previous = useCallback(() => step(-1), [step])

  const setVolume = useCallback(
    (v: number) => {
      const volume = clamp(v)
      if (audioRef.current) {
        audioRef.current.volume = volume
        if (volume > 0 && audioRef.current.muted) audioRef.current.muted = false
      }
      writeJSON(STORAGE_KEYS.volume, volume)
      setState((s) => {
        const muted = volume > 0 ? false : s.muted
        writeJSON(STORAGE_KEYS.muted, muted)
        return { ...s, volume, muted }
      })
    },
    [],
  )

  const toggleMute = useCallback(() => {
    setState((s) => {
      const muted = !s.muted
      if (audioRef.current) audioRef.current.muted = muted
      writeJSON(STORAGE_KEYS.muted, muted)
      return { ...s, muted }
    })
  }, [])

  // Eventos del elemento de audio.
  useEffect(() => {
    const audio = getAudio()
    const onPlaying = () => {
      liveRef.current = true
      clearLoadTimeout()
      setState((s) => ({ ...s, status: 'playing', error: null, startedAt: s.startedAt ?? Date.now() }))
    }
    const onWaiting = () => {
      if (stateRef.current.status === 'playing') patch({ status: 'loading' })
    }
    const onError = () => {
      if (!audio.getAttribute('src') && !hlsRef.current) return // teardown intencional
      fail('No pudimos conectar con la señal.')
    }
    const onPause = () => {
      // Pausa desde el sistema (auriculares, centro de control…).
      if (liveRef.current) stop()
    }
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('error', onError)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('pause', onPause)
    }
  }, [fail, getAudio, patch, stop])

  // Media Session: controles en pantalla de bloqueo y teclas multimedia.
  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const ms = navigator.mediaSession
    const { station, status } = state
    if (station && typeof MediaMetadata !== 'undefined') {
      ms.metadata = new MediaMetadata({
        title: station.name,
        artist: [station.frequency, station.city ?? station.region].filter(Boolean).join(' · '),
        album: 'Radio Chile · En vivo',
        artwork: [
          { src: `${import.meta.env.BASE_URL}pwa-192x192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${import.meta.env.BASE_URL}pwa-512x512.png`, sizes: '512x512', type: 'image/png' },
        ],
      })
    }
    ms.playbackState = status === 'playing' ? 'playing' : status === 'idle' ? 'none' : 'paused'
  }, [state])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const ms = navigator.mediaSession
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', () => stateRef.current.station && void play(stateRef.current.station)],
      ['pause', stop],
      ['stop', stop],
      ['nexttrack', next],
      ['previoustrack', previous],
    ]
    for (const [action, handler] of handlers) {
      try {
        ms.setActionHandler(action, handler)
      } catch {
        /* acción no soportada */
      }
    }
    return () => {
      for (const [action] of handlers) {
        try {
          ms.setActionHandler(action, null)
        } catch {
          /* noop */
        }
      }
    }
  }, [next, play, previous, stop])

  useEffect(() => () => teardown(), [teardown])

  return { ...state, play, toggle, stop, next, previous, setVolume, toggleMute }
}

export type Player = ReturnType<typeof usePlayer>
