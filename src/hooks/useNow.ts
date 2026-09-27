import { useEffect, useState } from 'react'

/** Devuelve Date.now() actualizado cada `interval` ms mientras `active` sea true. */
export function useNow(active: boolean, interval = 1000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), interval)
    return () => window.clearInterval(id)
  }, [active, interval])
  return now
}
