# Radio Chile

PWA para escuchar radios chilenas en vivo: noticias, música, deportes, cultura y emisoras de regiones, con un reproductor persistente, búsqueda instantánea, filtros y favoritos.

- **86 emisoras con stream HTTPS verificado** (más 5 listadas como *no disponibles*), de 15 regiones.
- Reproductor fijo con play/pausa, anterior/siguiente, estado *En vivo* con tiempo transcurrido, volumen y silencio (persistidos) y selector de emisora.
- Pantalla *Ahora sonando*, onboarding inicial y estados vacíos, de carga, de error y de *stream no disponible*.
- Favoritos en `localStorage`, sincronizados entre pestañas.
- Instalable (manifest, iconos, maskable, service worker Workbox) con app shell offline.
- Media Session API: controles en la pantalla de bloqueo y teclas multimedia.
- Accesible: HTML semántico, `aria-*`, foco visible, skip link, `<dialog>` modal nativo y `prefers-reduced-motion`. Tema claro y oscuro según el sistema.
- Atajos: `/` busca, `K` reproduce o detiene, `F` marca favorito.

## Stack

Vite 8 · React 19 · TypeScript 7 · vite-plugin-pwa (Workbox) · hls.js (versión *light*, se carga bajo demanda sólo para streams HLS) · Vitest + Testing Library. Las fuentes Manrope e Instrument Serif se sirven desde el propio sitio (`@fontsource`), así que funcionan offline.

## Desarrollo local

```bash
npm install
npm run dev            # http://localhost:5173
npm test               # pruebas unitarias y de UI (Vitest + jsdom)
npm run typecheck
npm run build          # typecheck + build de producción en dist/
npm run preview        # sirve dist/ (el service worker sólo corre en build)
npm run check          # typecheck + tests + build
npm run check:streams  # verifica en vivo que cada stream responda (requiere red)
npm run icons          # regenera los PNG desde public/favicon.svg (requiere Chrome/Chromium)
```

## Estructura

```
src/
  data/stations.ts      ← catálogo de emisoras (el único lugar que hay que editar para actualizar streams)
  hooks/usePlayer.ts    ← motor de audio: estados, timeout, HLS, Media Session, volumen
  hooks/useFavorites.ts ← favoritos persistidos
  lib/filter.ts         ← búsqueda sin tildes + filtros de categoría/región/favoritos
  components/           ← PlayerBar, NowPlaying, StationCard, Toolbar, Onboarding, …
  styles.css            ← tokens de diseño, temas claro y oscuro, responsive, motion
scripts/check-streams.mjs  ← verificador de streams
tests/                  ← pruebas del catálogo, los filtros y la app
```

## Actualizar emisoras

1. Edita `src/data/stations.ts`. Cada entrada tiene `streamUrl`, `homepage`, `region`, `categories` y `color`. Usa `streamType: 'hls'` para URLs `.m3u8`.
2. Ejecuta `npm run check:streams` (o `npm run check:streams -- id1 id2`). Falla si alguna emisora marcada como disponible no responde con audio.
3. Si una emisora se cae, no la borres: agrega `available: false` y un `unavailableReason`. La app la muestra atenuada y explica el motivo.
4. Actualiza `VERIFIED_AT` y la fecha de esta sección.
5. `npm test` exige que todo stream disponible sea HTTPS, que los ids sean únicos y que las regiones y categorías sean válidas.

### Fuentes y verificación

**Fecha de verificación: 2026-09-27.** Cada URL se probó con una petición real: HTTP 200 sobre HTTPS con `Content-Type` de audio y bytes recibidos, o una playlist HLS válida.

Las URLs provienen de:

