'use client'

import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react";
import Container from "@/components/ui/Container";
import s from "./ProjectAmenities.module.scss";

export interface AmenityItem {
  label: string;
  image: string;
}

export interface ProjectAmenitiesProps {
  sectionTitle?: string;
  items: AmenityItem[];
  totalCount?: number;
  showAllLabel?: string;
}

function AmenityCard({ item, className }: { item: AmenityItem; className?: string }) {
  return (
    <div className={`${s.card} ${className ?? ""}`}>
      {item.image && <img src={item.image} alt={item.label} className={s.cardImg} />}
      <div className={s.cardLabel}>
        <span className={s.dot} />
        <span className={s.labelText}>{item.label}</span>
      </div>
    </div>
  );
}

export default function ProjectAmenities({
  sectionTitle = "Amenities",
  items,
  totalCount,
  showAllLabel = "Show all amenities",
}: ProjectAmenitiesProps) {
  const [open, setOpen] = useState(false)
  const [main, ...rest] = items;
  const [item2, item3, item4] = rest;
  const count = totalCount ?? items.length

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <section className={s.section}>
      <Container>
        <h2 className={s.sectionTitle}>{sectionTitle}</h2>

        {/* ── Desktop layout ── */}
        <div className={s.desktopGrid}>
          {main && <AmenityCard item={main} className={s.mainCard} />}

          <div className={s.rightCol}>
            <div className={s.rightTop}>
              {item2 && <AmenityCard item={item2} className={s.wideCard} />}
              <div className={s.counterTile} onClick={() => setOpen(true)}>
                <Plus size={24} color="white" strokeWidth={1.5} />
                <span className={s.counterText}>All amenities: {count}</span>
              </div>
            </div>
            <div className={s.rightBottom}>
              {item3 && <AmenityCard item={item3} className={s.halfCard} />}
              {item4 && <AmenityCard item={item4} className={s.halfCard} />}
            </div>
          </div>
        </div>

        {/* ── Tablet / Mobile layout ── */}
        <div className={s.mobileScroll}>
          {items.map((item, i) => (
            <AmenityCard key={i} item={item} className={s.scrollCard} />
          ))}
        </div>
        <button className={s.showAllBtn} onClick={() => setOpen(true)}>
          {count ? `All amenities: ${count}` : showAllLabel}
        </button>

      </Container>

      {/* ── Modal ── */}
      {open && (
        <div className={s.modalOverlay} onClick={() => setOpen(false)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h3 className={s.modalTitle}>{sectionTitle}</h3>
              <button className={s.modalClose} onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={s.modalGrid}>
              {items.map((item, i) => (
                <div key={i} className={s.modalItem}>
                  <span className={s.dot} />
                  <span className={s.modalItemLabel}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
