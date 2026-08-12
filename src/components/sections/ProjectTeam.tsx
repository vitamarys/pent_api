'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Container from "@/components/ui/Container";
import s from "./ProjectTeam.module.scss";
const PopConsultation = dynamic(() => import('@/components/ui/PopConsultation'))

export interface TeamStat {
  value: string;
  label: string;
}

export interface ProjectTeamProps {
  title?:       string;
  description?: string;
  image:        string;
  stats?:       TeamStat[];
  ctaLabel?:    string;
}

export default function ProjectTeam({
  title       = "Who We Are",
  description = "Metropolitan Premium Properties is an award-winning real estate company in Dubai. We are part of the Metropolitan Group, which was founded in 2008. Starting with property sales in Dubai, we have expanded to the global market. Today, we serve clients from all over the world, with offices in Dubai, Abu Dhabi, and Vienna.",
  image,
  stats,
  ctaLabel = "Contact us",
}: ProjectTeamProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
    <section className={s.section}>
      <Container>
        <div className={s.inner}>

          {/* Left: text + stats + button */}
          <div className={s.textCol}>
            <div className={s.textBlock}>
              <h2 className={s.title}>{title}</h2>
              <p className={s.description}>{description}</p>
            </div>

            {stats && stats.length > 0 && (
              <div className={s.statsGrid}>
                {stats.map((stat, i) => (
                  <div key={i} className={s.statItem}>
                    <span className={s.statValue}>{stat.value}</span>
                    <span className={s.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}

            <button className={s.ctaBtn} onClick={() => setOpen(true)}>
              {ctaLabel}
            </button>
          </div>

          {/* Right: team image */}
          <div className={s.imageWrap}>
            {image && <Image src={image} alt={title} fill className={s.image} sizes="(max-width: 768px) 100vw, 50vw" />}
          </div>

        </div>
      </Container>
    </section>
    <PopConsultation open={open} onClose={() => setOpen(false)} />
    </>
  );
}
