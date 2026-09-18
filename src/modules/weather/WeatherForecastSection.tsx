import type { SectionDataProps } from '@/modules/content/format'
import { Section } from '@/ui'
import { WeatherForecast } from './WeatherForecast'
import { useWeatherForecast } from './useWeather'

export function WeatherForecastSection({ clientData }: SectionDataProps) {
  const location = clientData?.basicData?.location
  const city = location?.city?.trim() ?? ''
  const hasCity = city.length > 0
  const { days, loading } = useWeatherForecast(location)

  return (
    <Section
      title={`Proyección del clima en ${city}`}
      visible={hasCity && days.length > 0}
      loading={hasCity && loading && days.length === 0}
    >
      <WeatherForecast days={days} country={location?.country} />
    </Section>
  )
}
