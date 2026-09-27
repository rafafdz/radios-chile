import { afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'

// jsdom no implementa reproducción de audio ni <dialog>.
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: vi.fn(function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event('playing'))
    return Promise.resolve()
  }),
})
Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, value: vi.fn() })
Object.defineProperty(HTMLMediaElement.prototype, 'load', { configurable: true, value: vi.fn() })
HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
  this.open = true
}
HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
  this.open = false
}
Element.prototype.scrollIntoView ??= () => {}

afterEach(() => {
  cleanup()
  localStorage.clear()
})
