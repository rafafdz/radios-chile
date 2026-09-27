import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    needRefresh: [false, () => {}],
    offlineReady: [false, () => {}],
    updateServiceWorker: async () => {},
  }),
}))

const { default: App } = await import('../src/App')

describe('App', () => {
  it('muestra onboarding y lo oculta al explorar', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /todo el dial de chile/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /explorar por mi cuenta/i }))
    expect(screen.queryByRole('heading', { name: /todo el dial de chile/i })).not.toBeInTheDocument()
    expect(localStorage.getItem('radiochile:onboarded')).toBe('true')
  })

  it('filtra con la búsqueda y muestra estado vacío', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('searchbox', { name: /buscar emisora/i }), 'cooperativa')
    const list = document.querySelector('.grid') as HTMLElement
    expect(within(list).getByText('Cooperativa')).toBeInTheDocument()
    expect(list.querySelectorAll('.card')).toHaveLength(1)

    await user.clear(screen.getByRole('searchbox'))
    await user.type(screen.getByRole('searchbox'), 'xyzxyz')
    expect(await screen.findByText(/sin señal por aquí/i)).toBeInTheDocument()
  })

  it('marca favoritos, los persiste y filtra "Mis favoritos"', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await user.click(screen.getByRole('button', { name: /agregar beethoven fm a favoritos/i }))
    expect(JSON.parse(localStorage.getItem('radiochile:favorites')!)).toEqual(['beethoven'])

    await user.click(screen.getByRole('button', { name: /mis favoritos/i }))
    const cards = document.querySelectorAll('.grid .card')
    expect(cards).toHaveLength(1)
    expect(cards[0]).toHaveTextContent('Beethoven FM')

    // Persiste tras recargar.
    unmount()
    render(<App />)
    expect(screen.getByRole('button', { name: /quitar beethoven fm de favoritos/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('muestra favoritos vacío con mensaje propio', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /mis favoritos/i }))
    expect(screen.getByText(/aún no tienes favoritas/i)).toBeInTheDocument()
  })

  it('reproduce una emisora desde su card y actualiza el reproductor', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^escuchar cooperativa$/i }))
    const player = screen.getByRole('region', { name: /reproductor/i })
    expect(within(player).getByText('Cooperativa')).toBeInTheDocument()
    expect(await within(player).findByText(/en vivo/i)).toBeInTheDocument()
    expect(within(player).getByRole('button', { name: /^detener$/i })).toBeInTheDocument()

    await user.click(within(player).getByRole('button', { name: /^detener$/i }))
    expect(within(player).getByText(/pausado/i)).toBeInTheDocument()
  })

  it('informa cuando una emisora no tiene stream disponible', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /radio universidad de chile, stream no disponible/i }))
    const player = screen.getByRole('region', { name: /reproductor/i })
    expect(within(player).getByText(/sin señal/i)).toBeInTheDocument()
  })

  it('persiste volumen y silencio', async () => {
    const user = userEvent.setup()
    render(<App />)
    const player = screen.getByRole('region', { name: /reproductor/i })
    await user.click(within(player).getByRole('button', { name: /^silenciar$/i }))
    expect(localStorage.getItem('radiochile:muted')).toBe('true')
    expect(within(player).getByRole('button', { name: /activar sonido/i })).toHaveAttribute('aria-pressed', 'true')
  })
})