- **Radio Browser** (<https://www.radio-browser.info>, API `de1.api.radio-browser.info`), un directorio comunitario que registra los streams que publica cada emisora. De ahí se tomaron los endpoints de Icecast/Shoutcast/HLS de la mayoría de las emisoras.
- **Players oficiales** de las propias radios, que usan estas CDN:
  - Triton StreamTheWorld (`playerservices.streamtheworld.com/api/livestream-redirect/…`): Pudahuel, Corazón, Imagina, Rock & Pop, Los 40, Concierto, FM Dos, Futuro, Radioactiva y ADN (Grupo Prisa/Ibero Americana Radio Chile).
  - DPS (`*.dps.live`): Bío-Bío, Cooperativa, Agricultura, Pauta, Universo, Positiva, Beethoven, Paula, Digital FM y El Carbón.
  - Mediastream (`mdstrm.com`): T13 Radio, 13c, Duna, Sonar, Play FM, Romántica e Infinita.
  - Hostings regionales (`digitalproserver.com`, `tustreaming.cl`, `streaminghd.cl`, `radio.co`, `zeno.fm`, etc.) para el resto.
- La `homepage` de cada emisora se comprobó con una petición HTTP. Algunos sitios chilenos no responden desde fuera de Chile o tienen cadenas de certificado incompletas que los navegadores sí toleran.

Las frecuencias del dial se incluyen sólo cuando eran conocidas con certeza; si no, se omiten. Los logos son monogramas tipográficos con un color aproximado de cada marca: no se enlazan imágenes de terceros, que suelen romperse o tener restricciones de uso.

**Marcadas como no disponibles** (hay stream, pero no es reproducible en un sitio HTTPS):

| Emisora | Motivo |
|---|---|
| Radio Universidad de Chile | El servidor HTTPS entrega una cadena de certificado incompleta |
| Radio Universidad del Bío-Bío | Sólo transmite por HTTP |
| Radio Valentín Letelier | Certificado HTTPS vencido |
| Radio Universidad de Talca | Sólo transmite por HTTP |
| Radio Tornagaleones | Sólo transmite por HTTP |

## Despliegue (estático / PWA)

`npm run build` genera `dist/`, un sitio estático. Puedes publicarlo en Netlify, Vercel, Cloudflare Pages, GitHub Pages o cualquier CDN:

- Sírvelo **por HTTPS**: es obligatorio para el service worker, la instalación y para no bloquear el audio por contenido mixto.
- La ruta pública se controla con la variable `BASE_PATH` (por defecto `/`). Ajusta a la vez `base` de Vite, `id`/`start_url`/`scope` del manifest, el service worker y los iconos. Ejemplo para un subdirectorio: `BASE_PATH=/radios-chile/ npm run build`.

### GitHub Pages

Publicada en **https://rafafdz.github.io/radios-chile/**. El workflow `.github/workflows/deploy-pages.yml` corre en cada push a `main` (o a mano desde *Actions → Run workflow*): `npm ci` → `npm test` → `npm run build` con `BASE_PATH=/<nombre-del-repo>/` → publica `dist/` con `actions/deploy-pages`. En *Settings → Pages* la fuente debe ser **GitHub Actions**.
- Configura `sw.js` con `Cache-Control: no-cache` para que las actualizaciones lleguen pronto. Cuando hay una versión nueva, la app ofrece un aviso de *Actualizar*.
- Offline funciona la interfaz completa (catálogo, búsqueda y favoritos). El audio, por supuesto, necesita conexión. Los streams nunca se cachean.

## Advertencias: streaming, CORS y autoplay

- **Streams de terceros.** Las emisoras cambian sus URLs sin aviso. Si una deja de sonar, la app lo detecta (error o 20 s sin audio) y lo informa. Corre `npm run check:streams` periódicamente.
- **CORS.** Se reproduce con `<audio>` sin `crossOrigin`, así que los streams Icecast/MP3/AAC no necesitan cabeceras CORS. Las emisoras HLS (`.m3u8`) usan hls.js vía `fetch` en navegadores sin HLS nativo, y *sí* requieren `Access-Control-Allow-Origin`; la actual (Radio Paula) lo envía. Esto también impide leer metadatos ICY ("canción actual") o usar Web Audio para visualizaciones sin un proxy propio.
- **Contenido mixto.** Un sitio HTTPS no puede reproducir streams `http://`. Por eso el catálogo exige HTTPS y los streams sólo-HTTP quedan como no disponibles.
- **Autoplay.** Los navegadores bloquean audio que no inicia el usuario. La app nunca reproduce automáticamente al cargar: recuerda la última emisora, pero espera a que toques *play*. Si el navegador rechaza `play()`, queda en *Pausado* sin mostrar un error.
- **Pausa en vivo.** Pausar desconecta el stream para no consumir datos. Reanudar vuelve a conectar al directo en vez de reproducir audio atrasado.
- **iOS.** En Safari/iOS el volumen lo controla el sistema; el slider no tiene efecto allí.
- Radio Chile no aloja audio. Las señales y marcas pertenecen a cada emisora.
