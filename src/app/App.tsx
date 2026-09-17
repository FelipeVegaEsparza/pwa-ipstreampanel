import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ErrorScreen } from './ErrorScreen'
import { LoadingScreen } from './LoadingScreen'
import { useTenant } from '@/core/config/TenantContext'
import { useFullClientData } from '@/core/hooks/useFullClientData'
import { usePwaRegistration } from '@/modules/pwa/usePwaRegistration'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { ContentSections } from '@/modules/content/ContentSections'
import { TemplateSlot } from '@/templates'

// Rutas de listado/detalle: se cargan bajo demanda (code-splitting) para no
// engordar el bundle inicial de la home.
const NewsListPage = lazy(() =>
  import('@/modules/content/NewsListPage').then((m) => ({ default: m.NewsListPage }))
)
const NewsDetailPage = lazy(() =>
  import('@/modules/content/NewsDetailPage').then((m) => ({ default: m.NewsDetailPage }))
)
const PodcastsListPage = lazy(() =>
  import('@/modules/content/PodcastsListPage').then((m) => ({ default: m.PodcastsListPage }))
)
const PodcastDetailPage = lazy(() =>
  import('@/modules/content/PodcastDetailPage').then((m) => ({ default: m.PodcastDetailPage }))
)
const VideocastsListPage = lazy(() =>
  import('@/modules/content/VideocastsListPage').then((m) => ({ default: m.VideocastsListPage }))
)
const VideocastDetailPage = lazy(() =>
  import('@/modules/content/VideocastDetailPage').then((m) => ({ default: m.VideocastDetailPage }))
)

// Tiempo mínimo que el splash permanece visible aunque los datos lleguen antes,
// para que se alcance a apreciar.
const SPLASH_MIN_MS = 1200

export function App() {
  const tenant = useTenant()

  if (tenant.status === 'resolving') {
    return <LoadingScreen />
  }

  if (tenant.status === 'notFound') {
    return <ErrorScreen />
  }

  return <TenantApp clientId={tenant.clientId} />
}

function TenantApp({ clientId }: { clientId: string }) {
  const { data, isLoading, isError, refetch } = useFullClientData(clientId)
  const [splashMinElapsed, setSplashMinElapsed] = useState(false)

  usePwaRegistration(clientId)
  useDocumentTitle(data?.basicData?.projectName)

  // El splash se muestra al menos SPLASH_MIN_MS desde el montaje del tenant.
  useEffect(() => {
    const timer = setTimeout(() => setSplashMinElapsed(true), SPLASH_MIN_MS)
    return () => clearTimeout(timer)
  }, [])

  if (isError && !data) {
    return (
      <ErrorScreen
        title="No pudimos cargar el contenido"
        message="Hubo un problema de conexión con el servidor. Revisa tu conexión a internet e inténtalo de nuevo."
        onRetry={() => void refetch()}
      />
    )
  }

  // Mientras no sepamos el `selectedTemplate`, mostramos el splash en vez del
  // template por defecto (evita el flash de "minimalista" y luego el elegido).
  // Además se respeta un tiempo mínimo para que el splash se aprecie.
  if (!splashMinElapsed || (isLoading && !data)) {
    return <LoadingScreen />
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route
          element={
            <TemplateSlot
              templateId={data?.selectedTemplate}
              clientData={data}
              isLoading={isLoading}
            />
          }
        >
          <Route index element={<ContentSections />} />
          <Route path="noticias" element={<NewsListPage />} />
          <Route path="noticias/:slug" element={<NewsDetailPage />} />
          <Route path="podcasts" element={<PodcastsListPage />} />
          <Route path="podcasts/:id" element={<PodcastDetailPage />} />
          <Route path="videocasts" element={<VideocastsListPage />} />
          <Route path="videocasts/:id" element={<VideocastDetailPage />} />
          <Route
            path="*"
            element={
              <ErrorScreen
                title="Página no encontrada"
                message="La ruta solicitada no existe."
              />
            }
          />
        </Route>
      </Routes>
    </Suspense>
  )
}
