#!/usr/bin/env node
// Verifica que cada stream del catálogo responda con audio (o playlist HLS).
// Uso: npm run check:streams            → todas las emisoras
//      npm run check:streams -- adn duna → sólo esos ids
// Sale con código 1 si alguna emisora marcada como disponible falla.
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../src/data/stations.ts', import.meta.url), 'utf8')
const STW = 'https://playerservices.streamtheworld.com/api/livestream-redirect/'

// Extrae id/streamUrl/available sin compilar TypeScript.
const stations = [...source.matchAll(/\{\s*id: '([^']+)'[\s\S]*?\n  \},/g)].map(([block, id]) => {
  const url = block.match(/streamUrl: (?:'([^']+)'|`\$\{STW\}([^`]+)`)/)
  return {
    id,
    streamUrl: url[1] ?? STW + url[2],
    available: !/available: false/.test(block),
  }
})

const only = process.argv.slice(2)
const targets = only.length ? stations.filter((s) => only.includes(s.id)) : stations

async function check(s) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 15_000)
  try {
    const res = await fetch(s.streamUrl, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 RadioChile-StreamCheck', 'Icy-MetaData': '0' },
      redirect: 'follow',
    })
    const type = res.headers.get('content-type') ?? ''
    const reader = res.body?.getReader()
    let bytes = 0
    let head = ''
    while (reader && bytes < 8192) {
      const { value, done } = await reader.read()
      if (done) break
      if (!head) head = new TextDecoder().decode(value.slice(0, 16))
      bytes += value.length
    }
    ctrl.abort()
    const hls = /mpegurl/i.test(type) || head.startsWith('#EXTM3U')
    const audio = /audio|aac|mpeg|ogg|octet-stream/i.test(type)
    const ok = res.ok && (hls || (audio && bytes > 1000))
    return { ...s, ok, detail: `${res.status} ${type}${hls ? ' (HLS)' : ''}` }
  } catch (err) {
    return { ...s, ok: false, detail: err.name === 'AbortError' ? 'timeout' : String(err.cause?.code ?? err.message) }
  } finally {
    clearTimeout(timer)
  }
}

const results = []
const queue = [...targets]
await Promise.all(
  Array.from({ length: 12 }, async () => {
    while (queue.length) results.push(await check(queue.shift()))
  }),
)
results.sort((a, b) => stations.indexOf(stations.find((s) => s.id === a.id)) - stations.indexOf(stations.find((s) => s.id === b.id)))

let failures = 0
for (const r of results) {
  const mark = r.ok ? '✓' : r.available ? '✗' : '·'
  if (!r.ok && r.available) failures++
  console.log(`${mark} ${r.id.padEnd(24)} ${r.detail}${r.available ? '' : '  [marcada no disponible]'}`)
}
const okCount = results.filter((r) => r.ok && r.available).length
console.log(`\n${okCount}/${results.filter((r) => r.available).length} streams disponibles responden. ${failures} fallas.`)
process.exit(failures ? 1 : 0)
