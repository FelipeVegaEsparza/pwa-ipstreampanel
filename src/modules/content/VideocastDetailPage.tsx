import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { buildImageUrl, getVideocastById } from '@/core/api'
import { useTenant } from '@/core/config/TenantContext'
import { ErrorScreen } from '@/app/ErrorScreen'
import { SmartImage, Skeleton } from '@/ui'
import { episodeMeta } from './format'
import styles from './content.module.css'

export function VideocastDetailPage() {
  const { id } = useParams()
  const tenant = useTenant()
  const clientId = tenant.status === 'ready' ? tenant.clientId : null

  const { data, isLoading, isError } = useQuery({
    queryKey: ['videocast', clientId, id],
    queryFn: () => getVideocastById(clientId!, id!),
    enabled: Boolean(clientId && id),
    retry: false
  })

  if (isError) {
    return (
      <ErrorScreen
        title="Episodio no encontrado"
        message="El videocast que buscas no está disponible."
      />
    )
  }

  if (isLoading || !data) {
    return <Skeleton rows={6} />
  }

  const videoUrl = buildImageUrl(data.videoUrl)

  return (
    <article>
      <h1 className={styles.sectionTitle}>{data.title}</h1>
      <p className={styles.muted}>
        {episodeMeta(data.season, data.episodeNumber, data.duration)}
      </p>
      {videoUrl && (
        <video className={styles.video} controls playsInline src={videoUrl} />
      )}
      <SmartImage className={styles.media} src={data.imageUrl} alt={data.title} />
      <p className={styles.sectionBody}>{data.description}</p>
    </article>
  )
}
