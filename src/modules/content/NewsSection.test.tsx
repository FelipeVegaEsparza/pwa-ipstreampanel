import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { FullClientData, News } from '@/core/types'
import { NewsSection } from './NewsSection'

function newsItem(id: string, name: string, overrides: Partial<News> = {}): News {
  return {
    id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    shortText: 'Resumen breve',
    longText: 'Contenido completo de la noticia',
    imageUrl: null,
    category: { id: 'c1', name: 'Actualidad', slug: 'actualidad' },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides
  }
}

function clientDataWith(news: News[]): FullClientData {
  return { news } as unknown as FullClientData
}

function renderNews(variant: 'grid' | 'featured', news: News[]) {
  return render(
    <MemoryRouter>
      <NewsSection clientData={clientDataWith(news)} isLoading={false} variant={variant} />
    </MemoryRouter>
  )
}

describe('NewsSection variant featured', () => {
  const news = [
    newsItem('n1', 'Primera noticia'),
    newsItem('n2', 'Segunda noticia'),
    newsItem('n3', 'Tercera noticia'),
    newsItem('n4', 'Cuarta noticia'),
    newsItem('n5', 'Quinta noticia')
  ]

  it('no se renderiza sin noticias', () => {
    const { container } = renderNews('featured', [])
    expect(container.firstChild).toBeNull()
  })

  it('muestra la primera como destacada y hasta 3 en el costado', () => {
    const { container } = renderNews('featured', news)

    const layout = container.querySelector('[class*="layout"]')
    expect(layout).not.toBeNull()

    const featured = container.querySelector('[class*="featured"]')
    expect(featured).not.toBeNull()
    expect(within(featured as HTMLElement).getByText('Primera noticia')).toBeInTheDocument()

    expect(screen.getByText('Segunda noticia')).toBeInTheDocument()
    expect(screen.getByText('Tercera noticia')).toBeInTheDocument()
    expect(screen.getByText('Cuarta noticia')).toBeInTheDocument()
    expect(screen.queryByText('Quinta noticia')).toBeNull()
  })

  it('con pocas noticias muestra solo las disponibles', () => {
    renderNews('featured', [newsItem('n1', 'Única noticia')])
    expect(screen.getByText('Única noticia')).toBeInTheDocument()
  })
})

describe('NewsSection modal', () => {
  it('abre el detalle en un modal al pinchar una noticia en la variante grid', () => {
    renderNews('grid', [newsItem('n1', 'Noticia modal')])

    fireEvent.click(screen.getByRole('button', { name: 'Abrir noticia Noticia modal' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Noticia modal')).toBeInTheDocument()
    expect(
      within(dialog).getByText('Contenido completo de la noticia')
    ).toBeInTheDocument()
    expect(
      within(dialog).getByRole('link', { name: 'Ver noticia completa →' })
    ).toHaveAttribute('href', '/noticias/noticia-modal')
  })

  it('abre el detalle desde la destacada y cierra con Escape', () => {
    renderNews('featured', [
      newsItem('n1', 'Destacada modal'),
      newsItem('n2', 'Segunda')
    ])

    fireEvent.click(screen.getByRole('button', { name: 'Abrir noticia Destacada modal' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('cierra el modal al pinchar el overlay', () => {
    const { container } = renderNews('grid', [newsItem('n1', 'Overlay close')])

    fireEvent.click(screen.getByRole('button', { name: 'Abrir noticia Overlay close' }))
    const overlay = container.querySelector('[role="dialog"]') as HTMLElement
    fireEvent.click(overlay)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('abre una noticia lateral en la variante featured', () => {
    renderNews('featured', [
      newsItem('n1', 'Principal'),
      newsItem('n2', 'Lateral abierta')
    ])

    fireEvent.click(screen.getByRole('button', { name: 'Abrir noticia Lateral abierta' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
