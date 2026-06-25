import { useQuery } from '@tanstack/react-query'
import { getProjectBySlug } from '@/api/projects'

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => getProjectBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
}
