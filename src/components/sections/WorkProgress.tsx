'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import s from './WorkProgress.module.scss';

export interface WorkStep {
  id: number;
  title: string;
  value: string;
}

export interface WorkProgressProps {
  sectionTitle?: string;
  description?: string;
  steps: WorkStep[];
  videoUrl?: string;
  videoButton?: string;
  previewImage?: string;
}

export default function WorkProgress({
  sectionTitle = 'Working Process',
  description,
  steps,
  videoUrl,
  videoButton = 'Play Video',
  previewImage,
}: WorkProgressProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={s.section}>
      <Container>
        <h2 className={s.title}>{sectionTitle}</h2>

        <div className={s.body}>
          {description && <p className={s.description}>{description}</p>}

          <div className={s.stepsCol}>
            <div className={`${s.stepsWrap} ${expanded ? s.expanded : ''}`}>
              {steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                return (
                  <div key={step.id} className={s.step}>
                    <div className={s.stepHeader}>
                      <div className={s.stepNumber}>{i + 1}</div>
                      <p className={s.stepTitle}>{step.title}</p>
                    </div>
                    <div className={s.stepContent}>
                      <div className={`${s.connector} ${isLast ? s.connectorLast : ''}`} />
                      <p className={s.stepText}>{step.value}</p>
                    </div>
                  </div>
                );
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
        </div>

        {previewImage && (
          <div className={s.video}>
            <img src={previewImage} alt={sectionTitle} className={s.videoImg} />
            {videoUrl && (
              <a href={videoUrl} target="_blank" rel="noopener noreferrer" className={s.playBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
                  <path d="M8.50193 5.0527C9.09566 5.44852 9.09565 6.32098 8.50191 6.7168L2.30469 10.8482C1.64014 11.2912 0.75 10.8148 0.75 10.0161L0.75 1.75315C0.75 0.954445 1.64016 0.478055 2.30471 0.921103L8.50193 5.0527Z" stroke="#1F1F1F" strokeWidth="1.5"/>
                </svg>
                <span>{videoButton}</span>
              </a>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
