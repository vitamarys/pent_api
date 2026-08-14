'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import Container from '@/components/ui/Container'
import { WorkProgressSteps } from './WorkProgressSteps'
import s from './WorkProgress.module.scss'

function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url)
    // youtu.be/ID
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1`
    }
    // youtube.com/watch?v=ID
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}?autoplay=1`
    }
  } catch {}
  return url
}

export interface WorkStep {
  id: number
  title: string
  value: string
}

export interface WorkProgressProps {
  sectionTitle?: string
  description?: string
  steps: WorkStep[]
  videoUrl?: string
  videoButton?: string
  previewImage?: string
}

export default function WorkProgress({
  sectionTitle = 'Working Process',
  description,
  steps,
  videoUrl,
  videoButton = 'Play Video',
  previewImage,
}: WorkProgressProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section className={s.section}>
        <Container>
          <h2 className={s.title}>{sectionTitle}</h2>

          <div className={s.body}>
            {description && <p className={s.description}>{description}</p>}
            <WorkProgressSteps steps={steps} />
          </div>

          {previewImage && (
            <div className={s.video}>
              <Image src={previewImage} alt={sectionTitle} fill className={s.videoImg} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px" />
              {videoUrl && (
                <button className={s.playBtn} onClick={() => setModalOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
                    <path d="M8.50193 5.0527C9.09566 5.44852 9.09565 6.32098 8.50191 6.7168L2.30469 10.8482C1.64014 11.2912 0.75 10.8148 0.75 10.0161L0.75 1.75315C0.75 0.954445 1.64016 0.478055 2.30471 0.921103L8.50193 5.0527Z" stroke="#1F1F1F" strokeWidth="1.5"/>
                  </svg>
                  <span>{videoButton}</span>
                </button>
              )}
            </div>
          )}
        </Container>
      </section>

      {modalOpen && videoUrl && (
        <div className={s.videoModal} onClick={() => setModalOpen(false)}>
          <button className={s.videoModalClose} onClick={() => setModalOpen(false)}>
            <X size={24} strokeWidth={1.5} />
          </button>
          <div className={s.videoModalInner} onClick={e => e.stopPropagation()}>
            <iframe
              src={toEmbedUrl(videoUrl)}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className={s.videoModalIframe}
            />
          </div>
        </div>
      )}
    </>
  )
}
