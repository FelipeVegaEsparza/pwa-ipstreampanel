import {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
  type ReactNode
} from 'react'

export interface PlayerContextValue {
  audio: HTMLAudioElement
  streamUrl: string | null
  isPlaying: boolean
  corsCapable: boolean
  setStreamUrl: (url: string) => void
  play: () => void
  pause: () => void
  toggle: () => void
}

const audioElement = new Audio()
audioElement.preload = 'none'

const PlayerContext = createContext<PlayerContextValue | null>(null)

interface PlayerProviderProps {
  children: ReactNode
}

function probeStream(url: string, onResult: (capable: boolean) => void) {
  let settled = false
  const finish = (capable: boolean) => {
    if (!settled) {
      settled = true
      onResult(capable)
    }
  }

  const onError = () => {
    audioElement.removeEventListener('error', onError)
    audioElement.removeEventListener('canplay', onCanPlay)
    audioElement.crossOrigin = null
    audioElement.load()
    finish(false)
  }
  const onCanPlay = () => {
    audioElement.removeEventListener('error', onError)
    audioElement.removeEventListener('canplay', onCanPlay)
    finish(true)
  }

  audioElement.crossOrigin = 'anonymous'
  audioElement.src = url
  audioElement.addEventListener('error', onError)
  audioElement.addEventListener('canplay', onCanPlay)
  audioElement.load()
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [streamUrl, setStreamUrlState] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [corsCapable, setCorsCapable] = useState(false)

  useEffect(() => {
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    audioElement.addEventListener('play', onPlay)
    audioElement.addEventListener('pause', onPause)
    return () => {
      audioElement.removeEventListener('play', onPlay)
      audioElement.removeEventListener('pause', onPause)
    }
  }, [])

  const setStreamUrl = useCallback((url: string) => {
    setStreamUrlState(url)
    setCorsCapable(false)
    probeStream(url, setCorsCapable)
  }, [])

  const play = useCallback(() => {
    void audioElement.play().catch(() => setIsPlaying(false))
  }, [])

  const pause = useCallback(() => {
    audioElement.pause()
  }, [])

  const toggle = useCallback(() => {
    if (audioElement.paused) {
      play()
    } else {
      pause()
    }
  }, [play, pause])

  return (
    <PlayerContext
      value={{
        audio: audioElement,
        streamUrl,
        isPlaying,
        corsCapable,
        setStreamUrl,
        play,
        pause,
        toggle
      }}
    >
      {children}
    </PlayerContext>
  )
}

export function usePlayer(): PlayerContextValue {
  const ctx = use(PlayerContext)
  if (!ctx) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return ctx
}
