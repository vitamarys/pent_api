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

  if (total === 0) return null;

  const prev = () => setActive(a => (a - 1 + total) % total);
  const next = () => setActive(a => (a + 1) % total);

  // Put the active dot at 270° (9 o'clock / left position)
  const ringRotation = 270 - (active * 360) / total;

  const svc = services[active];

  const R = 300;
  const prevIdx = (active - 1 + total) % total;
  const nextIdx = (active + 1) % total;

  // Desktop: fixed neighbor dots + labels at 7 o'clock (210°) and 11 o'clock (330°)
  const lowerAngle = (210 * Math.PI) / 180;
  const upperAngle = (330 * Math.PI) / 180;
  const lowerPos = { x: Math.round(R + R * Math.sin(lowerAngle)), y: Math.round(R - R * Math.cos(lowerAngle)) };
  const upperPos = { x: Math.round(R + R * Math.sin(upperAngle)), y: Math.round(R - R * Math.cos(upperAngle)) };

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
              const x   = Math.round(300 * Math.sin(rad));
              const y   = Math.round(-300 * Math.cos(rad));
              // Desktop: fixed dots replace prev/next — hide ring versions there
              const isNeighbor = total >= 3 && (i === prevIdx || i === nextIdx);
              return (
                <button
                  key={i}
                  aria-label={`Service ${i + 1}`}
                  className={`${s.dot} ${i === active ? s.dotActive : ''} ${isNeighbor ? s.neighborRingDot : ''}`}
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  onClick={() => setActive(i)}
                />
              );
            })}
          </div>

          {total >= 3 && (
            <>
              {/* ── Desktop: fixed dots + labels at 7 & 11 o'clock ── */}
              <button
                className={`${s.dot} ${s.neighborDot}`}
                style={{ left: `${lowerPos.x}px`, top: `${lowerPos.y}px`, transform: 'translate(-50%, -50%)' }}
                onClick={() => setActive(prevIdx)}
                aria-label={services[prevIdx].title}
              />
              <div className={`${s.neighborLabel} ${s.neighborDot}`} style={{ left: `${lowerPos.x}px`, top: `${lowerPos.y}px` }}>
                <span className={s.neighborText}>{services[prevIdx].title}</span>
              </div>

              <button
                className={`${s.dot} ${s.neighborDot}`}
                style={{ left: `${upperPos.x}px`, top: `${upperPos.y}px`, transform: 'translate(-50%, -50%)' }}
                onClick={() => setActive(nextIdx)}
                aria-label={services[nextIdx].title}
              />
              <div className={`${s.neighborLabel} ${s.neighborDot}`} style={{ left: `${upperPos.x}px`, top: `${upperPos.y}px` }}>
                <span className={s.neighborText}>{services[nextIdx].title}</span>
              </div>

              {/* ── Tablet: dot on ring + text to the left ── */}
              {/* upper ~11 o'clock: ring intersects at (93, 83) in wrap */}
              <span className={`${s.tabletRingDot} ${s.tabletRingDotUpper}`} />
              <div className={`${s.tabletLabelText} ${s.tabletLabelTextUpper}`}>
                {services[nextIdx].title}
              </div>
              {/* lower ~7 o'clock: ring intersects at (66, 488) in wrap */}
              <span className={`${s.tabletRingDot} ${s.tabletRingDotLower}`} />
              <div className={`${s.tabletLabelText} ${s.tabletLabelTextLower}`}>
                {services[prevIdx].title}
              </div>

              {/* ── Mobile: two dots visible in viewport ── */}
              <button
                className={`${s.dot} ${s.mobileDot}`}
                style={{ left: '89px', top: '87px', transform: 'translate(-50%, -50%)' }}
                onClick={() => setActive(nextIdx)}
                aria-label={services[nextIdx].title}
              />
              <button
                className={`${s.dot} ${s.mobileDot}`}
                style={{ left: '89px', top: '511px', transform: 'translate(-50%, -50%)' }}
                onClick={() => setActive(prevIdx)}
                aria-label={services[prevIdx].title}
              />
            </>
          )}
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
