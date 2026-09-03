import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TenantProvider } from '@/core/config/TenantContext'
import { PlayerProvider } from '@/modules/player/PlayerContext'
import { App } from './App'

const baked = vi.hoisted(() => ({ clientId: null as string | null }))

vi.mock('@/core/config/tenant', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/core/config/tenant')>()
  return {
    ...actual,
    getBakedClientId: () => baked.clientId,
    getBakedClientName: () => null
  }
})

const TEST_CLIENT_ID = 'cmtezi0ci00014raq8hrhhwfp'
const API_BASE = `https://panelipstream.cl/api/public/${TEST_CLIENT_ID}`

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

function fullClientData() {
  return {
    client: { id: TEST_CLIENT_ID, name: 'Radio Fusion Austral' },
    selectedTemplate: 'minimalista',
    oneSignalAppId: null,
    basicData: {
      projectName: 'Radio Fusion Austral',
      projectDescription: 'La radio de la Patagonia',
      logoUrl: null,
      coverUrl: null,
      websiteUrl: null,
      radioStreamingUrl: null,
      videoStreamingUrl: null,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z'
    },
    socialNetworks: null,
    programs: [],
    news: [
      {
        id: 'cmnews1',
        name: 'Lanzamos nueva programación',
        slug: 'lanzamos-nueva-programacion',
        shortText: 'Resumen',
        longText: 'Contenido completo',
        imageUrl: null,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
      }
    ],
    videos: [],
    sponsors: [],
    galleries: [],
    announcers: [],
    polls: [],
    events: [],
    promotions: [],
    podcasts: [],
    videocasts: []
  }
}

function mockFetch() {
  return vi.fn((input: RequestInfo | URL) => {
    const url = String(input)

    if (url === API_BASE) {
      return Promise.resolve(jsonResponse(200, fullClientData()))
    }

    if (url.endsWith('/streaming')) {
      return Promise.resolve(
        jsonResponse(200, {
          clientId: TEST_CLIENT_ID,
          clientName: 'Radio Fusion Austral',
          mount: 'radio_abc',
          streamUrl: 'https://stream.example/radio',
          bitrate: 128,
          status: 'autodj',
          isLive: false,
          listeners: 12,
          listenerPeak: 20,
          jingleConfig: null,
          currentTrack: null,
          nextTrack: null,
          position: null,
          lastUpdate: '2025-01-01T00:00:00.000Z'
        })
      )
    }

    if (url.includes('/pwa/register')) {
      return Promise.resolve(
        jsonResponse(200, { registered: true, total: 1, firstTime: true })
      )
    }

    return Promise.resolve(jsonResponse(404, { error: 'not found' }))
  })
}

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <PlayerProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PlayerProvider>
      </TenantProvider>
    </QueryClientProvider>
  )
}

describe('App shell', () => {
  afterEach(() => {
    baked.clientId = null
    vi.unstubAllGlobals()
    window.history.pushState({}, '', '/')
    localStorage.clear()
  })

  it('resuelve el tenant, renderiza el template y registra la PWA', async () => {
    baked.clientId = TEST_CLIENT_ID
    const fetchMock = mockFetch()
    vi.stubGlobal('fetch', fetchMock)

    renderApp()

    expect((await screen.findAllByText('Radio Fusion Austral')).length).toBeGreaterThan(0)
    expect(screen.getByText('Sintoniza nuestra señal')).toBeInTheDocument()

    const registerCalls = fetchMock.mock.calls.filter(([input]) =>
      String(input).includes('/pwa/register')
    )
    expect(registerCalls.length).toBeGreaterThan(0)
  })

  it('no reenvía el registro PWA si el dispositivo ya está registrado', async () => {
    localStorage.setItem(`ipstream_device_registered_${TEST_CLIENT_ID}`, 'true')
    baked.clientId = TEST_CLIENT_ID
    const fetchMock = mockFetch()
    vi.stubGlobal('fetch', fetchMock)

    renderApp()

    expect((await screen.findAllByText('Radio Fusion Austral')).length).toBeGreaterThan(0)

    const registerCalls = fetchMock.mock.calls.filter(([input]) =>
      String(input).includes('/pwa/register')
    )
    expect(registerCalls.length).toBe(0)
  })

  it('muestra la pantalla de error cuando no hay clientId configurado', async () => {
    baked.clientId = null
    const fetchMock = mockFetch()
    vi.stubGlobal('fetch', fetchMock)

    renderApp()

    expect(await screen.findByText('Cliente no encontrado')).toBeInTheDocument()
  })
})
