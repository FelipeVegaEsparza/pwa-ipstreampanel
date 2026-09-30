import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { FullClientData, Program } from '@/core/types'
import { ProgramsSection } from './ProgramsSection'

function program(overrides: Partial<Program>): Program {
  return {
    id: 'p1',
    name: 'El Mañanero',
    imageUrl: null,
    description: 'Programa matutino',
    startTime: '08:00',
    endTime: '10:00',
    weekDays: [1, 2, 3, 4, 5],
    createdAt: '',
    updatedAt: '',
    ...overrides
  }
}

function clientDataWith(programs: Program[]): FullClientData {
  return { programs } as unknown as FullClientData
}

describe('ProgramsSection', () => {
  it('no se renderiza sin programas', () => {
    render(<ProgramsSection clientData={clientDataWith([])} isLoading={false} />)
    expect(screen.queryByText('Programación')).toBeNull()
  })

  it('agrupa por día numérico', () => {
    render(
      <ProgramsSection
        clientData={clientDataWith([program({ weekDays: [1] })])}
        isLoading={false}
      />
    )
    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('El Mañanero')).toBeInTheDocument()
  })

  it('acepta días como string en inglés', () => {
    render(
      <ProgramsSection
        clientData={clientDataWith([
          program({ weekDays: ['monday'] as unknown as number[] })
        ])}
        isLoading={false}
      />
    )
    expect(screen.getByText('Lunes')).toBeInTheDocument()
  })

  it('muestra el contenido aunque los programas no traigan weekDays', () => {
    render(
      <ProgramsSection
        clientData={clientDataWith([program({ weekDays: [] })])}
        isLoading={false}
      />
    )
    expect(screen.getByText('Programación')).toBeInTheDocument()
    expect(screen.getByText('El Mañanero')).toBeInTheDocument()
  })

  it('variante cards: una card por programa con horario y días', () => {
    render(
      <ProgramsSection
        clientData={clientDataWith([
          program({ weekDays: [1, 3], imageUrl: '/api/uploads/x.png' })
        ])}
        isLoading={false}
        variant="cards"
      />
    )
    expect(screen.getByText('El Mañanero')).toBeInTheDocument()
    expect(screen.getByText('08:00–10:00')).toBeInTheDocument()
    expect(screen.getByText('Lunes · Miércoles')).toBeInTheDocument()
    expect(screen.queryByText('Lunes')).toBeNull()
  })

  it('variante tabs: lista los días y filtra el contenido por día', () => {
    render(
      <ProgramsSection
        clientData={clientDataWith([
          program({ id: 'a', name: 'Show Lunes', weekDays: [1] }),
          program({ id: 'b', name: 'Show Martes', weekDays: [2] })
        ])}
        isLoading={false}
        variant="tabs"
      />
    )

    expect(screen.getAllByRole('tab')).toHaveLength(7)

    fireEvent.click(screen.getByRole('tab', { name: 'Martes' }))
    expect(screen.getByText('Show Martes')).toBeInTheDocument()
    expect(screen.queryByText('Show Lunes')).toBeNull()

    fireEvent.click(screen.getByRole('tab', { name: 'Lunes' }))
    expect(screen.getByText('Show Lunes')).toBeInTheDocument()
    expect(screen.queryByText('Show Martes')).toBeNull()
  })

  it('variante tabs: avisa cuando el día no tiene programación', () => {
    render(
      <ProgramsSection
        clientData={clientDataWith([program({ weekDays: [1] })])}
        isLoading={false}
        variant="tabs"
      />
    )

    fireEvent.click(screen.getByRole('tab', { name: 'Domingo' }))
    expect(screen.getByText('Sin programación para este día.')).toBeInTheDocument()
  })
})
