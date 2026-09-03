import { useState } from 'react'
import { buildImageUrl } from '@/core/api'

interface SmartImageProps {
  src?: string | null
  alt: string
  fallbacks?: Array<string | null | undefined>
  className?: string
}

interface ImageState {
  index: number
  failed: boolean
}

export function SmartImage({ src, alt, fallbacks, className }: SmartImageProps) {
  const chain = [
    buildImageUrl(src),
    ...(fallbacks ?? []).map((item) => buildImageUrl(item))
  ].filter((item): item is string => Boolean(item))

  const [state, setState] = useState<ImageState>({ index: 0, failed: false })
  const [firstUrl, setFirstUrl] = useState<string | null>(chain[0] ?? null)

  if (firstUrl !== (chain[0] ?? null)) {
    setFirstUrl(chain[0] ?? null)
    setState({ index: 0, failed: false })
  }

  if (state.failed) return null

  const current = chain[state.index]
  if (!current) return null

  return (
    <img
      className={className}
      src={current}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        setState((prev) => {
          if (prev.index < chain.length - 1) {
            return { index: prev.index + 1, failed: false }
          }
          return { index: prev.index, failed: true }
        })
      }}
    />
  )
}
