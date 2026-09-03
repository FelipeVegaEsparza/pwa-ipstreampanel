import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { FullClientData } from '@/core/types'
import { VideosSection } from './VideosSection'

function clientDataWith(videos: FullClientData['videos']): FullClientData {
  return { videos } as unknown as FullClientData
}

describe('VideosSection', () => {
  it('no se renderiza sin videos', () => {
    render(<VideosSection clientData={clientDataWith([])} isLoading={false} />)
    expect(screen.queryByText('Videos')).toBeNull()
  })

  it('abre un modal de reproducción al hacer clic en un video de YouTube', () => {
    render(
      <VideosSection
        clientData={clientDataWith([
          {
            id: 'v1',
            name: 'Entrevista a banda',
            videoUrl: 'https://www.youtube.com/watch?v=abcdef12345',
            description: '',
            order: 1,
            createdAt: '',
            updatedAt: ''
          }
        ])}
        isLoading={false}
      />
    )

    expect(screen.getByText('Videos')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Reproducir Entrevista/ }))

    const iframe = document.querySelector('iframe')
    expect(iframe).not.toBeNull()
    expect(iframe?.getAttribute('src')).toBe(
      'https://www.youtube.com/embed/abcdef12345'
    )
  })
})
