import { useQuery } from '@tanstack/react-query'
import { getStreaming } from '@/core/api'
import type { Streaming } from '@/core/types'

export function useStreaming(clientId: string) {
  return useQuery<Streaming>({
    queryKey: ['streaming', clientId],
    queryFn: () => getStreaming(clientId),
    enabled: Boolean(clientId),
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    retry: 1
  })
}
