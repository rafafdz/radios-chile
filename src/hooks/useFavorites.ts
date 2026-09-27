import { useCallback, useEffect, useMemo, useState } from 'react'
import { readJSON, STORAGE_KEYS, writeJSON } from '../lib/storage'

function load(): string[] {
  const value = readJSON<unknown>(STORAGE_KEYS.favorites, [])
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>(load)

  useEffect(() => writeJSON(STORAGE_KEYS.favorites, ids), [ids])

  // Sincroniza entre pestañas abiertas.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.favorites) setIds(load())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const favorites = useMemo(() => new Set(ids), [ids])

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  return { favorites, toggle }
}
