import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

export type HlsVideoStatus = 'loading' | 'playing' | 'error'

export interface HlsVideoHandle {
  status: HlsVideoStatus
  reload: () => void
}

const MAX_NETWORK_RETRIES = 3
const MAX_MEDIA_RETRIES = 3

export function useHlsVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  src: string | null
): HlsVideoHandle {
  const [status, setStatus] = useState<HlsVideoStatus>('loading')
  const [reloadTick, setReloadTick] = useState(0)
  const networkRetries = useRef(0)
  const mediaRetries = useRef(0)

  const reload = useCallback(() => {
    networkRetries.current = 0
    mediaRetries.current = 0
    setReloadTick((tick) => tick + 1)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) {
      setStatus('loading')
      return
    }

    networkRetries.current = 0
    mediaRetries.current = 0
    setStatus('loading')

    // Reproducción nativa (p. ej. Safari): la fuente se asigna al elemento.
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      const handlePlaying = () => setStatus('playing')
      const handleError = () => setStatus('error')
      const handleStalled = () => setStatus('error')

      video.addEventListener('playing', handlePlaying)
      video.addEventListener('error', handleError)
      video.addEventListener('stalled', handleStalled)

      video.src = src
      // Reasignar el mismo src no reinicia el elemento nativo: load() fuerza
      // la recarga cuando reintentamos tras un error.
      video.load()

      return () => {
        video.removeEventListener('playing', handlePlaying)
        video.removeEventListener('error', handleError)
        video.removeEventListener('stalled', handleStalled)
      }
    }

    // hls.js se carga bajo demanda (chunk aparte) para no engordar el bundle
    // inicial de las radios que no usan señal de TV.
    let disposed = false
    let hls: InstanceType<typeof import('hls.js')['default']> | null = null

    void import('hls.js')
      .then(({ default: HlsModule }) => {
        if (disposed) return
        if (!HlsModule.isSupported()) return

        const instance = new HlsModule()
        hls = instance
        instance.loadSource(src)
        instance.attachMedia(video)

        instance.on(HlsModule.Events.MANIFEST_PARSED, () => {
          if (!disposed) setStatus('playing')
        })

        instance.on(HlsModule.Events.ERROR, (_event, data) => {
          if (disposed) return

          if (data.type === HlsModule.ErrorTypes.NETWORK_ERROR) {
            if (networkRetries.current < MAX_NETWORK_RETRIES) {
              networkRetries.current += 1
              instance.startLoad()
            } else {
              setStatus('error')
            }
            return
          }

          if (data.type === HlsModule.ErrorTypes.MEDIA_ERROR) {
            if (mediaRetries.current < MAX_MEDIA_RETRIES) {
              mediaRetries.current += 1
              instance.recoverMediaError()
            } else {
              setStatus('error')
            }
            return
          }

          // Cualquier otro error fatal (mux/keySystem/other): sin recuperación.
          setStatus('error')
        })
      })
      .catch(() => {
        if (!disposed) setStatus('error')
      })

    return () => {
      disposed = true
      hls?.destroy()
    }
  }, [src, videoRef, reloadTick])

  return { status, reload }
}
