import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SmartImage } from './SmartImage'

describe('SmartImage', () => {
  it('resuelve rutas relativas a URLs absolutas', () => {
    render(<SmartImage src="/api/uploads/cmx/logo.png" alt="Logo" />)
    const img = screen.getByAltText('Logo')
    expect(img).toHaveAttribute(
      'src',
      'https://panelipstream.cl/api/uploads/cmx/logo.png'
    )
  })

  it('aplica lazy loading', () => {
    render(<SmartImage src="https://cdn.ejemplo.cl/x.webp" alt="Imagen" />)
    expect(screen.getByAltText('Imagen')).toHaveAttribute('loading', 'lazy')
  })

  it('no renderiza nada sin src', () => {
    const { container } = render(<SmartImage src={null} alt="Vacía" />)
    expect(container.querySelector('img')).toBeNull()
  })

  it('usa el fallback cuando la imagen falla', () => {
    render(
      <SmartImage
        src="/api/dashboard/library/cover"
        fallbacks={['/api/uploads/cmx/logo.png']}
        alt="Portada"
      />
    )
    const img = screen.getByAltText('Portada')
    fireEvent.error(img)
    expect(screen.getByAltText('Portada')).toHaveAttribute(
      'src',
      'https://panelipstream.cl/api/uploads/cmx/logo.png'
    )
  })

  it('oculta la imagen si todos los candidatos fallan', () => {
    render(
      <SmartImage
        src="/api/dashboard/library/cover"
        fallbacks={['/api/uploads/cmx/logo.png']}
        alt="Portada"
      />
    )
    const img = screen.getByAltText('Portada')
    fireEvent.error(img)
    fireEvent.error(screen.getByAltText('Portada'))
    expect(screen.queryByAltText('Portada')).toBeNull()
  })
})
