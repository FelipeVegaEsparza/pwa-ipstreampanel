import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDocumentTitle } from './useDocumentTitle'

function TitleHarness({ title }: { title: string }) {
  useDocumentTitle(title)
  return null
}

describe('useDocumentTitle', () => {
  it('fija document.title con el nombre del cliente', () => {
    render(<TitleHarness title="Radio Fusion Austral" />)
    expect(document.title).toBe('Radio Fusion Austral')
  })

  it('no modifica el título si el nombre está vacío', () => {
    document.title = 'Título previo'
    render(<TitleHarness title="" />)
    expect(document.title).toBe('Título previo')
  })
})
