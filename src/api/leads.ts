import strapiClient from '@/lib/axios'
import type { PenthouseLeadData } from '@/types/penthouse-api'

export async function submitLead(leadData: PenthouseLeadData): Promise<void> {
  await strapiClient.post('/api/leads', { data: leadData })
}
