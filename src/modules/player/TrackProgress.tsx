import { useTrackProgress } from './useTrackProgress'
import styles from './TrackProgress.module.css'

interface TrackProgressProps {
  duration: number | null | undefined
  trackKey: string | null | undefined
  isPlaying: boolean
  serverElapsed?: number | null
  variant?: 'full' | 'thin'
}

function formatTime(totalSeconds: number): string {
  const secs = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(secs / 60)
  const seconds = secs % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function TrackProgress({
  duration,
  trackKey,
  isPlaying,
  serverElapsed,
  variant = 'full'
}: TrackProgressProps) {
  const { progress, current, duration: durationSec } = useTrackProgress(
    duration,
    trackKey,
    isPlaying,
    serverElapsed
  )

  if (!durationSec) return null

  if (variant === 'thin') {
    return (
      <div className={styles.thin}>
        <div className={styles.bar}>
          <div className={styles.fill} style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.full}>
      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${progress * 100}%` }} />
      </div>
      <div className={styles.times}>
        <span>{formatTime(current)}</span>
        <span>{formatTime(durationSec)}</span>
      </div>
    </div>
  )
}
