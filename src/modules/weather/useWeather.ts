import { useEffect, useState } from 'react'
import type { BasicLocation } from '@/core/types'

interface WeatherData {
  temperature: number
  code: number | null
}

export function useWeather(location: BasicLocation | null | undefined) {
  const [data, setData] = useState<WeatherData | null>(null)

  const lat = Number(location?.latitude)
  const lon = Number(location?.longitude)
  const hasCoords =
    Boolean(location) && Number.isFinite(lat) && Number.isFinite(lon)

  useEffect(() => {
    if (!hasCoords) {
      setData(null)
      return
    }

    const controller = new AbortController()
    const unit = location?.country === 'US' ? 'fahrenheit' : 'celsius'
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current_weather=true&temperature_unit=${unit}`

    fetch(url, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((json) => {
        const current = json?.current_weather
        if (current && typeof current.temperature === 'number') {
          setData({
            temperature: current.temperature,
            code: typeof current.weathercode === 'number' ? current.weathercode : null
          })
        } else {
          setData(null)
        }
      })
      .catch(() => setData(null))

    return () => controller.abort()
  }, [hasCoords, lat, lon, location?.country])

  return data
}
