'use client';

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Container from "@/components/ui/Container";
import { formatCompactPrice } from "@/lib/utils";
import s from "./ProjectFloorPlan.module.scss";

import "swiper/css";
import "swiper/css/pagination";

export interface FloorPlanCard {
  title: string;
  type: string;
  optionsLabel?: string;
  bedroomsLabel?: string;
  image: string;
  startingPrice: string | number;
  livingArea: string | number;

}

export interface FloorPlanTab {
  label: string;
  value: string;
}

export interface ProjectFloorPlanProps {
  sectionTitle?: string;
  tabs: FloorPlanTab[];
  cards: FloorPlanCard[];
}

function parsePrice(price: string | number): number {
  const s = String(price).trim().toUpperCase()
  const num = parseFloat(s.replace(/[^\d.]/g, ''))
  if (!num) return 0
  if (s.includes('KK')) return num * 1_000_000
  if (s.includes('M')) return num * 1_000_000
  if (s.includes('K')) return num * 1_000
  return num
}

function calcCostPerSqm(price: string | number, livingArea: string | number): string | null {
  const priceNum = parsePrice(price)
  const areaNum = parseFloat(String(livingArea).replace(/[^\d.]/g, ''))
  if (!priceNum || !areaNum) return null
  const areaM2 = areaNum * 0.0929
  return formatCompactPrice(Math.round(priceNum / areaM2))
}

export default function ProjectFloorPlan({
  sectionTitle = "Layouts",
  tabs,
  cards,
}: ProjectFloorPlanProps) {
  const [activeTab, setActiveTab] = useState("all");
  const swiperRef = useRef<SwiperType | null>(null);

  const filteredCards =
    activeTab === "all"
      ? cards
      : cards.filter((c) => c.type.toLowerCase() === activeTab.toLowerCase());

  const uniqueTypes = new Set(cards.map((c) => c.type.toLowerCase()))
  const showTabs = tabs.length > 0 && uniqueTypes.size > 1;
  const showNav = filteredCards.length > 3;

  useEffect(() => {
    swiperRef.current?.slideTo(0);
  }, [activeTab]);

  return (
    <section className={s.section}>
      <Container>
        <div className={s.header}>
          <h2 className={s.sectionTitle}>{sectionTitle}</h2>

          {showTabs && (
            <div className={s.tabsBar}>
              <button
                className={`${s.tab} ${activeTab === "all" ? s.active : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All
              </button>
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  className={`${s.tab} ${activeTab === tab.value ? s.active : ""}`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className={`${s.navButtons} ${!showNav ? s.hidden : ''}`}>
            <button
              className={s.navBtn}
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className={s.navBtn}
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <Swiper
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          modules={[Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            768:  { slidesPerView: 2, pagination: { clickable: true } },
            1200: { slidesPerView: 3, pagination: false },
          }}
          className={s.swiper}
        >
          {filteredCards.map((card, i) => (
            <SwiperSlide key={i} className={s.slide}>
              <div className={s.card}>

                {/* Card header */}
                <div className={s.cardHeader}>
                  <span className={s.dot} />
                  
                  <div className={s.cardInfo}>
                    <p className={s.cardTitle}>
                      {card.bedroomsLabel
                        ? card.bedroomsLabel.toLowerCase() === 'studio'
                          ? card.bedroomsLabel
                          : `${card.bedroomsLabel} Bedrooms`
                        : card.title}
                    </p>
                    <p className={s.cardType}>{card.type}</p>
                  </div>
                  {card.optionsLabel && (
                    <div className={s.badge}>
                      <span>{card.optionsLabel}</span>
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>

                {/* Floor plan image */}
                <div className={s.floorPlan}>
                  {card.image && <img src={card.image} alt={card.title} />}
                </div>

                {/* Stats */}
                <div className={s.stats}>
                  <div className={s.statItem}>
                    <span className={s.statLabel}>Starting price:</span>
                    <span className={s.statValue}>{card.startingPrice}</span>
                  </div>
                  <div className={s.statItem}>
                    <span className={s.statLabel}>Living area:</span>
                    <span className={s.statValue}>{card.livingArea}</span>
                  </div>
                  {calcCostPerSqm(card.startingPrice, card.livingArea) && (
                    <div className={s.statItem}>
                      <span className={s.statLabel}>Cost per m²:</span>
                      <span className={s.statValue}>{calcCostPerSqm(card.startingPrice, card.livingArea)}</span>
                    </div>
                  )}
                </div>

                <button className={s.checkBtn}>Check Availability</button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
}
