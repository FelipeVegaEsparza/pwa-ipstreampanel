import { Route, Routes } from 'react-router-dom'
import { ErrorScreen } from './ErrorScreen'
import { LoadingScreen } from './LoadingScreen'
import { useTenant } from '@/core/config/TenantContext'
import { useFullClientData } from '@/core/hooks/useFullClientData'
import { usePwaRegistration } from '@/modules/pwa/usePwaRegistration'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { ContentSections } from '@/modules/content/ContentSections'
import { NewsListPage } from '@/modules/content/NewsListPage'
import { PodcastsListPage } from '@/modules/content/PodcastsListPage'
import { VideocastsListPage } from '@/modules/content/VideocastsListPage'
import { NewsDetailPage } from '@/modules/content/NewsDetailPage'
import { PodcastDetailPage } from '@/modules/content/PodcastDetailPage'
import { VideocastDetailPage } from '@/modules/content/VideocastDetailPage'
import { TemplateSlot } from '@/templates'

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
  const { data, isLoading } = useFullClientData(clientId)

  usePwaRegistration(clientId)
  useDocumentTitle(data?.basicData?.projectName)

  return (
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
  )
}
