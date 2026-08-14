'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import ProjectForm from '@/components/sections/ProjectForm'
import type { AgentInfo } from '@/components/sections/ProjectForm'

const PopConsultation = dynamic(() => import('@/components/ui/PopConsultation'))

interface ConsultationBlockProps {
  sectionTitle?:  string
  description?:   string
  submitLabel?:   string
  agent?:         AgentInfo
  whatsappHref?:  string
  entity?:        string
  projectId?:     string
  pageBitrixId?:  string
  agentLeadId?:   string
}

export default function ConsultationBlock({
  sectionTitle,
  description,
  submitLabel,
  agent,
  whatsappHref,
  entity,
  projectId,
  pageBitrixId,
  agentLeadId,
}: ConsultationBlockProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ProjectForm
        sectionTitle={sectionTitle}
        description={description}
        submitLabel={submitLabel}
        agent={agent}
        entity={entity}
        projectId={projectId}
        pageBitrixId={pageBitrixId}
        agentLeadId={agentLeadId}
        onConsultationOpen={() => setOpen(true)}
      />

      <PopConsultation
        open={open}
        onClose={() => setOpen(false)}
        sectionTitle={sectionTitle}
        description={description}
        submitLabel={submitLabel}
        agent={agent}
        whatsappHref={whatsappHref}
        entity={entity}
        projectId={projectId}
        pageBitrixId={pageBitrixId}
        agentLeadId={agentLeadId}
      />
    </>
  )
}
