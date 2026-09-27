// Genera los PNG de la PWA a partir de public/favicon.svg usando un Chrome/Chromium
// headless (el de Playwright o el que indiques con CHROME_PATH).
//   CHROME_PATH=/ruta/a/chrome npm run icons
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  const base = join(homedir(), '.cache', 'ms-playwright')
  if (existsSync(base)) {
    for (const dir of readdirSync(base).filter((d) => d.startsWith('chromium-')).sort().reverse()) {
      const bin = join(base, dir, 'chrome-linux64', 'chrome')
      if (existsSync(bin)) return bin
    }
  }
  for (const bin of ['/usr/bin/chromium', '/usr/bin/google-chrome', '/usr/bin/chromium-browser']) {
    if (existsSync(bin)) return bin
  }
  throw new Error('No encontré Chrome/Chromium. Define CHROME_PATH.')
}

const svg = readFileSync('public/favicon.svg', 'utf8')
const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
// Maskable: fondo a sangre y símbolo dentro de la zona segura (80%).
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#e0513a"/><g transform="translate(256 256) scale(0.72) translate(-256 -256)">${inner.replace(/<rect[^>]*\/>/, '')}</g></svg>`
// Apple: sin transparencia, iOS aplica sus propias esquinas.
const apple = maskable.replace('scale(0.72)', 'scale(0.8)')

const targets = [
  ['pwa-192x192.png', svg, 192],
  ['pwa-512x512.png', svg, 512],
  ['maskable-512x512.png', maskable, 512],
  ['apple-touch-icon.png', apple, 180],
  ['favicon-32x32.png', svg, 32],
]

const chrome = findChrome()
const tmp = mkdtempSync(join(tmpdir(), 'icons-'))
try {
  for (const [name, source, size] of targets) {
    const html = join(tmp, `${name}.html`)
    writeFileSync(
      html,
      `<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${source}`,
    )
    execFileSync(chrome, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--default-background-color=00000000',
      `--window-size=${size},${size}`,
      `--screenshot=${join('public', name)}`,
      `file://${html}`,
    ], { stdio: 'ignore' })
    console.log('✓', name)
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
