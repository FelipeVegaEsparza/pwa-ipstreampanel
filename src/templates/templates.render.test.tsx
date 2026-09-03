import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { TenantProvider } from '@/core/config/TenantContext'
import { PlayerProvider } from '@/modules/player/PlayerContext'
import type { FullClientData } from '@/core/types'
import { getTemplate } from './index'

const baked = vi.hoisted(() => ({ clientId: null as string | null }))

vi.mock('@/core/config/tenant', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/core/config/tenant')>()
  return {
    ...actual,
    getBakedClientId: () => baked.clientId,
    getBakedClientName: () => null
  }
})

const NEW_TEMPLATES: Array<{ id: string; label: string }> = [
  { id: 'blue', label: 'Blue' },
  { id: 'moderno', label: 'Moderno' },
  { id: 'tradicional', label: 'Tradicional' },
  { id: 'app', label: 'App' },
  { id: 'petroleo', label: 'Petróleo' },
  { id: 'playlist', label: 'Playlist' }
]

const clientData = {
  basicData: { projectName: 'Radio Test' }
} as unknown as FullClientData

function renderTemplate(templateId: string) {
  const Template = getTemplate(templateId)
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <PlayerProvider>
          <MemoryRouter>
            <Template clientData={clientData} isLoading={false} />
          </MemoryRouter>
        </PlayerProvider>
      </TenantProvider>
    </QueryClientProvider>
  )
}

describe('templates nuevos', () => {
  it('cada template renderiza su badge sin romper', async () => {
    baked.clientId = 'cmtest'
    for (const template of NEW_TEMPLATES) {
      const { unmount } = renderTemplate(template.id)
      expect(screen.getByText(template.label)).toBeInTheDocument()
      expect((await screen.findAllByText('Radio Test')).length).toBeGreaterThan(0)
      unmount()
    }
  })
})
