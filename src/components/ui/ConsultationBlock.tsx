'use client'

import { useState } from 'react'
import ProjectForm from '@/components/sections/ProjectForm'
import PopConsultation from '@/components/ui/PopConsultation'
import type { AgentInfo } from '@/components/sections/ProjectForm'

interface ConsultationBlockProps {
  sectionTitle?: string
  description?:  string
  submitLabel?:  string
  agent?:        AgentInfo
  whatsappHref?: string
}

export default function ConsultationBlock({
  sectionTitle,
  description,
  submitLabel,
  agent,
  whatsappHref,
}: ConsultationBlockProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ProjectForm
        sectionTitle={sectionTitle}
        description={description}
        submitLabel={submitLabel}
        agent={agent}
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
      />
    </>
  )
}
