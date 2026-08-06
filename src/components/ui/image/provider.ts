import type { InjectionKey } from 'vue'

export type ImageFormat = 'webp' | 'avif' | 'origin'

export interface ImageProviderOptions {
  src: string
  width: number
  quality?: number
  format?: ImageFormat
}

/** Builds a URL for a given width / quality / format. Apps inject their CDN or API. */
export type ImageProvider = (opts: ImageProviderOptions) => string

export const IMAGE_PROVIDER_KEY: InjectionKey<ImageProvider> = Symbol('manfad-image-provider')

/** Default: return `src` unchanged (no CDN / no resize). */
export const defaultImageProvider: ImageProvider = ({ src }) => src

/** Default width candidates used for `srcset`. */
export const IMAGE_SRCSET_WIDTHS = [640, 1080, 1920] as const

/**
 * CDN helper for upload-time variants.
 * Example: `createCdnImageProvider('https://cdn.example.com')`
 * → `https://cdn.example.com/uploads/photo/1080w.webp`
 */
export function createCdnImageProvider(
  baseUrl: string,
  options?: {
    /** Path template. Tokens: `{src}`, `{width}`, `{quality}`, `{format}` */
    template?: string
  },
): ImageProvider {
  const base = baseUrl.replace(/\/$/, '')
  const template = options?.template ?? '{src}/{width}w.{format}'

  return ({ src, width, quality = 75, format = 'webp' }) => {
    const normalizedSrc = src.replace(/^\//, '').replace(/\.[^.]+$/, '')
    const ext = format === 'origin' ? (src.split('.').pop() ?? 'webp') : format
    const path = template
      .split('{src}').join(normalizedSrc)
      .split('{width}').join(String(width))
      .split('{quality}').join(String(quality))
      .split('{format}').join(ext)
    return `${base}/${path.replace(/^\//, '')}`
  }
}
