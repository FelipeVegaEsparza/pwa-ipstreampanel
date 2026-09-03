import { useTenant } from '@/core/config/TenantContext'
import { useStreaming } from '@/core/hooks/useStreaming'
import { useStreamingStatus } from '@/core/hooks/useStreamingStatus'
import { usePlayer } from './PlayerContext'
import { TrackProgress } from './TrackProgress'
import styles from './PlayerBar.module.css'

export function PlayerBar() {
  const { streamUrl, isPlaying, toggle } = usePlayer()
  const tenant = useTenant()
  const clientId = tenant.status === 'ready' ? tenant.clientId : null
  const { data: status } = useStreamingStatus(clientId ?? '')
  const { data: streaming } = useStreaming(clientId ?? '')

  const currentTrack = streaming?.currentTrack
  const trackCover = currentTrack?.coverUrl ?? null
  const trackKey =
    trackCover ?? `${currentTrack?.title ?? ''}|${currentTrack?.artist ?? ''}`

  return (
    <div className={styles.bar}>
      <TrackProgress
        variant="thin"
        duration={currentTrack?.duration}
        trackKey={trackKey}
        isPlaying={isPlaying}
        serverElapsed={currentTrack?.elapsed}
      />
      <div className={styles.content}>
        <button
          type="button"
          className={styles.playButton}
          onClick={toggle}
          disabled={!streamUrl}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <div className={styles.info}>
          <span className={styles.label}>
            {currentTrack?.title || 'En Vivo'}
          </span>
          <span className={styles.meta}>
            {status?.listeners ? `${status.listeners} oyentes · ` : ''}
            {currentTrack?.artist || (streamUrl ? 'Reproduciendo' : 'Reproductor listo')}
          </span>
        </div>
      </div>
    </div>
  )
}
