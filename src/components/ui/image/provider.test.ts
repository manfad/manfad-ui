import { describe, expect, it } from 'vitest'
import { createCdnImageProvider, defaultImageProvider } from './provider'

describe('defaultImageProvider', () => {
  it('returns src unchanged', () => {
    expect(defaultImageProvider({ src: '/photo.webp', width: 1080 })).toBe('/photo.webp')
  })
})

describe('createCdnImageProvider', () => {
  it('builds width-tier CDN URLs', () => {
    const provider = createCdnImageProvider('https://cdn.example.com')
    expect(provider({ src: 'uploads/photo.webp', width: 1080 })).toBe(
      'https://cdn.example.com/uploads/photo/1080w.webp',
    )
  })

  it('supports custom templates', () => {
    const provider = createCdnImageProvider('https://cdn.example.com', {
      template: 'img/{src}?w={width}&q={quality}',
    })
    expect(provider({ src: '/a/b.jpg', width: 640, quality: 80 })).toBe(
      'https://cdn.example.com/img/a/b?w=640&q=80',
    )
  })
})
