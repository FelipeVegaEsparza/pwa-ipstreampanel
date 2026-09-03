import { useEffect } from 'react'
import Hls from 'hls.js'

export function useHlsVideo(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  src: string | null
) {
  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      return
    }

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => hls.destroy()
    }
  }, [src, videoRef])
}
