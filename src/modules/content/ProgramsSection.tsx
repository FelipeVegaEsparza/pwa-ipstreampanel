import { asArray, normalizeWeekDay } from '@/core/adapters'
import type { Program } from '@/core/types'
import { Card, Grid, Section, SmartImage } from '@/ui'
import type { SectionDataProps } from './format'
import styles from './content.module.css'

const DAYS = [0, 1, 2, 3, 4, 5, 6]
const WEEK_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]

function programDays(program: Program): number[] {
  return asArray(program.weekDays).flatMap((day) => {
    if (typeof day === 'number') {
      return Number.isFinite(day) && day >= 0 && day <= 6 ? [Math.round(day)] : []
    }
    const index = WEEK_NAMES.indexOf(String(day).trim().toLowerCase())
    return index >= 0 ? [index] : []
  })
}

interface ProgramsSectionProps extends SectionDataProps {
  variant?: 'list' | 'cards'
}

export function ProgramsSection({
  clientData,
  isLoading,
  variant = 'list'
}: ProgramsSectionProps) {
  const programs = asArray(clientData?.programs)

  if (variant === 'cards') {
    return (
      <Section title="Programación" visible={programs.length > 0} loading={isLoading}>
        <Grid>
          {programs.map((program) => {
            const days = [...new Set(programDays(program))]
              .map((day) => normalizeWeekDay(day))
              .join(' · ')
            return (
              <Card key={program.id}>
                <SmartImage
                  className={styles.programCardMedia}
                  src={program.imageUrl}
                  alt={program.name}
                />
                <div className={styles.programCardBody}>
                  <h3 className={styles.itemTitle}>{program.name}</h3>
                  {program.description && (
                    <p className={styles.muted}>{program.description}</p>
                  )}
                  <div className={styles.schedule}>
                    <span className={styles.scheduleTime}>
                      {program.startTime}–{program.endTime}
                    </span>
                    {days && (
                      <span className={styles.scheduleDays}>{days}</span>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </Grid>
      </Section>
    )
  }

  const withDays = programs.filter((program) => programDays(program).length > 0)
  const noDays = programs.filter((program) => programDays(program).length === 0)

  const byDay = DAYS.map((dayIndex) => {
    const items = withDays.filter((program) => programDays(program).includes(dayIndex))
    return { dayIndex, items }
  }).filter((group) => group.items.length > 0)

  const orphan = noDays.length > 0

  return (
    <Section title="Programación" visible={programs.length > 0} loading={isLoading}>
      {byDay.map((group) => (
        <div key={group.dayIndex}>
          <h3 className={styles.day}>{normalizeWeekDay(group.dayIndex)}</h3>
          {group.items.map((program) => (
            <div key={program.id} className={styles.programRow}>
              <span className={styles.programTime}>
                {program.startTime}–{program.endTime}
              </span>
              <span className={styles.programName}>{program.name}</span>
              <span className={styles.programDesc}>{program.description}</span>
            </div>
          ))}
        </div>
      ))}

      {orphan &&
        noDays.map((program) => (
          <div key={program.id} className={styles.programRow}>
            <span className={styles.programTime}>
              {program.startTime}–{program.endTime}
            </span>
            <span className={styles.programName}>{program.name}</span>
            <span className={styles.programDesc}>{program.description}</span>
          </div>
        ))}
    </Section>
  )
}
