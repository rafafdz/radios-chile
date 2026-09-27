import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { DownloadIcon, WifiOffIcon } from './Icons'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null)
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setEvent(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setEvent(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])
  if (!event) return null
  return async () => {
    await event.prompt()
    await event.userChoice.catch(() => undefined)
    setEvent(null)
  }
}

export function InstallButton() {
  const install = useInstallPrompt()
  if (!install) return null
  return (
    <button type="button" className="btn btn--ghost btn--sm" onClick={() => void install()}>
      <DownloadIcon size={16} /> Instalar app
    </button>
  )
}

export function useOnline() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine))
  useEffect(() => {
    const up = () => setOnline(true)
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])
  return online
}

export function Banners() {
  const online = useOnline()
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  return (
    <div className="banners" aria-live="polite">
      {!online && (
        <div className="banner" role="status">
          <WifiOffIcon size={18} />
          <span>Sin conexión. Puedes navegar el catálogo; las radios volverán a sonar al reconectar.</span>
        </div>
      )}
      {needRefresh && (
        <div className="banner" role="status">
          <span>Hay una nueva versión de Radio Chile.</span>
          <button type="button" className="btn btn--sm" onClick={() => void updateServiceWorker(true)}>
            Actualizar
          </button>
          <button type="button" className="link-btn" onClick={() => setNeedRefresh(false)}>
            Luego
          </button>
        </div>
      )}
    </div>
  )
}
