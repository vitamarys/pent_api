'use client';

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import Container from "@/components/ui/Container";
import s from "./ProjectAwards.module.scss";
import 'swiper/css';

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
  const swiperRef = useRef<SwiperType | null>(null);

  const PAGE_WIDTH = 1440;
  const GAP_LARGE  = 32;
  const GAP_SMALL  = 16;
  const MOBILE_BP  = 767;

  const [offsetBefore, setOffsetBefore] = useState(GAP_LARGE);

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      if (vw <= MOBILE_BP) {
        setOffsetBefore(GAP_SMALL);
      } else {
        setOffsetBefore(vw > PAGE_WIDTH ? Math.floor((vw - PAGE_WIDTH) / 2) + GAP_LARGE : GAP_LARGE);
      }
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  return (
    <section className={s.section}>
      <Container>
        <div className={s.header}>
          <span className={s.sectionLabel} data-anim="heading" suppressHydrationWarning>{sectionLabel}</span>
          <div className={s.navBtns}>
            <button className={s.navBtn} onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous">
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button className={s.navBtn} onClick={() => swiperRef.current?.slideNext()} aria-label="Next">
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </Container>

      <Swiper
        onSwiper={swiper => { swiperRef.current = swiper; }}
        slidesPerView="auto"
        spaceBetween={16}
        slidesOffsetBefore={offsetBefore}
        slidesOffsetAfter={offsetBefore}
        className={s.swiper}
      >
        {awards.map((award, i) => (
          <SwiperSlide key={i} className={s.swiperSlide}>
            <div className={s.card}>
              <div className={s.awardImgWrap}>
                {award.bgImage && (
                  <Image
                    fill
                    src={award.bgImage}
                    alt=""
                    className={s.awardBg}
                    style={{ objectFit: 'contain' }}
                  />
                )}
                <Image
                  fill
                  src={award.image}
                  alt={award.label}
                  className={s.awardMain}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className={s.cardInfo}>
                <p className={s.cardValue}>{award.value}</p>
                <p className={s.cardLabel}>{award.label}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
