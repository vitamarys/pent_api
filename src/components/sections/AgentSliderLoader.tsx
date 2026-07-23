import { searchAgents } from '@/api/agents'
import AgentSlider from './AgentSlider'

interface AgentSliderLoaderProps {
  sectionTitle?: string
  ctaLabel?: string
  ctaHref?: string
  limit?: number
}

export default async function AgentSliderLoader({
  sectionTitle,
  ctaLabel,
  ctaHref,
  limit = 6,
}: AgentSliderLoaderProps) {
  const res = await searchAgents({ page: 1 })
  const agents = (res?.data ?? []).slice(0, limit)

  if (agents.length === 0) return null

  return (
    <AgentSlider
      agents={agents}
      sectionTitle={sectionTitle}
      ctaLabel={ctaLabel}
      ctaHref={ctaHref}
    />
  )
}
