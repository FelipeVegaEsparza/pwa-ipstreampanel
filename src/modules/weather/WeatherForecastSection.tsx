import type { SectionDataProps } from '@/modules/content/format'
import { Section } from '@/ui'
import { WeatherForecast } from './WeatherForecast'
import { useWeatherForecast } from './useWeather'

export function WeatherForecastSection({ clientData }: SectionDataProps) {
  const location = clientData?.basicData?.location
  const { days, loading } = useWeatherForecast(location)

  return (
    <Section
      title="Clima"
      visible={days.length > 0}
      loading={loading && days.length === 0}
    >
      <WeatherForecast days={days} country={location?.country} />
    </Section>
  )
}
