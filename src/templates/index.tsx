import type { ComponentType } from 'react'
import type { FullClientData } from '@/core/types'
import { MinimalistaTemplate } from './minimalista/MinimalistaTemplate'
import { ModernaTemplate } from './moderna/ModernaTemplate'
import { BlueTemplate } from './blue/BlueTemplate'
import { ModernoTemplate } from './moderno/ModernoTemplate'
import { TradicionalTemplate } from './tradicional/TradicionalTemplate'
import { AppTemplate } from './app/AppTemplate'
import { PetroleoTemplate } from './petroleo/PetroleoTemplate'
import { PlaylistTemplate } from './playlist/PlaylistTemplate'
import { CoveredTemplate } from './covered/CoveredTemplate'

export const DEFAULT_TEMPLATE_ID = 'minimalista'

export interface TemplateProps {
  clientData: FullClientData | undefined
  isLoading: boolean
}

const templates: Record<string, ComponentType<TemplateProps>> = {
  minimalista: MinimalistaTemplate,
  moderna: ModernaTemplate,
  blue: BlueTemplate,
  moderno: ModernoTemplate,
  tradicional: TradicionalTemplate,
  app: AppTemplate,
  petroleo: PetroleoTemplate,
  playlist: PlaylistTemplate,
  covered: CoveredTemplate
}

export function getTemplate(
  templateId?: string | null
): ComponentType<TemplateProps> {
  return (
    (templateId && templates[templateId]) || templates[DEFAULT_TEMPLATE_ID]
  )
}

export function TemplateSlot({
  templateId,
  clientData,
  isLoading
}: TemplateProps & { templateId?: string | null }) {
  const Template = getTemplate(templateId)
  return <Template clientData={clientData} isLoading={isLoading} />
}
