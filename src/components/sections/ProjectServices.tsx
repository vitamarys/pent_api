'use client';

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import s from "./ProjectServices.module.scss";

export interface ServiceItem {
  title:       string;
  description: string;
  image:       string;
}

export interface ProjectServicesProps {
  sectionTitle?: string;
  services:      ServiceItem[];
}

export default function ProjectServices({
  sectionTitle = "Our services",
  services,
}: ProjectServicesProps) {
  const [active, setActive] = useState(0);
  const total = services.length;

  const prev = () => setActive(a => (a - 1 + total) % total);
  const next = () => setActive(a => (a + 1) % total);

  // Put the active dot at 270° (9 o'clock / left position)
  const ringRotation = 270 - (active * 360) / total;

  const svc = services[active];

  return (
    <section className={s.section}>
      <div className={s.stage}>

        {/* ── Sidebar ─────────────────────────────────────── */}
        <div className={s.sidebar}>
          <h2 className={s.sectionTitle}>{sectionTitle}</h2>

          <div className={s.serviceInfo} key={active}>
            <p className={s.serviceName}>{svc.title}</p>
            <p className={s.serviceDesc}>{svc.description}</p>
          </div>

          <div className={s.navRow}>
            <button className={s.navBtn} onClick={prev} aria-label="Previous">
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button className={s.navBtn} onClick={next} aria-label="Next">
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* ── Circle timeline ──────────────────────────────── */}
        <div className={s.circleWrap}>
          <div
            className={s.circleRing}
            style={{ transform: `rotate(${ringRotation}deg)` }}
          >
            {services.map((_, i) => {
              const rad = (i * 2 * Math.PI) / total;
              const x   = 300 * Math.sin(rad);
              const y   = -300 * Math.cos(rad);
              return (
                <button
                  key={i}
                  aria-label={`Service ${i + 1}`}
                  className={`${s.dot} ${i === active ? s.dotActive : ''}`}
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  onClick={() => setActive(i)}
                />
              );
            })}
          </div>

        </div>

        {/* ── Counter — desktop only, above image ──────────── */}
        <div className={s.counter}>
          <span className={s.counterNum}>{active + 1}</span>
          <span className={s.counterTotal}>/{total}</span>
        </div>

        {/* ── Image panel ──────────────────────────────────── */}
        <div className={s.imagePanel}>
          {services.map((item, i) => (
            <img
              key={i}
              src={item.image}
              alt={item.title}
              className={`${s.img} ${i === active ? s.imgVisible : ''}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
