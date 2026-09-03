import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { InstallPrompt } from './InstallPrompt'

describe('InstallPrompt', () => {
  it('no muestra el botón sin el evento de instalación', () => {
    render(<InstallPrompt />)
    expect(screen.queryByText('Instalar app')).toBeNull()
  })

  it('muestra el botón cuando se dispara beforeinstallprompt', () => {
    render(<InstallPrompt />)
    act(() => {
      window.dispatchEvent(new Event('beforeinstallprompt'))
    })
    expect(screen.getByText('Instalar app')).toBeInTheDocument()
  })

  it('llama al prompt al hacer clic', () => {
    render(<InstallPrompt />)
    const event = new Event('beforeinstallprompt')
    const promptMock = vi.fn()
    Object.defineProperty(event, 'prompt', { value: promptMock })
    act(() => {
      window.dispatchEvent(event)
    })

    fireEvent.click(screen.getByText('Instalar app'))
    expect(promptMock).toHaveBeenCalledTimes(1)
  })
})
