/** Acceso a localStorage tolerante a modo privado, cuotas y datos corruptos. */
export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw == null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* almacenamiento no disponible: la app sigue funcionando sin persistir */
  }
}

export const STORAGE_KEYS = {
  favorites: 'radiochile:favorites',
  volume: 'radiochile:volume',
  muted: 'radiochile:muted',
  lastStation: 'radiochile:last-station',
  onboarded: 'radiochile:onboarded',
} as const
