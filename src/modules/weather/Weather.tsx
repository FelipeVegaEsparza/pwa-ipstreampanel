import type { BasicLocation } from '@/core/types'
import { weatherLabel } from './label'
import { useWeather } from './useWeather'
import styles from './Weather.module.css'

interface WeatherProps {
  location: BasicLocation | null | undefined
  className?: string
}

export function Weather({ location, className }: WeatherProps) {
  const weather = useWeather(location)
  if (!weather) return null

  const unit = location?.country === 'US' ? 'F' : 'C'
  const city =
    location?.city ||
    (location?.region ? `${location.region}` : null) ||
    ''
  const label = weatherLabel(weather.code)

  return (
    <div
      className={`${styles.weather} ${className ?? ''}`}
      title={label ?? undefined}
    >
      <span className={styles.temp}>
        {Math.round(weather.temperature)}°{unit}
      </span>
      <span className={styles.city}>{city}</span>
      {label && <span className={styles.cond}>{label}</span>}
    </div>
  )
}
