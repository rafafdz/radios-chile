/**
 * Catálogo de emisoras de Radio Chile.
 *
 * Cada `streamUrl` fue verificado el VERIFIED_AT indicado abajo con
 * `npm run check:streams` (HTTP 200 + Content-Type de audio o playlist HLS,
 * sobre HTTPS). Las fuentes de cada URL están documentadas en el README.
 *
 * Para actualizar un stream: edita la entrada, corre `npm run check:streams`
 * y actualiza VERIFIED_AT. Si una emisora deja de transmitir, marca
 * `available: false` con un `unavailableReason` en vez de borrarla.
 */

export const VERIFIED_AT = '2026-09-27'

export const CATEGORIES = [
  { id: 'noticias', label: 'Noticias' },
  { id: 'musica', label: 'Música' },
  { id: 'deportes', label: 'Deportes' },
  { id: 'cultura', label: 'Cultura' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

/** Regiones de Chile, de norte a sur. */
export const REGIONS = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana',
  "O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes',
] as const

export type Region = (typeof REGIONS)[number]

export interface Station {
  id: string
  name: string
  /** Dial FM/AM, sólo cuando es conocido con certeza. */
  frequency?: string
  tagline: string
  city?: string
  region: Region
  /** `true` si es una emisora sólo online (sin dial). */
  online?: boolean
  categories: CategoryId[]
  /** Color de marca aproximado para el logo tipográfico. */
  color: string
  streamUrl: string
  /** `hls` para playlists .m3u8; por defecto `direct` (Icecast/Shoutcast). */
  streamType?: 'direct' | 'hls'
  homepage: string
  available?: boolean
  unavailableReason?: string
}

const STW = 'https://playerservices.streamtheworld.com/api/livestream-redirect/'

export const STATIONS: Station[] = [
  // ——— Metropolitana · noticias y conversación ———
  {
    id: 'biobio-santiago', name: 'Radio Bío-Bío', frequency: '99.7 FM', tagline: 'Noticias y actualidad sin pausa',
    city: 'Santiago', region: 'Metropolitana', categories: ['noticias', 'deportes'], color: '#c8102e',
    streamUrl: 'https://unlimited3-cl.dps.live/biobiosantiago/aac/icecast.audio', homepage: 'https://www.biobiochile.cl/',
  },
  {
    id: 'cooperativa', name: 'Cooperativa', frequency: '93.3 FM', tagline: 'La radio de la información',
    city: 'Santiago', region: 'Metropolitana', categories: ['noticias', 'deportes'], color: '#e4002b',
    streamUrl: 'https://unlimited3-cl.dps.live/cooperativafm/mp3/icecast.audio', homepage: 'https://www.cooperativa.cl/',
  },
  {
    id: 'adn', name: 'ADN Radio', frequency: '91.7 FM', tagline: 'Noticias y deportes todo el día',
    city: 'Santiago', region: 'Metropolitana', categories: ['noticias', 'deportes'], color: '#d71920',
    streamUrl: `${STW}ADNAAC.aac`, homepage: 'https://www.adnradio.cl/',
  },
  {
    id: 'agricultura', name: 'Radio Agricultura', frequency: '92.1 FM', tagline: 'Conversación, noticias y fútbol',
    city: 'Santiago', region: 'Metropolitana', categories: ['noticias', 'deportes'], color: '#1f6f43',
    streamUrl: 'https://unlimited4-us.dps.live/agricultura/aac/icecast.audio', homepage: 'https://www.radioagricultura.cl/',
  },
  {
    id: 'pauta', name: 'Radio Pauta', frequency: '100.5 FM', tagline: 'Actualidad, economía y deportes',
    city: 'Santiago', region: 'Metropolitana', categories: ['noticias', 'deportes'], color: '#111827',
    streamUrl: 'https://unlimited5-us.dps.live/radiopauta/aac/icecast.audio', homepage: 'https://www.pauta.cl/',
  },
  {
    id: 'tele13-radio', name: 'T13 Radio', frequency: '103.3 FM', tagline: 'Noticias de Canal 13 en radio',
    city: 'Santiago', region: 'Metropolitana', categories: ['noticias'], color: '#0033a0',
    streamUrl: 'https://mdstrm.com/audio/5c915613519bce27671c4caa/icecast.audio', homepage: 'https://tele13radio.cl/',
  },
  {
    id: 'duna', name: 'Duna', frequency: '89.7 FM', tagline: 'Negocios, cultura y buena música',
    city: 'Santiago', region: 'Metropolitana', categories: ['noticias', 'musica'], color: '#b08d57',
    streamUrl: 'https://mdstrm.com/audio/67f42f96e464d19a6eda3c7d/icecast.audio', homepage: 'https://www.duna.cl/',
  },
  {
    id: 'portales', name: 'Radio Portales', frequency: '1180 AM', tagline: 'La clásica del dial AM',
    city: 'Santiago', region: 'Metropolitana', categories: ['noticias', 'deportes'], color: '#7c2d12',
    streamUrl: 'https://audio3.tustreaming.cl/7350/stream', homepage: 'https://radioportales.cl/',
  },
  {
    id: 'carabineros', name: 'Radio Carabineros', tagline: 'Radio institucional de Carabineros de Chile',
    city: 'Santiago', region: 'Metropolitana', online: true, categories: ['noticias', 'musica'], color: '#14532d',
    streamUrl: 'https://streaming.prositel.cl/8374/stream', homepage: 'https://www.carabineros.cl/',
  },
  {
    id: 'colocolo', name: 'Radio Colo-Colo', tagline: 'La radio del Cacique',
    city: 'Santiago', region: 'Metropolitana', online: true, categories: ['deportes'], color: '#1c1c1c',
    streamUrl: 'https://audio2.tustreaming.cl:10997/stream', homepage: 'https://radiocolocolo.cl/',
  },

  // ——— Metropolitana · música ———
  {
    id: 'pudahuel', name: 'Pudahuel', frequency: '90.5 FM', tagline: 'Música romántica y en español',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#e5007d',
    streamUrl: `${STW}PUDAHUEL_SC`, homepage: 'https://www.pudahuel.cl/',
  },
  {
    id: 'corazon', name: 'Corazón', frequency: '101.3 FM', tagline: 'Música tropical y popular',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#e30613',
    streamUrl: `${STW}CORAZON_SC`, homepage: 'https://www.corazon.cl/',
  },
  {
    id: 'imagina', name: 'Imagina', frequency: '88.1 FM', tagline: 'Música para la mujer de hoy',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#9b1d64',
    streamUrl: `${STW}IMAGINA_SC`, homepage: 'https://www.imagina.cl/',
  },
  {
    id: 'rockandpop', name: 'Rock & Pop', frequency: '94.1 FM', tagline: 'Rock y pop, siempre',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#ef4123',
    streamUrl: `${STW}ROCK_AND_POPAAC_SC`, homepage: 'https://www.rockandpop.cl/',
  },
  {
    id: 'los40', name: 'Los 40', frequency: '101.7 FM', tagline: 'Los éxitos del momento',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#1d1d1b',
    streamUrl: `${STW}LOS40_CHILEAAC.aac`, homepage: 'https://los40.cl/',
  },
  {
    id: 'concierto', name: 'Concierto', frequency: '88.5 FM', tagline: 'Clásicos de los 80 y 90',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#00558c',
    streamUrl: `${STW}CONCIERTOAAC.aac`, homepage: 'https://www.concierto.cl/',
  },
  {
    id: 'fmdos', name: 'FM Dos', frequency: '98.5 FM', tagline: 'Baladas y romántica en inglés y español',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#d6006f',
    streamUrl: `${STW}FMDOSAAC.aac`, homepage: 'https://www.fmdos.cl/',
  },
  {
    id: 'futuro', name: 'Futuro', frequency: '88.9 FM', tagline: 'Rock clásico',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#2b2b2b',
    streamUrl: `${STW}FUTUROAAC.aac`, homepage: 'https://www.futuro.cl/',
  },
  {
    id: 'activa', name: 'Radioactiva', frequency: '92.5 FM', tagline: 'Pop, urbano y dance',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#ff5a00',
    streamUrl: `${STW}ACTIVAAAC.aac`, homepage: 'https://www.radioactiva.cl/',
  },
  {
    id: 'carolina', name: 'Carolina', frequency: '99.3 FM', tagline: 'Música joven y reggaetón',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#7a2ff7',
    streamUrl: 'https://stream.zeno.fm/sri2de2qdlivv', homepage: 'https://www.carolina.cl/',
  },
  {
    id: 'sonar', name: 'Sonar FM', frequency: '105.3 FM', tagline: 'Rock alternativo e indie',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#00a19a',
    streamUrl: 'https://mdstrm.com/audio/5c915724519bce27671c4d15/icecast.audio', homepage: 'https://sonarfm.cl/',
  },
  {
    id: 'playfm', name: 'Play FM', frequency: '100.9 FM', tagline: 'Pop, hits y conversación',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#ec4899',
    streamUrl: 'https://mdstrm.com/audio/5c8d6406f98fbf269f57c82c/icecast.audio', homepage: 'https://playfm.cl/',
  },
  {
    id: 'positiva', name: 'Positiva FM', tagline: 'Música en español y buena onda',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#f59e0b',
    streamUrl: 'https://unlimited4-us.dps.live/positiva/aac/icecast.audio', homepage: 'https://www.positivafm.cl/',
  },
  {
    id: 'romantica', name: 'Romántica', frequency: '104.1 FM', tagline: 'Baladas y clásicos románticos',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#be123c',
    streamUrl: 'https://mdstrm.com/audio/639b78f7ff35df084fa7f964/icecast.audio', homepage: 'https://www.romantica.cl/',
  },
  {
    id: 'infinita', name: 'Infinita', frequency: '100.1 FM', tagline: 'Música selecta y conversación',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica', 'cultura'], color: '#334155',
    streamUrl: 'https://mdstrm.com/audio/639b791cea22540890cd1d8b/icecast.audio', homepage: 'https://www.infinita.cl/',
  },
  {
    id: 'universo', name: 'Universo', frequency: '93.7 FM', tagline: 'Clásicos en inglés',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#1e3a8a',
    streamUrl: 'https://unlimited3-cl.dps.live/universo/aac/icecast.audio', homepage: 'https://www.universo.cl/',
  },
  {
    id: 'paula', name: 'Radio Paula', tagline: 'Música y conversación contemporánea',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#db2777',
    streamUrl: 'https://unlimited3-cl.dps.live/radiopaula/gotardis/audio/now/livestream1.m3u8', streamType: 'hls',
    homepage: 'https://radio.paula.cl/',
  },
  {
    id: 'conquistador', name: 'El Conquistador', tagline: 'Música romántica en español',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#b45309',
    streamUrl: 'https://stream10.usastreams.com/9314/stream', homepage: 'https://www.elconquistadorfm.cl/',
  },
  {
    id: 'recuerdos', name: 'Radio Recuerdos', tagline: 'Los clásicos de siempre',
    city: 'Santiago', region: 'Metropolitana', categories: ['musica'], color: '#92400e',
    streamUrl: 'https://sonando-us.digitalproserver.com/radiorecuerdos.mp3', homepage: 'https://www.radiorecuerdos.cl/',
  },
  {
    id: 'laretro', name: 'La Retro', tagline: 'Hits de los 80',
    region: 'Metropolitana', online: true, categories: ['musica'], color: '#8b5cf6',
    streamUrl: 'https://s2.radio.co/s9ecef4f68/listen', homepage: 'https://www.laretro.cl/',
  },
  {
    id: 'distorsion', name: 'Distorsión FM', tagline: 'Rock y metal independiente',
    region: 'Metropolitana', online: true, categories: ['musica'], color: '#3f3f46',
    streamUrl: 'https://tunein.radiomaniacos.cl/distorsion.mp3', homepage: 'https://distorsion.fm/',
  },
  {
    id: 'radioclub80', name: 'Radio Club 80', tagline: 'Clásicos ochenteros en alta fidelidad',
    region: 'Metropolitana', online: true, categories: ['musica'], color: '#0ea5e9',
    streamUrl: 'https://stream.radioclub80.cl:8002/clasicos80.mp3', homepage: 'https://www.radioclub80.cl/',
  },
  {
    id: 'super45', name: 'Super45', tagline: 'Radio independiente, música nueva',
    region: 'Metropolitana', online: true, categories: ['musica', 'cultura'], color: '#65a30d',
    streamUrl: 'https://s4.radio.co/s421105570/listen', homepage: 'https://super45.fm/',
  },
  {
    id: 'islanegra', name: 'Radio Isla Negra', tagline: 'Música independiente curada',
    region: 'Metropolitana', online: true, categories: ['musica', 'cultura'], color: '#0f766e',
    streamUrl: 'https://radioislanegra.org/radio/8000/basic.aac', homepage: 'https://radioislanegra.com/',
  },
  {
    id: 'codigometal', name: 'Código Metal', tagline: 'Metal sin concesiones',
    region: 'Metropolitana', online: true, categories: ['musica'], color: '#27272a',
    streamUrl: 'https://streaming.viphosting.cl/8012/stream', homepage: 'https://www.codigometal.cl/',
  },

  // ——— Metropolitana · cultura ———
  {
    id: 'beethoven', name: 'Beethoven FM', frequency: '96.5 FM', tagline: 'Música clásica y docta',
    city: 'Santiago', region: 'Metropolitana', categories: ['cultura', 'musica'], color: '#6b4f2a',
    streamUrl: 'https://unlimited5-us.dps.live/beethovenfm/aac/icecast.audio', homepage: 'https://www.beethovenfm.cl/',
  },
  {
    id: '13c', name: '13c Radio', tagline: 'Cultura, arte y pensamiento',
    city: 'Santiago', region: 'Metropolitana', categories: ['cultura'], color: '#b91c1c',
    streamUrl: 'https://mdstrm.com/audio/5c915497c6fd7c085b29169d/icecast.audio', homepage: 'https://www.13cradio.cl/',
  },
  {
    id: 'uchile', name: 'Radio Universidad de Chile', frequency: '102.5 FM', tagline: 'Cultura, debate y música',
    city: 'Santiago', region: 'Metropolitana', categories: ['cultura', 'noticias'], color: '#003a70',
    streamUrl: 'https://streamuchile.teslati.com/liveruch', homepage: 'https://radio.uchile.cl/',
    available: false,
    unavailableReason: 'El stream HTTPS entrega un certificado incompleto; sólo responde de forma confiable por HTTP.',
  },

  // ——— Norte ———
  {
    id: 'municipal-iquique', name: 'Radio Municipal de Iquique', frequency: '93.3 FM', tagline: 'La voz de Iquique',
    city: 'Iquique', region: 'Tarapacá', categories: ['noticias', 'musica'], color: '#0369a1',
    streamUrl: 'https://audio.streaminghd.cl:9202/stream', homepage: 'https://www.municipioiquique.cl/',
  },
  {
    id: 'sol-antofagasta', name: 'Radio Sol', frequency: '97.7 FM', tagline: 'Música y compañía nortina',
    city: 'Antofagasta', region: 'Antofagasta', categories: ['musica'], color: '#f59e0b',
    streamUrl: 'https://us9.maindigitalstream.com/ssl/7389', homepage: 'https://www.radiosol.cl/',
  },
  {
    id: 'ua-antofagasta', name: 'Radio Universidad de Antofagasta', frequency: '99.9 FM', tagline: 'Radio universitaria del norte',
    city: 'Antofagasta', region: 'Antofagasta', categories: ['cultura', 'noticias'], color: '#075985',
    streamUrl: 'https://sonicstream-puntual.grupozgh.cl/8040/radioua', homepage: 'https://radioua.cl/',
  },
  {
    id: 'fmplus-antofagasta', name: 'FM Plus', tagline: 'Éxitos en Antofagasta',
    city: 'Antofagasta', region: 'Antofagasta', categories: ['musica'], color: '#dc2626',
    streamUrl: 'https://conectapp.misradios.cl/radio/fmplus.mp3', homepage: 'https://www.fmplus.cl/',
  },
  {
    id: 'carnaval-antofagasta', name: 'Carnaval Antofagasta', tagline: 'Tropical y ranchera',
    city: 'Antofagasta', region: 'Antofagasta', categories: ['musica'], color: '#ea580c',
    streamUrl: 'https://sonando-us.digitalproserver.com/carnaval_antofagasta.aac', homepage: 'https://www.radiocarnaval.cl/',
  },
  {
    id: 'elloa', name: 'Radio El Loa', frequency: '101.1 FM', tagline: 'Desde Calama',
    city: 'Calama', region: 'Antofagasta', categories: ['noticias', 'musica'], color: '#a16207',
    streamUrl: 'https://us9.maindigitalstream.com/ssl/7258', homepage: 'https://radiofmelloa.cl/',
  },
  {
    id: 'maray', name: 'Radio Maray', tagline: 'Noticias y deportes de Atacama',
    city: 'Copiapó', region: 'Atacama', categories: ['noticias', 'deportes'], color: '#1d4ed8',
    streamUrl: 'https://video.mediawebchile.com:2000/stream/8212/stream', homepage: 'https://www.maray.cl/',
  },
  {
    id: 'xqa5', name: 'Radio XQA5', tagline: 'Compañía en Atacama',
    region: 'Atacama', categories: ['musica'], color: '#9a3412',
    streamUrl: 'https://archi-us.digitalproserver.com/xqa-5.aac', homepage: 'https://radioxqa5.cl/',
  },
  {
    id: 'alternativa', name: 'Alternativa FM', tagline: 'Música y comunidad en Atacama',
    region: 'Atacama', categories: ['musica'], color: '#0891b2',
    streamUrl: 'https://radio.tvstream.cl/8056/stream', homepage: 'https://www.alternativafm.cl/',
  },
  {
    id: 'cobremar', name: 'Radio Cobremar', frequency: '89.9 FM', tagline: 'Chañaral y su gente',
    city: 'Chañaral', region: 'Atacama', categories: ['noticias', 'deportes'], color: '#b45309',
    streamUrl: 'https://audio.bitsur.cl/8066/stream', homepage: 'https://radiocobremar.cl/',
  },
  {
    id: 'guayacan', name: 'Radio Guayacán', tagline: 'Música en Coquimbo',
    city: 'Coquimbo', region: 'Coquimbo', categories: ['musica'], color: '#15803d',
    streamUrl: 'https://sonic.mallocohosting.cl/8038/stream', homepage: 'https://radioguayacan.cl/',
  },
  {
    id: 'carnaval-laserena', name: 'Carnaval La Serena', frequency: '104.5 FM', tagline: 'Tropical en la Región de Coquimbo',
    city: 'La Serena', region: 'Coquimbo', categories: ['musica'], color: '#f97316',
    streamUrl: 'https://cp2.streamchileno.cl/listen/radiocarnaval/radio.mp3', homepage: 'https://www.radiocarnaval.cl/',
  },
  {
    id: 'encanto', name: 'Radio Encanto', frequency: '88.5 FM', tagline: 'Desde el Limarí',
    city: 'Ovalle', region: 'Coquimbo', categories: ['musica'], color: '#c026d3',
    streamUrl: 'https://archi-us.digitalproserver.com/encanto_ovalle.aac', homepage: 'https://radioencanto.cl/',
  },

  // ——— Centro ———
  {
    id: 'festival', name: 'Radio Festival', tagline: 'Clásica de Viña del Mar',
    city: 'Viña del Mar', region: 'Valparaíso', categories: ['musica', 'noticias'], color: '#0284c7',
    streamUrl: 'https://stream.festival.cl/1', homepage: 'https://www.radiofestival.cl/',
  },
  {
    id: 'biobio-valparaiso', name: 'Bío-Bío Valparaíso', tagline: 'Noticias del puerto',
    city: 'Valparaíso', region: 'Valparaíso', categories: ['noticias'], color: '#c8102e',
    streamUrl: 'https://unlimited3-cl.dps.live/biobiovalparaiso/aac/icecast.audio', homepage: 'https://www.biobiochile.cl/',
  },
  {
    id: 'ucv', name: 'UCV Radio', tagline: 'Radio de la PUCV',
    city: 'Valparaíso', region: 'Valparaíso', categories: ['cultura', 'musica'], color: '#1e40af',
    streamUrl: 'https://sonando-us.digitalproserver.com/ucvradio', homepage: 'https://ucvradio.cl/',
  },
  {
    id: 'usm', name: 'Radio USM', tagline: 'Música docta desde la Santa María',
    city: 'Valparaíso', region: 'Valparaíso', categories: ['cultura'], color: '#1e3a5f',
    streamUrl: 'https://stream99.usastreams.com:8012/stream', homepage: 'https://radio.usm.cl/',
  },
  {
    id: 'ritoque', name: 'Ritoque FM', tagline: 'Música para la costa',
    city: 'Valparaíso', region: 'Valparaíso', online: true, categories: ['musica'], color: '#0d9488',
    streamUrl: 'https://archi-us.digitalproserver.com/ritoquefm_aac', homepage: 'https://ritoquefm.cl/',
  },
  {
    id: 'carnaval-vina', name: 'Carnaval Viña del Mar', tagline: 'Tropical y cumbia',
    city: 'Viña del Mar', region: 'Valparaíso', categories: ['musica'], color: '#f97316',
    streamUrl: 'https://sonando-us.digitalproserver.com/carnaval_vinadelmar.aac', homepage: 'https://www.radiocarnaval.cl/',
  },
  {
    id: 'contemporanea', name: 'Radio Contemporánea', frequency: '97.5 FM', tagline: 'Canciones de tu vida, desde el Aconcagua',
    city: 'San Felipe', region: 'Valparaíso', categories: ['musica'], color: '#7c3aed',
    streamUrl: 'https://sonando-us.digitalproserver.com/contemporanea_aconcagua.aac', homepage: 'https://www.radiocontemporanea.cl/',
  },
  {
    id: 'bonita', name: 'Bonita FM', tagline: 'Música en Rancagua',
    city: 'Rancagua', region: "O'Higgins", categories: ['musica'], color: '#e11d48',
    streamUrl: 'https://sonicpanel.chileservidores.cl/8032/stream', homepage: 'https://bonitafm.cl/',
  },
  {
    id: 'colombina', name: 'Radio Colombina', tagline: 'Compañía en O’Higgins',
    region: "O'Higgins", categories: ['musica'], color: '#ca8a04',
    streamUrl: 'https://cast.radioservicios.cl:8314/radio', homepage: 'https://colombinafm.cl/',
  },
  {
    id: 'rtl-curico', name: 'Radio RTL', tagline: 'Noticias y música en Curicó',
    city: 'Curicó', region: 'Maule', categories: ['noticias', 'musica'], color: '#dc2626',
    streamUrl: 'https://radio.mediadev.cl/radio/8070/rtlcurico', homepage: 'https://radiortl.cl/',
  },
  {
    id: 'paloma-talca', name: 'Radio Paloma', tagline: 'Desde Talca',
    city: 'Talca', region: 'Maule', categories: ['musica'], color: '#2563eb',
    streamUrl: 'https://audio3.tustreaming.cl/7320/stream', homepage: 'https://radiopaloma.cl/',
  },
  {
    id: 'ancoa', name: 'Radio Ancoa', tagline: 'La radio de Linares',
    city: 'Linares', region: 'Maule', categories: ['noticias', 'deportes'], color: '#166534',
    streamUrl: 'https://audio2.tustreaming.cl:10991/stream', homepage: 'https://www.radioancoa.cl/',
  },
  {
    id: 'marisol', name: 'Radio Marisol', tagline: 'Música para el Maule',
    region: 'Maule', categories: ['musica'], color: '#db2777',
    streamUrl: 'https://audio0.tustreaming.cl/7620/stream', homepage: 'https://www.radiomarisol.cl/',
  },

  // ——— Ñuble y Biobío ———
  {
    id: 'contexto-nuble', name: 'Radio Contexto', tagline: 'Actualidad de Ñuble',
    city: 'Chillán', region: 'Ñuble', categories: ['noticias'], color: '#0f172a',
    streamUrl: 'https://streaming.viphosting.cl/8028/stream', homepage: 'https://contextonuble.cl/',
  },
  {
    id: 'la-discusion', name: 'Radio La Discusión', tagline: 'Noticias de Chillán',
    city: 'Chillán', region: 'Ñuble', categories: ['noticias'], color: '#991b1b',
    streamUrl: 'https://archi-us.digitalproserver.com/la-discusion-fm.aac', homepage: 'https://www.ladiscusion.cl/',
  },
  {
    id: 'isadora', name: 'Radio Isadora', tagline: 'Música en Ñuble',
    city: 'Chillán', region: 'Ñuble', categories: ['musica'], color: '#a21caf',
    streamUrl: 'https://streaming.comunicacioneschile.net/9326/stream.aac', homepage: 'https://www.radioisadorafm.cl/',
  },
  {
    id: 'carinosa', name: 'Radio Cariñosa', tagline: 'Ranchera y tropical',
    city: 'Chillán', region: 'Ñuble', categories: ['musica'], color: '#ea580c',
    streamUrl: 'https://archi-us.digitalproserver.com/carinosa-fm.aac', homepage: 'https://www.radiocarinosa.cl/',
  },
  {
    id: 'biobio-concepcion', name: 'Bío-Bío Concepción', frequency: '98.1 FM', tagline: 'La casa matriz, desde Concepción',
    city: 'Concepción', region: 'Biobío', categories: ['noticias', 'deportes'], color: '#c8102e',
    streamUrl: 'https://unlimited3-cl.dps.live/biobioconcepcion/aac/icecast.audio', homepage: 'https://www.biobiochile.cl/',
  },
  {
    id: 'biobio-losangeles', name: 'Bío-Bío Los Ángeles', frequency: '96.7 FM', tagline: 'Noticias de la provincia',
    city: 'Los Ángeles', region: 'Biobío', categories: ['noticias'], color: '#c8102e',
    streamUrl: 'https://unlimited11-cl.dps.live/biobiolosangeles/aac/icecast.audio', homepage: 'https://www.biobiochile.cl/',
  },
  {
    id: 'digital-concepcion', name: 'Digital FM', frequency: '105.5 FM', tagline: 'Clásicos y hits penquistas',
    city: 'Concepción', region: 'Biobío', categories: ['musica'], color: '#0ea5e9',
    streamUrl: 'https://unlimited11-cl.dps.live/digitalfm/aac/icecast.audio', homepage: 'https://www.digitalfm.cl/',
  },
  {
    id: 'udec', name: 'Radio UdeC', frequency: '95.1 FM', tagline: 'Radio de la Universidad de Concepción',
    city: 'Concepción', region: 'Biobío', categories: ['cultura', 'musica'], color: '#1d4ed8',
    streamUrl: 'https://audio.divalstream.com:7019/stream', homepage: 'https://www.radioudec.cl/',
  },
  {
    id: 'interamericana', name: 'Radio Interamericana', tagline: 'Clásica de Concepción',
    city: 'Concepción', region: 'Biobío', categories: ['musica'], color: '#0369a1',
    streamUrl: 'https://sonando-us.digitalproserver.com/radiointeramericana.aac', homepage: 'https://www.radiointeramericana.cl/',
  },
  {
    id: 'llacolen', name: 'Radio Llacolén', tagline: 'Desde el Gran Concepción',
    city: 'Concepción', region: 'Biobío', categories: ['musica'], color: '#4d7c0f',
    streamUrl: 'https://sonando-us.digitalproserver.com/radiollacolen.aac', homepage: 'https://www.radiollacolen.com/',
  },
  {
    id: 'elcarbon', name: 'Radio El Carbón', tagline: 'La voz de Lota',
    city: 'Lota', region: 'Biobío', categories: ['noticias', 'musica'], color: '#292524',
    streamUrl: 'https://unlimited11-cl.dps.live/elcarbon/aac/icecast.audio', homepage: 'https://www.elcarbon.cl/',
  },

  // ——— Sur ———
  {
    id: 'biobio-temuco', name: 'Bío-Bío Temuco', tagline: 'Noticias de La Araucanía',
    city: 'Temuco', region: 'La Araucanía', categories: ['noticias'], color: '#c8102e',
    streamUrl: 'https://unlimited3-cl.dps.live/biobiotemuco/aac/icecast.audio', homepage: 'https://www.biobiochile.cl/',
  },
  {
    id: 'edelweiss', name: 'Radio Edelweiss', tagline: 'Música y cultura desde Temuco',
    city: 'Temuco', region: 'La Araucanía', categories: ['cultura', 'musica'], color: '#0f766e',
    streamUrl: 'https://encoder.stationlink.cl/listen/edelweiss/radio.mp3', homepage: 'https://edelweiss.fm/',
  },
  {
    id: 'universal', name: 'Radio Universal', tagline: 'Desde Pitrufquén',
    city: 'Pitrufquén', region: 'La Araucanía', categories: ['musica'], color: '#7c2d12',
    streamUrl: 'https://s02.azuracast.cl/listen/radio_universal/universal', homepage: 'https://www.radiouniversal.cl/',
  },
  {
    id: 'biobio-valdivia', name: 'Bío-Bío Valdivia', tagline: 'Noticias de Los Ríos',
    city: 'Valdivia', region: 'Los Ríos', categories: ['noticias'], color: '#c8102e',
    streamUrl: 'https://unlimited3-cl.dps.live/biobiovaldivia/aac/icecast.audio', homepage: 'https://www.biobiochile.cl/',
  },
  {
    id: 'austral-valdivia', name: 'Radio Austral', tagline: 'Valdivia al aire',
    city: 'Valdivia', region: 'Los Ríos', categories: ['noticias', 'musica'], color: '#1e40af',
    streamUrl: 'https://archi-us.digitalproserver.com/austral.aac', homepage: 'https://www.radioaustralvaldivia.cl/',
  },
  {
    id: 'genoveva', name: 'Radio Genoveva', tagline: 'Música en Valdivia',
    city: 'Valdivia', region: 'Los Ríos', categories: ['musica'], color: '#be185d',
    streamUrl: 'https://audio.bitsur.cl/8032/stream', homepage: 'https://www.radiogenoveva.cl/',
  },
  {
    id: 'biobio-puertomontt', name: 'Bío-Bío Puerto Montt', tagline: 'Noticias de Los Lagos',
    city: 'Puerto Montt', region: 'Los Lagos', categories: ['noticias'], color: '#c8102e',
    streamUrl: 'https://unlimited3-cl.dps.live/biobiopuertomontt/mp3/icecast.audio', homepage: 'https://www.biobiochile.cl/',
  },
  {
    id: 'musicoop', name: 'Musicoop', tagline: 'Música docta y cultura del sur',
    region: 'Los Lagos', categories: ['cultura', 'musica'], color: '#44403c',
    streamUrl: 'https://sonic.portalfoxmix.club/8486/stream', homepage: 'https://www.musicoop.cl/',
  },
  {
    id: 'estrella-del-mar', name: 'Radio Estrella del Mar', tagline: 'La radio de Chiloé',
    city: 'Ancud', region: 'Los Lagos', categories: ['noticias', 'cultura'], color: '#0e7490',
    streamUrl: 'https://streaming.chiloestreaming.com/9626/stream', homepage: 'https://www.estrelladelmar.cl/',
  },
  {
    id: 'las-nieves', name: 'Radio Las Nieves', tagline: 'Desde la Patagonia aysenina',
    region: 'Aysén', categories: ['noticias', 'musica'], color: '#0284c7',
    streamUrl: 'https://audio2.tustreaming.cl:10987/stream', homepage: 'https://www.rln.cl/',
  },
  {
    id: 'melinkana', name: 'La Melinkana FM', tagline: 'Voz de las Guaitecas',
    city: 'Melinka', region: 'Aysén', categories: ['musica'], color: '#15803d',
    streamUrl: 'https://audio3.tustreaming.cl/7050/stream', homepage: 'https://lamelinkanafm.cl/',
  },
  {
    id: 'carnaval-puntaarenas', name: 'Carnaval Punta Arenas', tagline: 'Tropical en el fin del mundo',
    city: 'Punta Arenas', region: 'Magallanes', categories: ['musica'], color: '#f97316',
    streamUrl: 'https://sonando-us.digitalproserver.com/carnaval_puntaarenas.aac', homepage: 'https://www.radiocarnaval.cl/',
  },

  // ——— Sin stream HTTPS verificable (se muestran como no disponibles) ———
  {
    id: 'ubb', name: 'Radio Universidad del Bío-Bío', tagline: 'Radio universitaria',
    city: 'Concepción', region: 'Biobío', categories: ['cultura'], color: '#1e3a8a',
    streamUrl: 'http://146.83.195.22:8000/stream.ogg', homepage: 'https://ubiobio.cl/radioubb/',
    available: false, unavailableReason: 'Sólo transmite por HTTP sin cifrar; los navegadores lo bloquean en sitios HTTPS.',
  },
  {
    id: 'valentin-letelier', name: 'Radio Valentín Letelier', tagline: 'Radio de la Universidad de Valparaíso',
    city: 'Valparaíso', region: 'Valparaíso', categories: ['cultura'], color: '#155e75',
    streamUrl: 'https://streaming.prositel.cl:8068/stream', homepage: 'https://rvl.uv.cl/',
    available: false, unavailableReason: 'El certificado HTTPS del stream está vencido.',
  },
  {
    id: 'utalca', name: 'Radio Universidad de Talca', tagline: 'Música clásica desde el Maule',
    city: 'Talca', region: 'Maule', categories: ['cultura'], color: '#9f1239',
    streamUrl: 'http://iradio.utalca.cl:8000/fm', homepage: 'https://radioemisoras.utalca.cl/',
    available: false, unavailableReason: 'Sólo transmite por HTTP sin cifrar; los navegadores lo bloquean en sitios HTTPS.',
  },
  {
    id: 'tornagaleones', name: 'Radio Tornagaleones', tagline: 'Desde Valdivia',
    city: 'Valdivia', region: 'Los Ríos', categories: ['musica'], color: '#0f766e',
    streamUrl: 'http://tornagaleones.ddns.net:9000/stream', homepage: 'https://www.radiotornagaleones.cl/',
    available: false, unavailableReason: 'Sólo transmite por HTTP sin cifrar; los navegadores lo bloquean en sitios HTTPS.',
  },
]

export const isAvailable = (s: Station) => s.available !== false
