'use client'

import { useState } from 'react'
import type { WorkStep } from './WorkProgress'
import s from './WorkProgress.module.scss'

export function WorkProgressSteps({ steps }: { steps: WorkStep[] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={s.stepsCol}>
      <div className={`${s.stepsWrap} ${expanded ? s.expanded : ''}`}>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1
          return (
            <div key={step.id ?? i} className={s.step}>
              <div className={s.stepHeader}>
                <div className={s.stepNumber}>{i + 1}</div>
                <p className={s.stepTitle}>{step.title}</p>
              </div>
              <div className={s.stepContent}>
                <div className={`${s.connector} ${isLast ? s.connectorLast : ''}`} />
                <p className={s.stepText}>{step.value}</p>
              </div>
            </div>
          )
        })}

        {!expanded && steps.length > 3 && (
          <div className={s.fadeOverlay}>
            <button className={s.seeMoreBtn} onClick={() => setExpanded(true)}>
              See more
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
