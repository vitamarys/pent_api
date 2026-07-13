'use client'

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
  const activeImage = tabs[activeTab]?.image ?? ''

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
          {activeImage && (
            <div className={s.imageWrap}>
              <img src={activeImage} alt={sectionTitle} className={s.img} />
            </div>
          )}

        </div>
      </Container>
    </section>
  )
}
