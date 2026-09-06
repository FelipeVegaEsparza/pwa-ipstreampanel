import { useEffect, useState } from 'react'
import type { BasicLocation } from '@/core/types'

interface WeatherData {
  temperature: number
  code: number | null
}

const FETCH_TIMEOUT_MS = 12000

// Solo un número real y finito dentro del rango válido cuenta como coordenada:
// null/undefined/''/NaN o fuera de rango devuelven null ("sin coordenadas").
function latValue(location: BasicLocation | null | undefined): number | null {
  const lat = location?.latitude
  if (typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90) {
    return null
  }
  return lat
}

function lonValue(location: BasicLocation | null | undefined): number | null {
  const lon = location?.longitude
  if (typeof lon !== 'number' || !Number.isFinite(lon) || lon < -180 || lon > 180) {
    return null
  }
  return lon
}

export function useWeather(location: BasicLocation | null | undefined) {
  const [data, setData] = useState<WeatherData | null>(null)

  const lat = latValue(location)
  const lon = lonValue(location)
  const hasCoords = Boolean(location) && lat !== null && lon !== null
  const country = location?.country

  useEffect(() => {
    // Sin coordenadas válidas se trata igual que sin ubicación:
    // datos en null y ningún fetch (evita consultar (0,0) en mar abierto).
    if (!hasCoords || lat === null || lon === null) {
      setData(null)
      return
    }

    const unit = country === 'US' ? 'fahrenheit' : 'celsius'
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current_weather=true&temperature_unit=${unit}`

    let active = true
    let controller: AbortController | null = null
    let timer: number | undefined

    const attempt = () => {
      if (!active) return
      if (controller) controller.abort()
      if (timer !== undefined) window.clearTimeout(timer)

      const next = new AbortController()
      controller = next
      timer = window.setTimeout(() => next.abort(), FETCH_TIMEOUT_MS)

      fetch(url, { signal: next.signal })
        .then((res) =>
          res.ok ? res.json() : Promise.reject(new Error(String(res.status)))
        )
        .then((json) => {
          if (!active) return
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
        .catch(() => {
          // Fallo de red o timeout: se reintenta solo al volver online
          // o al volver visible la pestaña (ver listeners abajo).
        })
    }

    const handleOnline = () => attempt()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') attempt()
    }

    attempt()

    window.addEventListener('online', handleOnline)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      active = false
      if (controller) controller.abort()
      if (timer !== undefined) window.clearTimeout(timer)
      window.removeEventListener('online', handleOnline)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [hasCoords, lat, lon, country])

  return data
}
