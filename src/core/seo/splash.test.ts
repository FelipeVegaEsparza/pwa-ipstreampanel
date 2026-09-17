import { describe, expect, it } from 'vitest'
import { injectSplash, renderSplash } from './splash'

describe('renderSplash', () => {
  it('usa la portada como background y muestra el nombre', () => {
    const html = renderSplash({
      image: 'https://panelipstream.cl/api/uploads/x/cover.webp',
      name: 'Radio Ejemplo'
    })

    expect(html).toContain(
      `background-image:url('https://panelipstream.cl/api/uploads/x/cover.webp')`
    )
    expect(html).toContain('<p class="app-splash__name">Radio Ejemplo</p>')
    expect(html).toContain('app-splash__spinner')
  })

  it('funciona sin imagen ni nombre (fondo neutro)', () => {
    const html = renderSplash({})
    expect(html).toContain('app-splash__spinner')
    expect(html).not.toContain('background-image')
    expect(html).not.toContain('app-splash__name')
  })

  it('escapa el nombre y la imagen', () => {
    const html = renderSplash({ image: 'https://x/a?b=1&c=2', name: 'A & "B"' })
    expect(html).toContain('A &amp; &quot;B&quot;')
    expect(html).toContain('https://x/a?b=1&amp;c=2')
  })
})

describe('injectSplash', () => {
  it('reemplaza el marcador', () => {
    const html = '<div id="root"><!-- app-splash --></div>'
    const result = injectSplash(html, { image: 'https://x/c.jpg', name: 'Radio' })
    expect(result).not.toContain('<!-- app-splash -->')
    expect(result).toContain('app-splash__spinner')
    expect(result).toContain('https://x/c.jpg')
  })

  it('si no hay marcador, inserta dentro del root', () => {
    const result = injectSplash('<div id="root"></div>', { name: 'Radio' })
    expect(result).toContain('app-splash__spinner')
    expect(result.indexOf('app-splash')).toBeLessThan(result.lastIndexOf('</div>'))
  })
})
