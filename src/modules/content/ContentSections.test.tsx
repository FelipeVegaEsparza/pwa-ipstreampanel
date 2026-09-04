import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { TenantProvider } from '@/core/config/TenantContext'
import type { FullClientData } from '@/core/types'
import { ContentSectionStack } from './ContentSections'

function fullData(selectedTemplate: string): FullClientData {
  const base = {
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
  return {
    client: { id: 'cmtest', name: 'Radio Test' },
    selectedTemplate,
    oneSignalAppId: null,
    basicData: {
      projectName: 'Radio Test',
      projectDescription: 'La radio',
      logoUrl: null,
      coverUrl: null,
      websiteUrl: null,
      radioStreamingUrl: null,
      videoStreamingUrl: 'https://stream.example/tv.m3u8',
      ...base
    },
    socialNetworks: {
      facebook: 'https://facebook.com/radio',
      youtube: null,
      instagram: null,
      tiktok: null,
      whatsapp: null,
      x: null,
      ...base
    },
    news: [
      {
        id: 'n1',
        name: 'Noticia 1',
        slug: 'noticia-1',
        shortText: '',
        longText: '',
        imageUrl: null,
        createdAt: base.createdAt,
        updatedAt: base.updatedAt
      }
    ],
    podcasts: [
      {
        id: 'p1',
        title: 'Podcast 1',
        description: '',
        imageUrl: null,
        audioUrl: null,
        duration: null,
        episodeNumber: null,
        season: null,
        createdAt: base.createdAt,
        updatedAt: base.updatedAt
      }
    ],
    videocasts: [
      {
        id: 'v1',
        title: 'Videocast 1',
        description: '',
        imageUrl: null,
        videoUrl: null,
        duration: null,
        episodeNumber: null,
        season: null,
        createdAt: base.createdAt,
        updatedAt: base.updatedAt
      }
    ],
    galleries: [
      {
        id: 'g1',
        title: 'Galería 1',
        description: '',
        images: [],
        createdAt: base.createdAt,
        updatedAt: base.updatedAt
      }
    ],
    events: [
      {
        id: 'e1',
        title: 'Evento 1',
        description: '',
        date: '2026-02-01',
        time: '20:00',
        location: null,
        eventUrl: null,
        imageUrl: null,
        createdAt: base.createdAt,
        updatedAt: base.updatedAt
      }
    ],
    announcers: [
      {
        id: 'a1',
        name: 'Locutor 1',
        description: '',
        imageUrl: null,
        createdAt: base.createdAt,
        updatedAt: base.updatedAt
      }
    ],
    polls: [
      {
        id: 'po1',
        title: 'Encuesta 1',
        active: true,
        options: [{ id: 'o1', text: 'Opción', votes: 0 }],
        createdAt: base.createdAt,
        updatedAt: base.updatedAt
      }
    ],
    promotions: [
      {
        id: 'pr1',
        title: 'Promoción 1',
        description: '',
        imageUrl: null,
        link: null,
        createdAt: base.createdAt,
        updatedAt: base.updatedAt
      }
    ],
    programs: [
      {
        id: 'pg1',
        name: 'Programa 1',
        imageUrl: null,
        description: '',
        startTime: '08:00',
        endTime: '10:00',
        weekDays: [1],
        createdAt: base.createdAt,
        updatedAt: base.updatedAt
      }
    ],
    videos: [
      {
        id: 'vd1',
        name: 'Video 1',
        videoUrl: 'https://stream.example/video.mp4',
        description: '',
        order: 0,
        createdAt: base.createdAt,
        updatedAt: base.updatedAt
      }
    ],
    sponsors: [
      {
        id: 's1',
        name: 'Auspiciador 1',
        logoUrl: null,
        address: null,
        description: '',
        facebook: null,
        youtube: null,
        instagram: null,
        tiktok: null,
        whatsapp: null,
        x: null,
        website: null,
        createdAt: base.createdAt,
        updatedAt: base.updatedAt
      }
    ]
  }
}

function sectionTitles(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('section h2')).map(
    (heading) => heading.textContent ?? ''
  )
}

function renderStack(template: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <MemoryRouter>
          <ContentSectionStack
            clientData={fullData(template)}
            isLoading={false}
          />
        </MemoryRouter>
      </TenantProvider>
    </QueryClientProvider>
  )
}

const DEFAULT_ORDER = [
  'Encuestas',
  'TV en vivo',
  'Promociones',
  'Noticias',
  'Programación',
  'Galerías',
  'Podcasts',
  'Videocasts',
  'Videos',
  'Eventos',
  'Locutores',
  'Auspiciadores',
  'Síguenos',
  'Chat en vivo'
]

const COVERED_ORDER = [
  'Noticias',
  'Podcasts',
  'Videocasts',
  'Galerías',
  'Eventos',
  'Locutores',
  'Encuestas',
  'TV en vivo',
  'Promociones',
  'Programación',
  'Videos',
  'Auspiciadores',
  'Síguenos',
  'Chat en vivo'
]

describe('ContentSectionStack', () => {
  it('antepone el orden editorial en la home de covered', () => {
    const { container } = renderStack('covered')
    expect(sectionTitles(container)).toEqual(COVERED_ORDER)
  })

  it('conserva el orden actual para un template distinto de covered', () => {
    const { container } = renderStack('moderna')
    expect(sectionTitles(container)).toEqual(DEFAULT_ORDER)
  })

  it('no renderiza una sección sin datos ni altera el orden del resto', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    })
    const data = fullData('covered')
    data.news = []
    data.events = []
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <TenantProvider>
          <MemoryRouter>
            <ContentSectionStack clientData={data} isLoading={false} />
          </MemoryRouter>
        </TenantProvider>
      </QueryClientProvider>
    )
    const titles = sectionTitles(container)
    expect(titles).not.toContain('Noticias')
    expect(titles).not.toContain('Eventos')
    expect(titles.indexOf('Podcasts')).toBeLessThan(titles.indexOf('Galerías'))
    expect(titles.indexOf('Galerías')).toBeLessThan(titles.indexOf('Locutores'))
  })
})
