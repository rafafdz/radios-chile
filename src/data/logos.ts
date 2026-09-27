/**
 * Logos de emisoras, servidos como assets locales en `public/logos/<id>.webp`.
 *
 * Cada imagen se descargó del sitio oficial de la emisora (apple-touch-icon,
 * favicon grande u og:image), se recortó y se redujo a un máximo de 256 px.
 * La URL de origen de cada una está en `public/logos/sources.json`.
 *
 * `cover`: el logo trae su propio fondo y llena el cuadro.
 * `contain`: logo con transparencia o no cuadrado, se muestra sobre una placa clara.
 *
 * Las emisoras sin entrada usan el monograma tipográfico con su color.
 */
export type LogoFit = 'cover' | 'contain'

export const LOGOS: Record<string, LogoFit> = {
  'biobio-santiago': 'cover',
  'cooperativa': 'contain',
  'adn': 'contain',
  'agricultura': 'cover',
  'pauta': 'contain',
  'tele13-radio': 'cover',
  'carabineros': 'contain',
  'colocolo': 'contain',
  'pudahuel': 'contain',
  'corazon': 'contain',
  'imagina': 'cover',
  'rockandpop': 'cover',
  'los40': 'contain',
  'concierto': 'cover',
  'fmdos': 'contain',
  'futuro': 'cover',
  'activa': 'cover',
  'sonar': 'cover',
  'playfm': 'cover',
  'romantica': 'contain',
  'infinita': 'contain',
  'universo': 'cover',
  'paula': 'cover',
  'recuerdos': 'cover',
  'laretro': 'contain',
  'codigometal': 'cover',
  '13c': 'cover',
  'uchile': 'cover',
  'sol-antofagasta': 'contain',
  'ua-antofagasta': 'contain',
  'fmplus-antofagasta': 'contain',
  'carnaval-antofagasta': 'contain',
  'maray': 'cover',
  'xqa5': 'cover',
  'cobremar': 'cover',
  'guayacan': 'cover',
  'carnaval-laserena': 'contain',
  'encanto': 'contain',
  'biobio-valparaiso': 'cover',
  'ucv': 'contain',
  'usm': 'cover',
  'carnaval-vina': 'contain',
  'contemporanea': 'cover',
  'bonita': 'cover',
  'colombina': 'contain',
  'rtl-curico': 'cover',
  'paloma-talca': 'contain',
  'ancoa': 'contain',
  'marisol': 'contain',
  'la-discusion': 'cover',
  'biobio-concepcion': 'cover',
  'biobio-losangeles': 'cover',
  'digital-concepcion': 'contain',
  'interamericana': 'contain',
  'llacolen': 'contain',
  'biobio-temuco': 'cover',
  'edelweiss': 'contain',
  'universal': 'contain',
  'biobio-valdivia': 'cover',
  'austral-valdivia': 'cover',
  'genoveva': 'contain',
  'biobio-puertomontt': 'cover',
  'las-nieves': 'contain',
  'carnaval-puntaarenas': 'contain',
  'valentin-letelier': 'contain',
  'tornagaleones': 'cover',
}

export function logoUrl(id: string): string | null {
  return id in LOGOS ? `${import.meta.env.BASE_URL}logos/${id}.webp` : null
}
