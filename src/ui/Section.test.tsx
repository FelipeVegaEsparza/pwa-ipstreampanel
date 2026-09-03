import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Section } from './Section'

describe('Section', () => {
  it('no renderiza nada cuando visible es false', () => {
    const { container } = render(
      <Section title="Noticias" visible={false}>
        contenido
      </Section>
    )
    expect(container.querySelector('section')).toBeNull()
    expect(screen.queryByText('contenido')).toBeNull()
  })

  it('renderiza título y contenido cuando visible es true', () => {
    render(
      <Section title="Noticias" visible>
        contenido
      </Section>
    )
    expect(screen.getByText('Noticias')).toBeInTheDocument()
    expect(screen.getByText('contenido')).toBeInTheDocument()
  })

  it('muestra skeleton durante la carga y oculta el contenido', () => {
    const { container } = render(
      <Section title="Noticias" visible loading>
        contenido
      </Section>
    )
    expect(screen.queryByText('contenido')).toBeNull()
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })
})
