'use client'

import Image from 'next/image'
import { useState } from 'react'
import Container from '@/components/ui/Container'
import s from './AreaOverview.module.scss'

export interface OverviewTab {
  label: string
  content: string
  image?: string
}

export interface AreaOverviewProps {
  sectionTitle?: string
  tabs?: OverviewTab[]
}

export default function AreaOverview({
  sectionTitle = 'Area Overview',
  tabs = [],
}: AreaOverviewProps) {
  const [activeTab, setActiveTab] = useState(0)
  const activeContent = tabs[activeTab]?.content ?? ''

  return (
    <section className={s.section}>
      <Container>
        <div className={s.inner}>

          {/* ── Top content block ── */}
          <div className={s.header}>
            <h2 className={s.title}>{sectionTitle}</h2>

            <div className={s.body}>
              {/* Tabs (left on desktop, top on tablet/mobile) */}
              <div className={s.tabsCol}>
                <div className={s.tabs} role="tablist">
                  {tabs.map((tab, i) => (
                    <button
                      key={i}
                      role="tab"
                      aria-selected={i === activeTab}
                      className={`${s.tab} ${i === activeTab ? s.tabActive : ''}`}
                      onClick={() => setActiveTab(i)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text content (right on desktop, bottom on tablet/mobile) */}
              {activeContent && (
                <p className={s.content} role="tabpanel">
                  {activeContent}
                </p>
              )}
            </div>
          </div>

          {/* ── Image ── */}
          {tabs.some(t => t.image) && (
            <div className={s.imageWrap}>
              {tabs.map((tab, i) =>
                tab.image ? (
                  <Image
                    key={tab.image}
                    src={tab.image}
                    alt={tab.label}
                    fill
                    className={`${s.img} ${i === activeTab ? s.imgActive : ''}`}
                    sizes="(max-width: 768px) 100vw, 80vw"
                    priority={i === 0}
                  />
                ) : null
              )}
            </div>
          )}

        </div>
      </Container>
    </section>
  )
}
