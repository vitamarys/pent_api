'use client';

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import s from "./ProjectAwards.module.scss";

export interface Award {
  image:    string;
  value:    string;
  label:    string;
  bgImage?: string;
}

export interface ProjectAwardsProps {
  sectionLabel?: string;
  awards:        Award[];
}

export default function ProjectAwards({
  sectionLabel = "Our Awards",
  awards,
}: ProjectAwardsProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(`.${s.card}`) as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : 348;
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
  };

  return (
    <section className={s.section}>
      <Container>
        <div className={s.header}>
          <span className={s.sectionLabel}>{sectionLabel}</span>
          <div className={s.navBtns}>
            <button className={s.navBtn} onClick={() => scroll("prev")} aria-label="Previous">
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button className={s.navBtn} onClick={() => scroll("next")} aria-label="Next">
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </Container>

      <Container className={s.trackContainer}>
        <div className={s.track} ref={trackRef}>
          {awards.map((award, i) => (
            <div key={i} className={s.card}>
              <div className={s.awardImgWrap}>
                {award.bgImage && (
                  <img
                    src={award.bgImage}
                    alt=""
                    className={s.awardBg}
                  />
                )}
                <img
                  src={award.image}
                  alt={award.label}
                  className={s.awardMain}
                />
              </div>
              <div className={s.cardInfo}>
                <p className={s.cardValue}>{award.value}</p>
                <p className={s.cardLabel}>{award.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
